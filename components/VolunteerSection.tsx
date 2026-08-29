"use client";

import {
  HeartHandshake,
  Award,
  Sparkles,
  Users2,
  Calendar,
  MapPin,
  ExternalLink,
  ClipboardList,
  Cpu,
  Boxes,
  HelpCircle,
  Camera,
  CheckCircle2,
  Info,
  ArrowUpRight,
} from "lucide-react";

const VOLUNTEER_ROLES = [
  {
    icon: ClipboardList,
    title: "Registration & Check-In",
    desc: "Welcome participants, manage check-in workflows, distribute badges and welcome kits.",
    color: "from-purple-500/20 to-indigo-500/20 border-purple-500/30 text-purple-300",
  },
  {
    icon: Boxes,
    title: "Logistics & Venue Operations",
    desc: "Coordinate floor layouts, seating arrangements, power setups, and smooth physical operations.",
    color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300",
  },
  {
    icon: HelpCircle,
    title: "Participant Helpdesk & Support",
    desc: "Guide hacking squads, resolve queries, manage time notifications, and ensure builder comfort.",
    color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-300",
  },
  {
    icon: Cpu,
    title: "Technical Assistance",
    desc: "Assist with Wi-Fi stability, presentation setups, hardware/AV troubleshooting, and demo rooms.",
    color: "from-fuchsia-500/20 to-pink-500/20 border-fuchsia-500/30 text-fuchsia-300",
  },
  {
    icon: Camera,
    title: "Media, Stage & Coverage",
    desc: "Help capture moments, manage stage presentation queues, and coordinate jury demo sessions.",
    color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300",
  },
  {
    icon: Users2,
    title: "Jury & Mentor Coordination",
    desc: "Escort evaluators, manage scoring sheets handover, and coordinate pitch schedules.",
    color: "from-rose-500/20 to-red-500/20 border-rose-500/30 text-rose-300",
  },
];

const PERKS = [
  {
    icon: Award,
    title: "High-Value Certification",
    desc: "Official Certificate of Appreciation recognizing your vital contribution to GalxeCode '26.",
  },
  {
    icon: Sparkles,
    title: "Hands-On Leadership",
    desc: "Real-world experience organizing and managing a large-scale, high-intensity tech hackathon.",
  },
  {
    icon: Users2,
    title: "Elite Networking",
    desc: "Direct access to network with 500+ builders, industry mentors, startup founders, and sponsors.",
  },
  {
    icon: HeartHandshake,
    title: "Goodies & Experience",
    desc: "Official crew meals, hackathon swag, reference letters, and priority invites to future initiatives.",
  },
];

const FORM_LINK = "https://forms.gle/YvQTyKumpuVjtmPRA";

export default function VolunteerSection() {
  return (
    <section
      id="volunteer"
      className="volunteer-section relative w-full py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10"
    >
      {/* Background Decorative Radial Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(168,85,247,0.12)_0%,transparent_70%)]" />
      </div>

      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
          <HeartHandshake size={14} className="text-purple-400" />
          <span>// CREW & VOLUNTEERS CALL</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Volunteers Needed for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-amber-300">
            GalxeCode &apos;26
          </span>
        </h2>

        <p className="max-w-3xl mx-auto text-base sm:text-lg text-zinc-300 leading-relaxed">
          We&apos;re looking for <strong className="text-white">40 enthusiastic student volunteers</strong> to
          help us orchestrate an unforgettable AI-powered Vibe Coding Hackathon.
        </p>

        {/* Quick event meta badge strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-mono text-zinc-300">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
            <Calendar size={15} className="text-purple-400" />
            <span>7th September, 2026</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
            <MapPin size={15} className="text-cyan-400" />
            <span>Dr. P. A. Inamdar University, Pune</span>
          </div>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-800">
            <Users2 size={15} className="text-emerald-400" />
            <span>40 Limited Volunteer Slots</span>
          </div>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 rounded-2xl border border-purple-500/25 bg-zinc-950/80 p-6 sm:p-8 lg:p-12 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] mb-12">
        {/* Volunteer Sectors Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-3 border-b border-zinc-800/80">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <ClipboardList size={22} className="text-purple-400" />
              Volunteer Sectors &amp; Responsibilities
            </h3>
            <span className="text-xs font-mono text-zinc-400 hidden sm:inline-block">
              Choose your preferred domain in the form
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VOLUNTEER_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <div
                  key={role.title}
                  className="group relative flex flex-col justify-between p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-purple-500/40 hover:bg-zinc-900/70 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} border p-2 flex items-center justify-center group-hover:scale-105 transition-transform`}
                      >
                        <Icon size={20} />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 group-hover:text-purple-300 transition-colors">
                        Sector
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-purple-200 transition-colors">
                      {role.title}
                    </h4>

                    <p className="text-xs text-zinc-400 leading-relaxed">{role.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    Open for Registration
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* What You Get / Benefits */}
        <div className="mb-12">
          <div className="mb-6 pb-3 border-b border-zinc-800/80">
            <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <Sparkles size={22} className="text-amber-400" />
              What You Get
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PERKS.map((perk) => {
              const Icon = perk.icon;
              return (
                <div
                  key={perk.title}
                  className="p-5 rounded-xl border border-zinc-800 bg-black/40 hover:border-purple-500/30 transition-all"
                >
                  <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-300 mb-3">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{perk.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Box */}
        <div className="p-4 sm:p-5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3 mb-10">
          <Info size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
            <strong className="text-amber-200">Please note:</strong> This is an unpaid volunteering opportunity
            focused on leadership development, hands-on event management experience, and high-level networking
            with student developers, tech leaders, and corporate sponsors.
          </p>
        </div>

        {/* Call to Action Bar */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-purple-950/60 via-zinc-900/90 to-indigo-950/60 border border-purple-400/40 text-center flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_0_30px_rgba(147,51,234,0.25)]">
          <div className="text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-1">
              Ready to help us build GalxeCode &apos;26?
            </h4>
            <p className="text-xs sm:text-sm text-zinc-300">
              Fill out the Google Form to lock in your spot!
            </p>
          </div>

          <a
            href={FORM_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-500 hover:via-fuchsia-500 hover:to-indigo-500 border border-purple-300/40 shadow-[0_0_25px_rgba(168,85,247,0.45)] transition-all hover:scale-105 whitespace-nowrap"
          >
            <span>Enroll Now as Volunteer</span>
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
