"use client";

import { useEffect, useRef } from "react";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { SiInstagram, SiX, SiWhatsapp } from "react-icons/si";
import { FaLinkedinIn } from "react-icons/fa";

const NAV_LINKS = [
  { label: "About", target: ".about-section" },
  { label: "Eligibility", target: ".eligibility-section" },
  { label: "Why Us", target: ".why-section" },
  { label: "Timeline", target: ".timeline-section" },
  { label: "Prizes", target: ".prizes-section" },
  { label: "FAQs", target: ".faq-section" },
];

const SOCIALS = [
  { icon: SiInstagram, label: "Instagram" },
  { icon: FaLinkedinIn, label: "LinkedIn" },
  { icon: SiX, label: "X" },
];

export default function Footer({ onRegister }: { onRegister?: () => void }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll(".ft2-reveal");
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
      { threshold: 0.2 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (target: string) => {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="footer2" ref={sectionRef}>
      {/* status strip */}
      <div className="ft2-strip ft2-reveal">
        <span>{"//"} END_OF_TRANSMISSION</span>
        <span className="ft2-live">
          <i /> REGISTRATIONS OPEN
        </span>
        <span className="ft2-ver">GALXECODE v26.0</span>
      </div>

      <div className="ft2-inner">
        {/* nav chips + register */}
        <nav className="ft2-nav ft2-reveal" aria-label="Footer navigation">
          <span className="ft2-nav-label">[ navigate ]</span>
          <div className="ft2-chips">
            {NAV_LINKS.map((l) => (
              <button key={l.target} onClick={() => scrollTo(l.target)}>
                {l.label}
              </button>
            ))}
          </div>
            <button
              className="ft2-register"
              onClick={onRegister}
              type="button"
            >
              Register Now
              <ArrowUpRight size={18} />
            </button>
        </nav>

        {/* contact + socials */}
        <div className="ft2-row ft2-reveal">
          <a className="ft2-mail" href="mailto:contact@galxecode.in">
            contact@galxecode.in
          </a>
          <span className="ft2-sep-v" />
          <span className="ft2-loc">Pune, Maharashtra · IN</span>
          <span className="ft2-flex" />
          <div className="ft2-socials">
            <a
              href="https://chat.whatsapp.com/JDxspXbRlezKQXm1n5so2S?s=cl&p=a&mlu=4"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Join WhatsApp Group"
              className="ft2-soc ft2-whatsapp"
            >
              <SiWhatsapp size={16} />
              <span>Join Group</span>
            </a>
            {SOCIALS.map((s) => (
              <a key={s.label} aria-label={s.label} href="#" className="ft2-soc">
                <s.icon size={16} />
              </a>
            ))}
            <a aria-label="Email" href="mailto:contact@galxecode.in" className="ft2-soc">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* meta */}
        <div className="ft2-meta ft2-reveal">
          <span>© 2026 GalxeCode — All rights reserved</span>
          <span>Made in Pune, with AI</span>
          <button
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            TOP <ArrowUp size={13} />
          </button>
        </div>
      </div>

      {/* wordmark */}
      <div className="ft2-wordmark-wrap" aria-hidden="true">
        <div className="ft2-wordmark">GALXECODE</div>
      </div>
    </footer>
  );
}
