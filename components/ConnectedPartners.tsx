"use client";

import { useEffect, useState } from "react";
import { ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { ConnectedPartner, INITIAL_PARTNERS } from "./partnerData";

const BADGE_STYLES: Record<string, string> = {
  purple: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  emerald: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cyan: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  amber: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  rose: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  blue: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  indigo: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
};

export default function ConnectedPartners() {
  const [partners, setPartners] = useState<ConnectedPartner[]>(INITIAL_PARTNERS);

  // Load custom partners from localStorage and listen for changes
  useEffect(() => {
    const loadPartners = () => {
      try {
        const saved = localStorage.getItem("galxecode_custom_partners");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setPartners([...INITIAL_PARTNERS, ...parsed]);
            return;
          }
        }
      } catch {
        // ignore
      }
      setPartners(INITIAL_PARTNERS);
    };

    loadPartners();

    // Listen to storage events when admin updates partners in console
    window.addEventListener("storage", loadPartners);
    return () => window.removeEventListener("storage", loadPartners);
  }, []);

  return (
    <section id="partners" className="relative w-full py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-14">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-widest uppercase bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-4">
          <Sparkles size={14} className="text-purple-400" /> Connected Partners
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Our Valued <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-emerald-400">Partners</span> & Collaborators
        </h2>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-zinc-400">
          Building the future of AI innovation alongside industry pioneers, technology leaders, and educational visionaries.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {partners.map((partner) => {
          const badgeStyle = BADGE_STYLES[partner.badgeColor || "purple"] || BADGE_STYLES.purple;
          return (
            <div
              key={partner.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-zinc-950/60 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
            >
              <div>
                {/* Logo container */}
                <div className="flex items-center justify-between mb-5">
                  <div className="h-16 w-16 rounded-xl border border-zinc-800 bg-black/50 p-2.5 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={partner.logoSrc}
                      alt={partner.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-md"
                    />
                  </div>
                  {partner.websiteUrl && (
                    <a
                      href={partner.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-purple-300 transition-colors p-1"
                      aria-label={`Visit ${partner.name}`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                </div>

                {/* Role badge */}
                <span
                  className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-3 ${badgeStyle}`}
                >
                  {partner.role}
                </span>

                {/* Partner name */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {partner.name}
                </h3>

                {/* Description */}
                {partner.description && (
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
                    {partner.description}
                  </p>
                )}
              </div>

              {/* Card Footer indicator */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
                <ShieldCheck size={13} className="text-purple-400" />
                Verified Partner
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
