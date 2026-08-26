"use client";

import { useState } from "react";
import FaqRevealText from "./FaqRevealText";
import { FAQS } from "./faqData";

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="faq-mobile">
      <div className="faq-m-head">
        <p className="faq-m-label">// FAQS</p>
        <h2 className="faq-m-title">
          <FaqRevealText />
        </h2>
      </div>

      <div className="faq-m-list">
        {FAQS.map((faq, i) => {
          const isOpen = open === i;
          return (
            <div key={faq.label} className={`faq-m-item${isOpen ? " open" : ""}`}>
              <button
                type="button"
                className="faq-m-q"
                aria-expanded={isOpen}
                aria-controls={`faq-m-panel-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="faq-m-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-m-qtext">{faq.question}</span>
                <span className="faq-m-toggle" aria-hidden="true" />
              </button>
              <div id={`faq-m-panel-${i}`} className="faq-m-answrap">
                <div className="faq-m-ansinner">
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
