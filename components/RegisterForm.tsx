"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, ImageUp, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Member {
  name: string;
  email: string;
  phone: string;
  college: string;
}

const emptyMember = (): Member => ({
  name: "",
  email: "",
  phone: "",
  college: "",
});

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
const phoneOk = (v: string) => /^\d{10}$/.test(v.replace(/\D/g, ""));
const digitsOnly = (v: string, max = 10) => v.replace(/\D/g, "").slice(0, max);

const PAYMENT_UPI = "sharale1103@oksbi";
const PRICE_PER_MEMBER = 100;

const getUpiLink = (amount: number) =>
  `upi://pay?pa=${encodeURIComponent(PAYMENT_UPI)}&pn=${encodeURIComponent(
    "GalxeCode '26"
  )}&am=${amount}&cu=INR`;

const getQrSrc = (amount: number) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(
    getUpiLink(amount)
  )}`;

export default function RegisterForm({ onClose }: { onClose?: () => void }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [teamName, setTeamName] = useState("");
  const [teamSize, setTeamSize] = useState(2);
  const [members, setMembers] = useState<Member[]>([
    emptyMember(),
    emptyMember(),
  ]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [step, setStep] = useState(1);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [txnId, setTxnId] = useState("");

  useEffect(() => {
    setMembers((prev) => {
      if (prev.length === teamSize) return prev;
      const next = [...prev];
      while (next.length < teamSize) next.push(emptyMember());
      return next.slice(0, teamSize);
    });
  }, [teamSize]);
useEffect(() => {
  setMembers((prev) => {
    if (prev.length === 0) return prev;
    const updated = [...prev];
    updated[0] = {
      ...updated[0],
      name: fullName,
      email: email,
      phone: phone,
    };
    return updated;
  });
}, [fullName, email, phone]);
  const memberFields = [
    { key: "name" as const, label: "Member Name", ph: "Full name" },
    { key: "email" as const, label: "Member Email", ph: "name@email.com", type: "email" },
    { key: "phone" as const, label: "Member Phone", ph: "10-digit number", type: "tel" },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!fullName.trim()) e.fullName = "Full name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!emailOk(email)) e.email = "Enter a valid email";
    if (!phone.trim()) e.phone = "Phone number is required";
    else if (!phoneOk(phone)) e.phone = "Enter exactly 10 digits";
    if (!teamName.trim()) e.teamName = "Team name is required";
    members.forEach((m, i) => {
      const id = `m${i}`;
      if (!m.name.trim()) e[`${id}-name`] = "Required";
      if (!m.email.trim()) e[`${id}-email`] = "Required";
      else if (!emailOk(m.email)) e[`${id}-email`] = "Invalid email";
      if (!m.phone.trim()) e[`${id}-phone`] = "Required";
      else if (!phoneOk(m.phone)) e[`${id}-phone`] = "10 digits";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onNext = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (validate()) {
      setErrors({});
      setStep(2);
    }
  };

  const validatePayment = () => {
    const e: Record<string, string> = {};
    if (!screenshot) e.screenshot = "Upload the payment screenshot";
    if (!txnId.trim()) e.txnId = "UTR / Transaction ID is required";
    else if (txnId.replace(/\s/g, "").length < 8)
      e.txnId = "Enter a valid UTR / Transaction ID";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onFinalSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validatePayment()) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const ext = screenshot!.name.split(".").pop() || "png";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("payment-proofs")
        .upload(path, screenshot!, { contentType: screenshot!.type || "image/png" });
      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(path);

      const totalAmount = teamSize * PRICE_PER_MEMBER;

      const { data: teamId, error: regErr } = await supabase.rpc("register_team", {
        p_team: {
          team_name: teamName.trim(),
          leader_name: fullName.trim(),
          leader_email: email.trim().toLowerCase(),
          leader_phone: phone.trim(),
          college: college.trim(),
          team_size: teamSize,
          amount: totalAmount,
          utr: txnId.replace(/\s/g, "").toUpperCase(),
          screenshot_url: urlData?.publicUrl ?? "",
        },
        p_members: members.map((m, i) => ({
          name: m.name.trim(),
          email: m.email.trim().toLowerCase(),
          phone: m.phone.trim(),
          college: "",
        })),
      });
      if (regErr) throw regErr;
      if (!teamId) throw new Error("Registration failed, please try again");

      supabase.functions
        .invoke("notify-registration", {
          body: {
            team: {
              team_name: teamName.trim(),
              leader_name: fullName.trim(),
              leader_email: email.trim().toLowerCase(),
              leader_phone: phone.trim(),
              college: college.trim(),
              team_size: teamSize,
              amount: totalAmount,
              utr: txnId.replace(/\s/g, "").toUpperCase(),
              screenshot_url: urlData?.publicUrl ?? "",
            },
            members: members.map((m) => ({
              name: m.name.trim(),
              email: m.email.trim().toLowerCase(),
              phone: m.phone.trim(),
            })),
          },
        })
        .catch(() => { });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : err && typeof err === "object" && "message" in err
            ? String((err as { message: unknown }).message)
            : String(err);
      setSubmitError(`Submission failed: ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0] ?? null;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setScreenshot(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : "");
  };

  const inputCls = (err?: string) =>
    `w-full rounded-lg border bg-zinc-900/60 px-4 py-3 text-base text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-purple-400 ${err ? "border-rose-500/70" : "border-zinc-700/80"
    }`;

  const Err = ({ msg }: { msg?: string }) =>
    msg ? <p className="mt-1 text-xs text-rose-400">{msg}</p> : null;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="mb-1.5 block text-sm font-medium text-zinc-300">
      {children}
    </label>
  );

  if (submitted) {
    return (
      <div className="w-full px-1 py-6 text-center">
        <CheckCircle2 size={56} className="mx-auto mb-5 text-emerald-400" />
        <h1 className="mb-3 text-2xl font-bold">Registration Complete</h1>
        <p className="mx-auto mb-8 max-w-sm leading-relaxed text-zinc-400">
          Team <span className="font-semibold text-white">{teamName}</span> (
          {teamSize} {teamSize === 1 ? "member" : "members"} — ₹{teamSize * PRICE_PER_MEMBER}) is registered. Our team will verify your payment
          and a confirmation email will be sent to {email}.
        </p>
        <div className="mx-auto mb-6 max-w-sm">
          <a
            href="https://chat.whatsapp.com/JDxspXbRlezKQXm1n5so2S?s=cl&p=a&mlu=4"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#25d366]/15 border border-[#25d366]/30 px-5 py-3 text-sm font-semibold text-[#25d366] transition-colors hover:bg-[#25d366]/25"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Join WhatsApp Group
          </a>
        </div>
        {onClose ? (
          <button
            onClick={onClose}
            className="rounded-lg border border-zinc-700 px-6 py-3 text-sm text-zinc-300 transition-colors hover:border-purple-400 hover:text-white"
          >
            Close
          </button>
        ) : (
          <a
            href="/"
            className="inline-block rounded-lg border border-zinc-700 px-6 py-3 text-sm text-zinc-300 transition-colors hover:border-purple-400 hover:text-white"
          >
            ← Back to home
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* modal provides chrome — only show back row on standalone page */}
      {!onClose && (
        <div className="mb-6 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft size={14} /> Back
          </a>
        </div>
      )}

      <div className="mb-6 text-center sm:mb-10">
        <div className="mb-5 flex justify-center">
          <img
            src="/header-logo.png"
            alt="GalxeCode Logo"
            className="h-16 w-auto rounded-md"
          />
        </div>
        <h1 className="text-2xl font-bold sm:text-3xl">Register</h1>
        <p className="mt-2 text-sm text-zinc-400 sm:text-base">
          <span className="font-medium text-purple-300">GalxeCode &apos;26</span>
          <span className="mx-2 text-zinc-600">·</span>
          Vibe Coding Hackathon
          <span className="mx-2 text-zinc-600">·</span>
          Pune
        </p>
      </div>

      <div className="mb-5 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest sm:mb-8">
        <span className={step === 1 ? "text-purple-300" : "text-emerald-400"}>
          [1] Details
        </span>
        <span className="text-zinc-600">→</span>
        <span className={step === 2 ? "text-purple-300" : "text-zinc-600"}>
          [2] Payment
        </span>
      </div>

      {step === 1 && (
        <form onSubmit={onNext} noValidate className="space-y-10 pb-4">
          {/* Personal details */}
          <fieldset>
            <legend className="mb-5 text-sm font-semibold uppercase tracking-wider text-purple-300">
              Personal Details
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Full Name *</Label>
                <input
                  className={inputCls(errors.fullName)}
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <Err msg={errors.fullName} />
              </div>
              <div>
                <Label>Team Leader's Email Address *</Label>
                <input
                  type="email"
                  className={inputCls(errors.email)}
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Err msg={errors.email} />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <input
                  type="tel"
                  inputMode="numeric"
                  className={inputCls(errors.phone)}
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(digitsOnly(e.target.value))}
                />
                <Err msg={errors.phone} />
              </div>
              <div>
                <Label>Referral Person Name (if any)</Label>
                <input
                  className={inputCls()}
                  placeholder="Referral person name"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                />
              </div>
            </div>
          </fieldset>

          {/* Team details */}
          <fieldset>
            <legend className="mb-5 text-sm font-semibold uppercase tracking-wider text-purple-300">
              Team Details
            </legend>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <Label>Team Name *</Label>
                <input
                  className={inputCls(errors.teamName)}
                  placeholder="e.g. Pixel Pirates"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
                <Err msg={errors.teamName} />
              </div>
              <div>
                <Label>Number of Members * (₹{PRICE_PER_MEMBER}/person)</Label>
                <select
                  className={`${inputCls()} cursor-pointer`}
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                >
                  {[ 2, 3, 4,5].map((n) => (
                    <option key={n} value={n} className="bg-zinc-900">
                      {n} {n === 1 ? "member" : "members"} — ₹{n * PRICE_PER_MEMBER}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {members.map((m, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-zinc-800 p-4"
                >
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Member {i + 1}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {memberFields.map((f) => {
                      const errKey = `m${i}-${f.key}`;
                      return (
                        <div key={f.key}>
                          <Label>{f.label}</Label>
                          <input
                            type={f.type ?? "text"}
                            placeholder={f.ph}
                            className={inputCls(errors[errKey])}
                            value={
                              f.key === "phone" ? digitsOnly(m[f.key]) : m[f.key]
                            }
                            onChange={(e) => {
                              const raw = e.target.value;
                              setMembers((prev) =>
                                prev.map((mm, j) =>
                                  j === i
                                    ? {
                                      ...mm,
                                      [f.key]:
                                        f.key === "phone"
                                          ? digitsOnly(raw)
                                          : raw,
                                    }
                                    : mm
                                )
                              );
                            }}
                          />
                          <Err msg={errors[errKey]} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-lg bg-purple-600 py-3.5 font-semibold text-white transition-colors hover:bg-purple-500"
          >
            Next →
          </button>
        </form>
      )}

      {step === 2 && (() => {
        const dynamicAmount = teamSize * PRICE_PER_MEMBER;
        const dynamicQrSrc = getQrSrc(dynamicAmount);
        return (
          <form onSubmit={onFinalSubmit} noValidate className="space-y-10 pb-4">
            <fieldset>
              <legend className="mb-5 text-sm font-semibold uppercase tracking-wider text-purple-300">
                Payment Verification
              </legend>

              <div className="flex flex-col items-center gap-4">
                <div className="inline-flex flex-col items-center gap-1 rounded-2xl border border-purple-400/30 bg-purple-500/10 px-6 py-2.5 text-center">
                  <span className="text-xs font-medium uppercase tracking-wider text-purple-300">
                    Registration Fee (₹{PRICE_PER_MEMBER} / person)
                  </span>
                  <span className="font-mono text-xl font-bold text-purple-200">
                    ₹{dynamicAmount} <span className="text-xs font-normal text-zinc-400">({teamSize} {teamSize === 1 ? "member" : "members"})</span>
                  </span>
                </div>
                <div className="rounded-2xl bg-white p-3 shadow-[0_10px_40px_rgba(168,85,247,0.35)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dynamicQrSrc}
                    alt={`UPI payment QR for ${PAYMENT_UPI} amount ₹${dynamicAmount}`}
                    className="h-52 w-52"
                  />
                </div>
                <p className="text-sm text-zinc-400">
                  Scan with any UPI app —{" "}
                  <span className="font-semibold text-white">₹{dynamicAmount}</span> will be
                  auto-filled
                </p>
                <p className="font-mono text-xs tracking-wider text-purple-300">
                  UPI: {PAYMENT_UPI}
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <Label>Payment Screenshot *</Label>
                  <label
                    htmlFor="payment-screenshot"
                    className={`mt-1.5 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-4 transition-colors hover:border-purple-400 ${errors.screenshot ? "border-rose-500/70" : "border-zinc-700/80"
                      }`}
                  >
                    {previewUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={previewUrl}
                        alt="Payment proof preview"
                        className="h-14 w-14 shrink-0 rounded-md object-cover"
                      />
                    ) : (
                      <ImageUp size={22} className="shrink-0 text-zinc-500" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                      {screenshot ? screenshot.name : "Upload payment screenshot"}
                    </span>
                    <span className="shrink-0 text-xs font-medium text-purple-300">
                      {screenshot ? "Change" : "Browse"}
                    </span>
                  </label>
                  <input
                    id="payment-screenshot"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                  <Err msg={errors.screenshot} />
                </div>

                <div>
                  <Label>UTR / Transaction ID *</Label>
                  <input
                    className={inputCls(errors.txnId)}
                    placeholder="e.g. 402512345678 (from your UPI app)"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value.toUpperCase())}
                  />
                  <Err msg={errors.txnId} />
                </div>
              </div>
            </fieldset>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-6 py-3.5 font-semibold text-zinc-300 transition-colors hover:border-purple-400 hover:text-white disabled:opacity-50"
              >
                <ArrowLeft size={16} /> Back
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 rounded-lg bg-purple-600 py-3.5 font-semibold text-white transition-colors hover:bg-purple-500 disabled:opacity-60"
              >
                {submitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 size={18} className="animate-spin" /> Submitting…
                  </span>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>

            {submitError && (
              <div className="flex items-start gap-3 rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                <XCircle size={18} className="mt-0.5 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}
          </form>
        );
      })()}
    
</div>
  );
}
