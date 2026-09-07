"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  ArrowUpRight, 
  Bell, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Mail, 
  MessageCircle, 
  Rocket, 
  ShieldCheck, 
  Sparkles, 
  Users 
} from "lucide-react";
import { SiWhatsapp, SiInstagram, SiX } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

interface RegistrationClosedProps {
  isModal?: boolean;
  onClose?: () => void;
}

const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/JDxspXbRlezKQXm1n5so2S?s=cl&p=a&mlu=4";

export default function RegistrationClosed({
  isModal = false,
  onClose,
}: RegistrationClosedProps) {
  const [copied, setCopied] = useState(false);

  const copyWhatsAppLink = () => {
    navigator.clipboard.writeText(WHATSAPP_GROUP_URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className={`w-full text-white ${isModal ? "" : "max-w-4xl mx-auto py-8 px-4 sm:px-6"}`}>
      {/* Top Banner / Pill */}
      <div className="flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
          </span>
          <span className="text-xs font-mono font-semibold tracking-wider text-rose-300 uppercase">
            Capacity Reached · Registrations Closed
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
          Registrations for <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-purple-300 via-fuchsia-200 to-rose-300 bg-clip-text text-transparent">
            GalxeCode &apos;26
          </span>{" "}
          Are Closed
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-base sm:text-lg text-zinc-300 mb-8 leading-relaxed">
          Thank you for the mind-blowing response! We received hundreds of high-energy applications from builders across colleges and universities, and all participant slots have now been locked.
        </p>
      </div>

      {/* Hero Next Hackathon Callout Box */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/40 bg-gradient-to-b from-[#092317]/90 via-[#06140e]/80 to-[#04090b]/90 p-6 sm:p-8 backdrop-blur-xl shadow-[0_0_60px_rgba(16,185,129,0.18)] mb-8">
        {/* Glow ambient background circles */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-teal-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-mono font-medium text-emerald-300 mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
            <span>WHAT&apos;S NEXT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 tracking-tight">
            Our Next Hackathon Is Coming Soon! 🚀
          </h2>

          <p className="max-w-xl text-zinc-300 text-sm sm:text-base mb-6 leading-relaxed">
            Missed this edition? We&apos;re already cooking up the next mega hackathon with bigger cash rewards, novel AI challenges, and exciting problem statements. Join our official WhatsApp community to get instant updates before anyone else!
          </p>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-xl mb-7 text-left">
            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/25 p-3 sm:p-3.5">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 shrink-0">
                <Bell className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Priority Early Access</h4>
                <p className="text-xs text-zinc-400">Get early registration links before public release.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/25 p-3 sm:p-3.5">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 shrink-0">
                <Rocket className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Theme & Track Drops</h4>
                <p className="text-xs text-zinc-400">Exclusive teasers of tracks, bounties, and sponsors.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/25 p-3 sm:p-3.5">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 shrink-0">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Teammate Matchmaking</h4>
                <p className="text-xs text-zinc-400">Find co-hackers, designers, and developers fast.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-950/25 p-3 sm:p-3.5">
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-300 shrink-0">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white">Direct Organizer Access</h4>
                <p className="text-xs text-zinc-400">Ask questions, request mentorship, and get support.</p>
              </div>
            </div>
          </div>

          {/* Primary WhatsApp Action Button */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <a
              href={WHATSAPP_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#25D366] via-[#20bd5a] to-[#128C7E] px-8 py-4 font-semibold text-white shadow-[0_0_30px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_45px_rgba(37,211,102,0.7)] active:scale-[0.98]"
            >
              <SiWhatsapp className="h-6 w-6 transition-transform group-hover:rotate-12" />
              <span className="text-base sm:text-lg">Join WhatsApp Group</span>
              <ArrowUpRight className="h-5 w-5 opacity-80 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <button
              type="button"
              onClick={copyWhatsAppLink}
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-zinc-700/80 bg-zinc-900/60 px-5 py-3.5 text-xs font-mono text-zinc-300 backdrop-blur-md transition-all hover:border-zinc-500 hover:text-white"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Information Cards for Registered Teams & FAQ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="rounded-xl border border-purple-500/20 bg-purple-950/20 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-2.5">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <h3 className="font-semibold text-white text-base">Already Registered?</h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">
            If your team submitted registration, keep a close watch on your registered email and WhatsApp for verification codes, venue schedule, and entry instructions.
          </p>
          <div className="inline-flex items-center gap-1.5 font-mono text-xs text-purple-300">
            <span>Status: Teams currently undergoing verification</span>
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 backdrop-blur-md">
          <div className="flex items-center gap-2.5 mb-2.5">
            <Mail className="h-5 w-5 text-zinc-400" />
            <h3 className="font-semibold text-white text-base">Questions & Sponsorships</h3>
          </div>
          <p className="text-sm text-zinc-300 leading-relaxed mb-3">
            Have questions regarding your registration status, or interested in partnering or sponsoring our upcoming hackathons?
          </p>
          <a
            href="mailto:contact@galxecode.in"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-fuchsia-400 hover:underline"
          >
            <span>contact@galxecode.in</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-800/80">
        {isModal && onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/30 px-5 py-2.5 text-sm font-medium text-purple-200 transition-all hover:bg-purple-900/40 hover:text-white"
          >
            Close Dialog
          </button>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-950/30 px-5 py-2.5 text-sm font-medium text-purple-200 transition-all hover:bg-purple-900/40 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hackathon Home</span>
          </Link>
        )}

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">Connect with us:</span>
          <a
            href="https://www.instagram.com/galxecode/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-pink-500/40 hover:text-pink-400"
          >
            <SiInstagram size={14} />
          </a>
          <a
            href="https://www.linkedin.com/company/galxecode"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-blue-500/40 hover:text-blue-400"
          >
            <FaLinkedinIn size={14} />
          </a>
          <a
            href="https://x.com/galxecode"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/60 text-zinc-400 transition-colors hover:border-zinc-400 hover:text-white"
          >
            <SiX size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
