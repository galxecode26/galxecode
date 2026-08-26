"use client";

import { useEffect, useRef } from "react";
import PrizesRevealText from "./PrizesRevealText";

const LINE_ITEMS = [
  {
    id: "01",
    label: "BEST PERFORMER",
    value: "100%",
    sub: "Internship Opportunity",
    note: "Pune tech company · Real industry experience",
  },
  {
    id: "02",
    label: "1ST PLACE TEAM",
    value: "25%",
    sub: "Exclusive Course Benefit",
    note: "Advanced technology course program",
  },
  {
    id: "03",
    label: "EVERY PARTICIPANT",
    value: "5%",
    sub: "Course Discount",
    note: "Keep building your technical skills",
  },
];

export default function PrizesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".pz-reveal");
    if (!els || !els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="prizes" className="prizes-section" ref={sectionRef}>
      <div className="timeline-header">
        <p className="timeline-label">// REWARDS</p>
        <h2 className="timeline-title">
          <PrizesRevealText />
        </h2>
        <p className="timeline-desc">
          Build something impactful. Showcase your skills. Get rewarded for what
          you create.
        </p>
      </div>

      <div className="pr-receipt-wrap pz-reveal">
        <div className="pr-printer" aria-hidden="true">
          <div className="pr-printer-top" />
          <div className="pr-printer-face">
            <span className="pr-printer-brand">GALXE·PRINT</span>
            <span className="pr-printer-grill">
              <i />
              <i />
              <i />
            </span>
            <span className="pr-printer-led" />
          </div>
          <div className="pr-printer-lip" />
        </div>

        <div className="pr-paper">
          <div className="pr-receipt">
          <span className="pr-tape" aria-hidden="true" />

          <div className="pr-rc-head">
            <p className="pr-rc-brand">GALXECODE &apos;26</p>
            <p className="pr-rc-tag">*** REWARDS RECEIPT ***</p>
            <p className="pr-rc-meta">VIBE CODING HACKATHON · PUNE</p>
          </div>

          <div className="pr-rc-sep" />

          {LINE_ITEMS.map((item) => (
            <div key={item.id} className="pr-rc-item">
              <div className="pr-rc-row">
                <span className="pr-rc-id">{item.id}</span>
                <span className="pr-rc-label">{item.label}</span>
                <span className="pr-rc-dots" />
                <span className="pr-rc-value">{item.value}</span>
              </div>
              <div className="pr-rc-sub">
                <span className="pr-rc-arrow">↳</span> {item.sub}
                <span className="pr-rc-note"> · {item.note}</span>
              </div>
            </div>
          ))}

          <div className="pr-rc-sep pr-rc-sep--double" />

          <div className="pr-rc-row pr-rc-total-row">
            <span className="pr-rc-total-label">PRIZE POOL</span>
            <span className="pr-rc-dots" />
            <span className="pr-rc-total">₹25,000</span>
          </div>

          <div className="pr-rc-sep pr-rc-sep--double" />

          <div className="pr-rc-foot">
            <p className="pr-cta-line">Build · Compete · Learn</p>
            <span className="pr-stamp">Get Hired</span>
            <p className="pr-rc-note-center">
              &ldquo;your project could be your next opportunity&rdquo;
            </p>

            <div className="pr-barcode" aria-hidden="true" />
            <p className="pr-rc-meta pr-rc-no">* TXN NO: GC26-PUNE-2026 *</p>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
