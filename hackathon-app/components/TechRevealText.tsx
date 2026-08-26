"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CODE_CHARS = "01{}[]<>/\\|=+-*&^%$#@!?;:.~`";
const FULL_TEXT = "The Vision Behind GalxeCode '26";
const REVEAL_DURATION = 2000;

const PURPLE_START = FULL_TEXT.indexOf("GalxeCode");

export default function TechRevealText() {
  const [display, setDisplay] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [glitchActive, setGlitchActive] = useState(false);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const runDecode = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    startRef.current = performance.now();
    setRevealed(false);

    const animate = (now: number) => {
      const elapsed = now - startRef.current;
      const progress = Math.min(elapsed / REVEAL_DURATION, 1);
      const revealedCount = Math.floor(progress * FULL_TEXT.length);

      let result = "";
      for (let i = 0; i < FULL_TEXT.length; i++) {
        if (i < revealedCount) {
          result += FULL_TEXT[i];
        } else if (FULL_TEXT[i] === " ") {
          result += " ";
        } else {
          result += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        }
      }
      setDisplay(result);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplay(FULL_TEXT);
        setRevealed(true);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    runDecode();
    return () => cancelAnimationFrame(frameRef.current);
  }, [runDecode]);

  useEffect(() => {
    if (!revealed) return;
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 150);
    }, 3500);
    return () => clearInterval(interval);
  }, [revealed]);

  const handleHover = () => {
    runDecode();
    setGlitchActive(true);
    setTimeout(() => setGlitchActive(false), 150);
  };

  return (
    <span
      className={`tech-reveal ${glitchActive ? "tech-reveal--glitch" : ""}`}
      onMouseEnter={handleHover}
      style={{ cursor: "pointer" }}
    >
      {display.split("").map((char, i) => {
        const isRevealed = i < FULL_TEXT.length && display[i] === FULL_TEXT[i];
        const isPurple = isRevealed && i >= PURPLE_START;
        return (
          <span
            key={i}
            className={`tech-char ${isRevealed ? (isPurple ? "tech-char--purple" : "tech-char--white") : "tech-char--scramble"}`}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      })}
    </span>
  );
}
