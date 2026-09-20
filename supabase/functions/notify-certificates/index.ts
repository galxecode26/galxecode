import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const subject = "Your GALXECODE '26 Participation Certificate";
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

const certificateFor = (template: string, participantName: string) => {
  const safeName = escapeXml(participantName.trim());
  const overlay = `
    <rect x="105" y="145" width="365" height="50" fill="#ffffff"/>
    <text x="107" y="180" fill="#111111" font-family="Arial, Helvetica, sans-serif"
      font-size="24" font-weight="700" textLength="350" lengthAdjust="spacingAndGlyphs">${safeName}</text>
  `;
  return template.replace("</svg>", `${overlay}</svg>`);
};

const emailHtml = (name: string) => `
  <p>Dear ${escapeXml(name)},</p>
  <p>Greetings from the <strong>GALXECODE '26 – AI Vibe Coding Hackathon</strong> team!</p>
  <p>We sincerely thank you for participating in <strong>GALXECODE '26</strong> and being a part of this exciting journey of innovation, creativity, and technology.</p>
  <p>Your enthusiasm, participation, and contribution made the hackathon a memorable experience. We truly appreciate your efforts and spirit of innovation throughout the event.</p>
  <p>Please find your <strong>Participation Certificate attached to this email</strong> as a token of appreciation for your participation in <strong>GALXECODE '26 – AI Vibe Coding Hackathon</strong>.</p>
  <p>We hope this experience encouraged you to explore new technologies, experiment with AI-powered development, and continue building innovative solutions.</p>
  <p>Thank you once again for being a part of <strong>GALXECODE '26</strong>.</p>
  <p><strong>Keep Building. Keep Innovating. Keep Vibe Coding! 🚀</strong></p>
  <p>Warm regards,<br><strong>Team GALXECODE '26</strong><br>AI Vibe Coding Hackathon<br>Presented by <strong>UpLearning</strong><br>In Collaboration with <strong>PNNMDA College</strong></p>
`;

const toBase64 = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (let index = 0; index < bytes.length; index += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  }
  return btoa(binary);
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
  if (!templateResponse.ok) return json({ error: "Certificate template could not be loaded" }, 502);
  const template = await templateResponse.text();
  if (!template.includes("</svg>")) return json({ error: "Certificate template is invalid" }, 500);

  const recipients = [
    { name: team.leader_name, email: team.leader_email },
    ...(team.members ?? []),
  ].filter((member, index, all) => {
    const email = member.email.trim().toLowerCase();
    return email && all.findIndex((candidate) => candidate.email.trim().toLowerCase() === email) === index;
  });

  const results = await Promise.all(
    recipients.map(async (recipient) => {
      const certificate = certificateFor(template, recipient.name);
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
          html: emailHtml(recipient.name),
          attachments: [
            {
              filename: `GALXECODE-26-Participation-Certificate-${recipient.name.replace(/[^a-z0-9]+/gi, "-")}.svg`,
              content: toBase64(certificate),
            },
          ],
        }),
      });
      const responseBody = await response.text();
      return {
        ok: response.ok,
        email: recipient.email,
        error: response.ok ? undefined : responseBody.slice(0, 300),
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
  return json({ sent: results.length, team_id: team.id });
});
