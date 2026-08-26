"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";

const REASONS = [
  {
    title: "AI Powered",
    desc: "Build next-generation products using AI tools, APIs and modern development workflows.",
  },
  {
    title: "Vibe Coding",
    desc: "Experience fast product building using AI-assisted coding and no-code platforms.",
  },
  {
    title: "Build Together",
    desc: "Collaborate with talented developers, designers and innovators.",
  },
  {
    title: "Exciting Rewards",
    desc: "Win prizes, certificates and recognition from industry mentors.",
  },
  {
    title: "Startup Exposure",
    desc: "Present your ideas to founders, investors and startup leaders.",
  },
  {
    title: "Industry Mentorship",
    desc: "Receive guidance from experienced engineers and entrepreneurs.",
  },
];

function MaskedWords({
  words,
  offset,
  play,
  instant,
  accent,
  bracket,
}: {
  words: string[];
  offset: number;
  play: boolean;
  instant?: boolean;
  accent?: boolean;
  bracket?: boolean;
}) {
  return (
    <>
      {words.map((word, i) => (
        <span key={word + i} className="wt-mask">
          <span
            className={`wt-word ${accent ? "why-title-accent" : ""} ${
              bracket ? "wt-word--bracket" : ""
            } ${play ? "wt-word--in" : ""} ${instant ? "wt-word--instant" : ""}`}
            style={{ "--d": `${offset + i * 110}ms` } as React.CSSProperties}
          >
            {word}
          </span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export default function WhyParticipate() {
  const sectionRef = useRef<HTMLElement>(null);
  const [play, setPlay] = useState(false);
  const [instant, setInstant] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const rows = sectionRef.current?.querySelectorAll(".why-row");
    if (!rows || !rows.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = sectionRef.current?.querySelector(".why-header");
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          setPlay(true);
          playedRef.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Replay masked-word reveal every 5 seconds
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      setInstant(true);
      setPlay(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          setInstant(false);
          setPlay(true);
        })
      );
    }, 5000);
    return () => clearInterval(id);
  }, [play]);

  return (
    <section id="why-us" className="why-section" ref={sectionRef}>
      <div className="why-header">
        <p className="why-label">// WHY PARTICIPATE</p>
        <h2 className="why-title">
          <span className="wt-line">
            <MaskedWords
              words={["("]}
              offset={0}
              play={play}
              instant={instant}
              bracket
            />
            {"\u00A0"}
            <MaskedWords
              words={["Experience", "More", "Than"]}
              offset={140}
              play={play}
              instant={instant}
            />
          </span>
          <br />
          <span className="wt-line">
            <MaskedWords
              words={["A", "Hackathon"]}
              offset={480}
              play={play}
              instant={instant}
              accent
            />
            {"\u00A0"}
            <MaskedWords
              words={[")"]}
              offset={720}
              play={play}
              instant={instant}
              bracket
            />
          </span>
        </h2>
        <p className="why-desc">
          GalxeCode&apos;26 is designed to help students learn, build,
          collaborate and launch innovative AI products in one immersive
          experience.
        </p>
      </div>

      <div className="why-list">
        {REASONS.map((reason, i) => (
          <div
            key={reason.title}
            className="why-row"
            style={{ "--i": i } as React.CSSProperties}
          >
            <span className="why-num">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="why-row-title">{reason.title}</h3>
            <p className="why-row-desc">{reason.desc}</p>
            <ArrowUpRight className="why-arrow" size={26} strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </section>
  );
}
