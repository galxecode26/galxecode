import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RegistrationClosed from "@/components/RegistrationClosed";
import HeroBackground from "@/components/HeroBackground";
import { ArrowLeft } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";

export const metadata: Metadata = {
  title: "Registrations Closed — GalxeCode '26",
  description:
    "Registrations for GalxeCode '26 are officially closed. Join our WhatsApp group to get details and early announcements about our next hackathon coming soon!",
  openGraph: {
    title: "Registrations Closed — GalxeCode '26",
    description:
      "All slots filled! Join our official WhatsApp community to get priority updates for our next hackathon.",
  },
};

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#040108] text-white flex flex-col justify-between overflow-x-hidden">
      <HeroBackground />

      {/* Top Header Navigation */}
      <header className="relative z-20 border-b border-purple-500/15 bg-black/40 backdrop-blur-md px-4 sm:px-8 py-3.5">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/header-logo.png"
              alt="GalxeCode Logo"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
            />
            <span className="font-bold text-lg tracking-wider text-white group-hover:text-purple-300 transition-colors">
              GalxeCode
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <a
              href="https://chat.whatsapp.com/JDxspXbRlezKQXm1n5so2S?s=cl&p=a&mlu=4"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1.5 text-xs font-medium text-emerald-300 hover:border-emerald-400/60 hover:text-emerald-200 transition-all"
            >
              <SiWhatsapp className="h-3.5 w-3.5" />
              <span>WhatsApp Community</span>
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 bg-purple-950/20 px-3.5 py-1.5 text-xs font-medium text-purple-200 hover:bg-purple-900/30 hover:text-white transition-all"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center px-4 py-10 sm:py-16">
        <RegistrationClosed />
      </div>

      {/* Subtle Footer */}
      <footer className="relative z-10 border-t border-purple-500/10 py-5 text-center text-xs text-zinc-500">
        <p>© 2026 GalxeCode · Dr. P. A. Inamdar University · Pune, Maharashtra</p>
      </footer>
    </main>
  );
}
