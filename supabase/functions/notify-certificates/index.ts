import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const subject = "GalxeCode'26 Participation Certificate";
const templateUrl = Deno.env.get("CERTIFICATE_TEMPLATE_URL");
const brevoApiKey = Deno.env.get("brevo_api_key");
const senderEmail = Deno.env.get("brevo_sender_email");
const senderName = Deno.env.get("brevo_sender_name") ?? "Team GALXECODE '26";

type Member = { name: string; email: string };
type Team = {
  id: string;
  team_name: string;
  leader_name: string;
  leader_email: string;
  members: Member[];
};

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[
        character
      ] ?? character
  );

const emailHtml = (name: string) => `
  <p>Hello ${escapeXml(name)},</p>
  <p>Thank you for being part of <strong>GalxeCode'26</strong> and for the effort you and your team put in on 7th September.</p>
  <p>We received a strong pool of teams, and after judging, your team did not advance to the next stage. That does not take away from what you built in a single day, with a problem statement revealed on the spot and the clock running. That is not easy, and you showed up and delivered.</p>
  <p>Your Certificate of Participation is attached to this email.</p>
  <p>What we would like you to take from this:</p>
  <ul>
    <li>Ideating, building and pitching under pressure is a skill few students practise. You now have that experience.</li>
    <li>The team you worked with is a network worth keeping.</li>
    <li>The next hackathon is a fresh start. Bring what you learned here.</li>
  </ul>
  <p>Thank you once again for making <strong>GalxeCode'26</strong> what it was.</p>
  <p>Warm regards,<br><strong>Team GalxeCode'26</strong><br><a href="mailto:contact@galxecode.in">contact@galxecode.in</a></p>
`;

const toBase64 = (bytes: Uint8Array) => {
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
};

const createCertificatePdf = async (background: Uint8Array, participantName: string) => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([566, 400]);
  const image = await pdf.embedPng(background);
  page.drawImage(image, { x: 0, y: 0, width: 566, height: 400 });

  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  const name = participantName.trim();
  const fontSize = name.length > 28 ? 19 : 24;
  const textWidth = font.widthOfTextAtSize(name, fontSize);
  const width = Math.min(textWidth, 350);
  page.drawRectangle({ x: 105, y: 205, width: 365, height: 50, color: rgb(1, 1, 1) });
  page.drawText(name, {
    x: 107,
    y: 220,
    size: fontSize,
    maxWidth: 350,
    font,
    color: rgb(0.07, 0.07, 0.07),
    characterSpacing: width < 350 ? 0 : -0.2,
  });

  return pdf.save();
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!templateUrl || !brevoApiKey || !senderEmail) {
    return json({ error: "Certificate email service is not configured" }, 503);
  }

  const authorization = request.headers.get("Authorization");
  if (!authorization?.startsWith("Bearer ")) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const viewer = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: userData, error: userError } = await viewer.auth.getUser();
  if (userError || !userData.user) return json({ error: "Unauthorized" }, 401);

  const body = await request.json().catch(() => null);
  const teamId = typeof body?.team_id === "string" ? body.team_id : "";
  if (!teamId) return json({ error: "team_id is required" }, 400);

  const { data: teams, error: teamError } = await viewer.rpc("admin_list_teams");
  if (teamError) return json({ error: teamError.message }, 403);
  const team = (teams as Team[] | null)?.find((candidate) => candidate.id === teamId);
  if (!team) return json({ error: "Team not found" }, 404);

  const templateResponse = await fetch(templateUrl);
  if (!templateResponse.ok) return json({ error: "Certificate background could not be loaded" }, 502);
  const template = new Uint8Array(await templateResponse.arrayBuffer());
  if (template.length === 0) return json({ error: "Certificate background is empty" }, 500);

  const recipients = [
    { name: team.leader_name, email: team.leader_email },
    ...(team.members ?? []),
  ].filter((member, index, all) => {
    const email = member.email.trim().toLowerCase();
    return email && all.findIndex((candidate) => candidate.email.trim().toLowerCase() === email) === index;
  });

  const results = await Promise.all(
    recipients.map(async (recipient) => {
      const certificate = await createCertificatePdf(template, recipient.name);
      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sender: { email: senderEmail, name: senderName },
          to: [{ email: recipient.email.trim().toLowerCase(), name: recipient.name }],
          subject,
          htmlContent: emailHtml(recipient.name),
          attachment: [
            {
              name: `GALXECODE-26-Participation-Certificate-${recipient.name.replace(/[^a-z0-9]+/gi, "-")}.pdf`,
              content: toBase64(certificate),
            },
          ],
        }),
      });
      const responseBody = await response.text();
      let providerResult: { messageId?: string; messageIds?: string[]; message?: string } = {};
      try {
        providerResult = JSON.parse(responseBody);
      } catch {
        providerResult = { message: responseBody.slice(0, 300) };
      }
      console.log("Brevo certificate email response", {
        email: recipient.email,
        status: response.status,
        messageId: providerResult.messageId ?? providerResult.messageIds?.[0],
        error: response.ok ? undefined : providerResult.message,
      });
      return {
        ok: response.ok,
        email: recipient.email,
        messageId: providerResult.messageId ?? providerResult.messageIds?.[0],
        error: response.ok ? undefined : providerResult.message ?? responseBody.slice(0, 300),
      };
    })
  );

  const failed = results.filter((result) => !result.ok);
  if (failed.length > 0) {
    return json({
      error: `Failed to send ${failed.length} certificate email(s)`,
      details: failed.map((result) => result.error),
      sent: results.length - failed.length,
    }, 502);
  }
  return json({
    sent: results.length,
    team_id: team.id,
    message_ids: results.map((result) => result.messageId).filter(Boolean),
  });
});
