"use client";

import { useEffect, useRef } from "react";
import TimelineRevealText from "./TimelineRevealText";

const MILESTONES = [
  {
    date: "Aug 25",
    title: "Registration Opens",
    desc: "Applications open for teams across universities.",
  },
  {
    date: "Sep 05",
    title: "Registration Closes",
    desc: "Last day to submit your team registration.",
  },
  {
    date: "Sep 07",
    title: "Hackathon Day",
    desc: "Build your AI-powered solution with mentors.",
  },
  {
    date: "Sep 07",
    title: "Final Presentation",
    desc: "Present your project before judges.",
  },
  {
    date: "Sep 07",
    title: "Winner Announcement",
    desc: "Top teams receive prizes and recognition.",
  },
];

const NODE_Y = 30;

export default function TimelineSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>(".tl-item"));

    let raf = 0;
    const update = () => {
      const rect = list.getBoundingClientRect();
      const viewportMid = window.innerHeight * 0.55;
      let passed = Math.min(Math.max(viewportMid - rect.top, 0), rect.height);

      // Cap liquid at the last node
      if (items.length) {
        const last = items[items.length - 1];
        passed = Math.min(passed, last.offsetTop + NODE_Y);
      }

      if (fillRef.current) {
        fillRef.current.style.height = `${Math.max(passed - 28, 0)}px`;
      }
      if (tipRef.current) {
        tipRef.current.style.top = `${Math.max(passed, 28)}px`;
      }

      items.forEach((it) => {
        it.classList.toggle("is-filled", passed >= it.offsetTop + NODE_Y);
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="timeline" className="timeline-section">
      <div className="timeline-header">
        <p className="timeline-label">// TIMELINE</p>
        <h2 className="timeline-title">
          <TimelineRevealText />
        </h2>
        <p className="timeline-desc">
          Every milestone is carefully planned to create an immersive innovation
          experience.
        </p>
      </div>

      <div className="timeline-list" ref={listRef}>
        <div className="tl-liquid" aria-hidden="true">
          <div className="tl-liquid-track" />
          <div className="tl-liquid-fill" ref={fillRef} />
          <span className="tl-liquid-tip" ref={tipRef} />
        </div>

        {MILESTONES.map((m, i) => {
          const isLeft = i % 2 === 0;
          const content = (
            <>
              <div className="tl-date">[ {m.date} ]</div>
              <h3 className="tl-title">{m.title}</h3>
              <p className="tl-text">{m.desc}</p>
            </>
          );
          return (
            <div key={m.title} className={`tl-item ${isLeft ? "tl-left" : "tl-right"}`}>
              <div className="tl-content">{isLeft ? content : null}</div>
              <div className="tl-rail">
                <span className="tl-node">
                  <span className="tl-node-core" />
                </span>
              </div>
              <div className="tl-content">{isLeft ? null : content}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
