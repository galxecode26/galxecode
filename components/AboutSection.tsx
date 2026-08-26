"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { BrainCircuit, Rocket, Network } from "lucide-react";
import LineSidebar from "./ui/LineSidebar";
import DecryptedText from "./ui/DecryptedText";

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "AI-First",
    desc: "Every project is built with AI tools and no-code platforms at the center of the workflow.",
  },
  {
    icon: Rocket,
    title: "Startup Thinking",
    desc: "Participants approach problems as founders validating, prototyping, and pitching real products.",
  },
  {
    icon: Network,
    title: "Industry Connection",
    desc: "Learn directly from engineers, founders and mentors working at the edge of AI and product development.",
  },
];

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [nonce, setNonce] = useState(0);

  // Re-run decrypt animation every 5 seconds
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setNonce((n) => n + 1), 5000);
    return () => clearInterval(id);
  }, [inView]);

  return (
    <section ref={ref} id="about" className="about-section relative w-full z-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(107,33,168,0.12)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="section-tag">// OVERVIEW</p>
          <h2 className="eligibility-title">
            <DecryptedText
              key={`d1-${nonce}`}
              text="[ The Vision Behind"
              animateOn="view"
              revealDirection="start"
              speed={60}
              maxIterations={12}
              characters="!<>-_\\/[]{}—=+*^?#01"
              className="decrypt-revealed"
              encryptedClassName="decrypt-encrypted"
            />{" "}
            <DecryptedText
              key={`d2-${nonce}`}
              text="GalxeCode '26 ]"
              animateOn="view"
              revealDirection="start"
              speed={60}
              maxIterations={12}
              characters="!<>-_\\/[]{}—=+*^?#01"
              className="decrypt-revealed--accent"
              encryptedClassName="decrypt-encrypted"
            />
          </h2>
        </motion.div>

        <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <p className="text-zinc-300 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}>
              GalxeCode is an AI-powered Vibe Coding Hackathon where students build
              innovative products using AI tools, no-code platforms, and modern development technologies.
            </p>
            <p className="text-zinc-300 leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)" }}>
              Unlike traditional hackathons, participants focus on solving real-world
              problems by leveraging AI-assisted development, rapid prototyping, and startup thinking.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:pl-20"
          >
            <p className="section-tag" style={{ fontSize: "clamp(13px, 1.5vw, 16px)" }}>
              // OUR MISSION
            </p>
            <LineSidebar
              className="about-mission"
              items={[
                "Promote AI Innovation",
                "Foster Startup Culture",
                "Build Industry-Ready Skills",
                "Encourage Product Thinking",
                "Connect Students with Industry",
              ]}
              accentColor="#A855F7"
              textColor="#c4c4c4"
              markerColor="#6c6c6c"
              showIndex
              showMarker
              proximityRadius={100}
              maxShift={30}
              falloff="smooth"
              markerLength={60}
              markerGap={0}
              tickScale={0.5}
              scaleTick
              itemGap={24}
              fontSize={1.35}
              smoothing={100}
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 sm:mt-24"
        >
          <div className="mb-10 h-px w-full bg-gradient-to-r from-purple-500/40 via-purple-500/15 to-purple-500/40" />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} className="group relative pt-2">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-purple-500/25 bg-purple-500/[0.05] transition-all duration-300 group-hover:scale-110 group-hover:border-purple-400/60 group-hover:bg-purple-500/10 group-hover:shadow-[0_0_28px_rgba(168,85,247,0.45)]">
                    <Icon
                      size={26}
                      strokeWidth={1.5}
                      className="text-[#a855f7]/80 transition-colors duration-300 group-hover:text-[#d8b4fe]"
                    />
                  </div>
                  <h4 className="mb-2 text-center font-bold text-lg text-white transition-colors duration-300 group-hover:text-[#d8b4fe]">
                    {feat.title}
                  </h4>
                  <p className="text-center text-sm leading-relaxed text-zinc-400">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
