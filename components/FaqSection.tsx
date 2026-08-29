"use client";

import { useEffect, useRef, useState } from "react";
import OptionWheel from "./ui/OptionWheel";
import FaqRevealText from "./FaqRevealText";
import FaqAccordion from "./FaqAccordion";
import { FAQS } from "./faqData";

export default function FaqSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const faq = FAQS[index];

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        if (total <= 0) return;
        const passed = Math.min(Math.max(-rect.top, 0), total);
        const p = passed / total;
        setIndex(Math.min(FAQS.length - 1, Math.floor(p * FAQS.length)));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section id="faqs" className="faq-section" ref={sectionRef}>
      <div className="faq-sticky">
        <div className="timeline-header">
          <p className="timeline-label">// FAQS</p>
          <h2 className="timeline-title">
            <FaqRevealText />
          </h2>
          <p className="timeline-desc">
            Keep scrolling — the wheel walks you through everything about
            GalxeCode &apos;26.
          </p>
        </div>

        <div className="faq-layout">
          <div className="faq-wheel-col">
            <OptionWheel
              items={FAQS.map((f) => f.label)}
              defaultSelected={0}
              side="left"
              textColor="#8a8296"
              activeColor="#e9d5ff"
              fontSize={1.6}
              spacing={1.5}
              curve={1}
              tilt={7}
              blur={1.4}
              fade={0.22}
              smoothing={200}
              inset={24}
              loop={false}
              draggable
              driveIndex={index}
              onChange={(i) => setIndex(i)}
            />
          </div>

          <div className="faq-stage" key={index}>
            <div className="faq-main">
              <div className="faq-qrow">
                <span className="faq-prompt">
                  &gt;<i>_</i>
                </span>
                <h3 className="faq-question">{faq.question}</h3>
              </div>
              <div className="faq-ablock">
                <p className="faq-answer">{faq.answer}</p>
                {faq.chips && (
                  <div className="faq-chips">
                    {faq.chips.map((chip) => (
                      <span key={chip} className="chip">
                        {chip}
                      </span>
                    ))}
                  </div>
                )}
                <span className="faq-status">✓ answered</span>
              </div>
            </div>
            <span className="faq-ghost" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <FaqAccordion />
      {/* Volunteer Section */}

    </section>
  );
}
