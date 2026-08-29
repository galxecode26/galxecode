"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Rocket, ArrowRight } from "lucide-react";
import { FaMicrosoft, FaAmazon, FaGoogle, FaAws, FaGithub, FaSlack, FaFigma } from "react-icons/fa";
import SpecularButton from "./ui/SpecularButton";
import CardNav from "./ui/CardNav";
import LogoLoop from "./ui/LogoLoop";
import HeroBackground from "./HeroBackground";
import TypewriterHeadline from "./TypewriterHeadline";
import AboutSection from "./AboutSection";
import EligibilitySection from "./EligibilitySection";
import WhyParticipate from "./WhyParticipate";
import TimelineSection from "./TimelineSection";
import PrizesSection from "./PrizesSection";
import FaqSection from "./FaqSection";
import Footer from "./Footer";
import RegisterForm from "./RegisterForm";
import ConnectedPartners from "./ConnectedPartners";
import JudgingRoadmapSection from "./JudgingRoadmapSection";
import VolunteerSection from "./VolunteerSection";

import { CUSTOM_LOGOS } from "./logoData";

const STATS = [
  { icon: "#", target: 500, suffix: "+", decimals: 0, label: "Builders & Innovators" },
  { icon: "%", target: 50, suffix: "+", decimals: 0, label: "AI Tools & APIs" },
  { icon: "*", target: 10, suffix: "+", decimals: 0, label: "Tracks & Challenges" },
  { icon: "₹", target: 25, suffix: "K+", decimals: 0, label: "Rewards & Prizes" },
];

const TECH_LOGOS = CUSTOM_LOGOS;

const CARD_NAV_ITEMS = [
  {
    label: "Event",
    bgColor: "transparent",
    textColor: "#fff",
    links: [
      { label: "About", ariaLabel: "About GalxeCode", href: "#about" },
      { label: "Eligibility", ariaLabel: "Who can join", href: "#eligibility" },
      { label: "Why Us", ariaLabel: "Why participate", href: "#why-us" },
    ],
  },
  {
    label: "Details",
    bgColor: "transparent",
    textColor: "#fff",
    links: [
      { label: "Timeline", ariaLabel: "Event timeline", href: "#timeline" },
      { label: "Judging & Roadmap", ariaLabel: "Judging criteria and roadmap", href: "#judging" },
      { label: "Prizes", ariaLabel: "Prizes and rewards", href: "#prizes" },
      { label: "Partners", ariaLabel: "Connected partners", href: "#partners" },
      { label: "Volunteers", ariaLabel: "Volunteer crew application", href: "#volunteer" },
      { label: "FAQs", ariaLabel: "Frequently asked questions", href: "#faqs" },
    ],
  },
  {
    label: "Contact",
    bgColor: "transparent",
    textColor: "#fff",
    links: [
      { label: "Email", ariaLabel: "Email us", href: "mailto:contact@galxecode.in" },
      { label: "Instagram", ariaLabel: "Instagram", href: "#" },
      { label: "LinkedIn", ariaLabel: "LinkedIn", href: "#" },
    ],
  },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function animateValue(
  el: HTMLSpanElement,
  target: number,
  suffix: string,
  decimals: number,
  duration: number
) {
  let startTime: number | null = null;
  function step(timestamp: number) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(progress);
    const current = eased * target;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }
  requestAnimationFrame(step);
}

