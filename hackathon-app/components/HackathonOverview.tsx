"use client";

import { motion } from "motion/react";
import { Lightbulb, FlaskConical, Rocket, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import DecryptedText from "./ui/DecryptedText";

const PHASES = [
  {
    icon: Lightbulb,
    title: "Ideate",
    description: "Brainstorm bold ideas, form teams, and pick the track that excites you most.",
  },
  {
    icon: FlaskConical,
    title: "Prototype",
    description: "Build working prototypes with cutting-edge AI tools, APIs, and frameworks.",
  },
  {
    icon: Rocket,
    title: "Ship",
    description: "Deploy your creation, present to judges, and launch into the real world.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export default function HackathonOverview() {
  return (
    <section id="overview" className="relative w-full overflow-hidden bg-black py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 opacity-20 blur-[120px]"
          style={{ background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.3 }}
          className="eligibility-title mt-6 text-center"
        >
          <DecryptedText
            text="The Vision Behind GalxeCode '26"
            animateOn="view"
            revealDirection="center"
            speed={60}
            maxIterations={12}
            characters="!<>-_\\/[]{}—=+*^?#01"
            className="decrypt-revealed"
            encryptedClassName="decrypt-encrypted"
          />
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-[#C4B5D9] sm:text-lg md:text-xl"
        >
          GalxeCode &apos;26 is a high-intensity hackathon where builders, designers, and dreamers
          come together to create AI-powered solutions for real-world problems. From ideation to
          deployment — ship something that matters.
        </motion.p>

        <div className="mx-auto mt-16 grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          {PHASES.map((phase, i) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                className={cn(
                  "group rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-left backdrop-blur-md",
                  "transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50 hover:bg-white/[0.06] hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)]"
                )}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10">
                  <Icon
                    size={22}
                    className="text-[#A855F7] transition-all duration-300 group-hover:scale-110 group-hover:text-[#c084fc]"
                  />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{phase.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{phase.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            className={cn(
              "group/btn inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white",
              "bg-gradient-to-r from-[#9333EA] to-[#7C3AED] shadow-lg shadow-purple-500/25",
              "transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-purple-500/40"
            )}
          >
            Explore Timeline
            <ArrowRight size={16} className="transition-transform duration-300 group-hover/btn:translate-x-0.5" />
          </button>
          <button
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3",
              "text-sm font-semibold text-[#C4B5D9] backdrop-blur-sm",
              "transition-all duration-300 hover:scale-105 hover:border-[#A855F7]/40 hover:text-white"
            )}
          >
            View Rules
          </button>
        </motion.div>
      </div>
    </section>
  );
}