export default function LandingPage() {
  const statsObserverRef = useRef<IntersectionObserver | null>(null);
  const [regOpen, setRegOpen] = useState(false);

  const openRegister = useCallback(() => setRegOpen(true), []);
  const closeRegister = useCallback(() => setRegOpen(false), []);

  // lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = regOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [regOpen]);

  // close on Escape
  useEffect(() => {
    if (!regOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRegister();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [regOpen, closeRegister]);

  useEffect(() => {
    // Count-up animation
    const statValues = document.querySelectorAll<HTMLSpanElement>(".stat-value");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLSpanElement;
            const target = parseFloat(el.getAttribute("data-target") || "0");
            const suffix = el.getAttribute("data-suffix") || "";
            const decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
            const index = Array.from(statValues).indexOf(el);
            const duration = 1500 + index * 80;
            const startDelay = 480 + index * 90;
            setTimeout(() => {
              animateValue(el, target, suffix, decimals, duration);
            }, startDelay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    statValues.forEach((stat) => observer.observe(stat));
    statsObserverRef.current = observer;

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <HeroBackground />

      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="dotMatrix">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
            <feComponentTransfer in="blur" result="threshold">
              <feFuncA type="discrete" tableValues="0 1" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="page">
        <CardNav
          logo="/header-logo.png"
          logoAlt="Galxecode Logo"
          logoText="GalxeCode"
          items={CARD_NAV_ITEMS}
          baseColor="rgba(10, 5, 18, 0.85)"
          menuColor="#fff"
          buttonBgColor="#6A1B9A"
          buttonTextColor="#fff"
          ease="power3.out"
          ctaOnClick={openRegister}
        />

        <main className="hero">
          <div className="trust-row anim" style={{ "--d": "0.05s" } as React.CSSProperties}>
            <img
              src="/uplearn-logo.png"
              alt="UpLearning"
              style={{
                height: "var(--trust-size)",
                width: "auto",
                mixBlendMode: "screen",
              }}
            />
            <span
              style={{
                marginLeft: 12,
                fontSize: "clamp(18px, 2.4vw, 28px)",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: "#e9d5ff",
                transform: "translateY(-3px)",
              }}
            >
              Presents
            </span>
          </div>

          <TypewriterHeadline />

          <div className="organized-by-banner anim" style={{ "--d": "0.22s" } as React.CSSProperties}>
            <a
              href="https://drpaiu.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="organized-by-pill cursor-pointer"
              title="Visit Dr. P. A. Inamdar University Website"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/pa-inamdar-logo.png"
                alt="Dr. P. A. Inamdar University Logo"
                className="organized-by-logo"
              />
              <span className="organized-by-text">
                Organised by <strong className="organized-by-highlight">Dr. P. A. Inamdar University</strong>
              </span>
            </a>
          </div>

          <p className="subhead anim" style={{ "--d": "0.28s" } as React.CSSProperties}>
            The ultimate platform for builders to ideate, prototype, and ship AI-powered
            solutions that solve real-world problems.
          </p>

          <div className="cta-group anim" style={{ "--d": "0.4s" } as React.CSSProperties}>
            <SpecularButton
              size="lg"
              radius={999}
              tint="#e879f9"
              tintOpacity={0.4}
              blur={10}
              textColor="#ffffff"
              lineColor="#c084fc"
              baseColor="#9333ea"
              intensity={0.9}
              shineSize={12}
              shineFade={50}
              thickness={1.5}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={openRegister}
            >
              <Rocket size={18} style={{ marginRight: 8, verticalAlign: "middle" }} />
              Join GalxeCode '26
            </SpecularButton>
            <SpecularButton
              size="lg"
              radius={999}
              tint="#ffffff"
              tintOpacity={0}
              blur={0}
              textColor="#d1d5db"
              lineColor="#9333ea"
              baseColor="#3b0764"
              intensity={0.8}
              shineSize={10}
              shineFade={40}
              thickness={1}
              speed={0.35}
              followMouse
              proximity={250}
              autoAnimate={false}
              onClick={() => window.open('https://chat.whatsapp.com/JDxspXbRlezKQXm1n5so2S?s=cl&p=a&mlu=4', '_blank')}
            >
              Join Group
              <ArrowRight size={18} style={{ marginLeft: 8, verticalAlign: "middle" }} />
            </SpecularButton>
          </div>
        </main>

        <footer className="stats anim" style={{ "--d": "0.45s" } as React.CSSProperties}>
          {STATS.map((stat, i) => (
            <div key={stat.label} className="stat" style={{ "--sd": `${0.45 + i * 0.08}s` } as React.CSSProperties}>
              <span className={stat.icon === "₹" ? "stat-icon stat-icon-rupee" : "stat-icon"}>{stat.icon}</span>
              <span
                className="stat-value"
                data-target={stat.target}
                data-suffix={stat.suffix}
                data-decimals={stat.decimals}
              >
                0{stat.suffix}
              </span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </footer>

        <div className="logo-loop-band">
          <LogoLoop
            logos={TECH_LOGOS}
            speed={90}
            logoHeight={32}
            gap={64}
            pauseOnHover
            scaleOnHover
            fadeOut
            fadeOutColor="#000000"
            ariaLabel="Technologies you'll use at GalxeCode"
          />
        </div>

        <AboutSection />

        <EligibilitySection />

        <WhyParticipate />

        <TimelineSection />
 
        <JudgingRoadmapSection />

        <PrizesSection />

        <ConnectedPartners />

        <VolunteerSection />

        <FaqSection />
      </div>

      <Footer onRegister={openRegister} />

      {regOpen && (
        <div className="fixed inset-0 z-[1100]">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-lg"
            style={{ animation: "ft-fade-in .3s ease both" }}
            onClick={closeRegister}
          />

          {/* centered card */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-3 pt-20 pb-4 sm:p-8">
            {/* animated gradient border wrapper */}
            <div className="pointer-events-auto w-full max-w-2xl max-h-[92vh] rounded-2xl bg-gradient-to-b from-purple-500/90 via-fuchsia-500/40 to-purple-700/90 p-[1.5px] shadow-[0_0_100px_rgba(124,58,237,0.5)]" style={{ animation: "modal-in .38s cubic-bezier(.22,1,.36,1) both" }} onClick={(e) => e.stopPropagation()}>
              <div className="flex max-h-[calc(92vh-3px)] flex-col overflow-hidden rounded-[15px] bg-[#070310]">
                {/* window chrome */}
                <div className="flex items-center gap-2 border-b border-purple-500/15 bg-black/50 px-5 py-3.5">
                  <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                  <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                  <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  <span className="ml-3 font-mono text-xs text-zinc-400">
                    galxe@code — registration
                  </span>
                  <button
                    onClick={closeRegister}
                    aria-label="Close"
                    className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg border border-purple-500/25 text-zinc-400 transition-all hover:border-rose-400/60 hover:bg-rose-500/10 hover:text-rose-300"
                  >
                    ✕
                  </button>
                </div>

                {/* scrollable form */}
                <div className="no-scrollbar overflow-y-auto overscroll-contain min-h-0 flex-1 px-5 py-5 pb-8 sm:px-9 sm:py-8">
                  <RegisterForm onClose={closeRegister} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
