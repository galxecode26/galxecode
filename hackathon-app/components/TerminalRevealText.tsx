"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const DEFAULT_TEXT = "< Who Can Join />";

export default function TerminalRevealText({
  text = DEFAULT_TEXT,
  accent = "Join",
}: {
  text?: string;
  accent?: string;
}) {
  const FULL_TEXT = text;
  const ACCENT_START = FULL_TEXT.indexOf(accent);
  const ACCENT_END =
    ACCENT_START === -1 ? -1 : ACCENT_START + accent.length;

  const [count, setCount] = useState(0);
  const [typing, setTyping] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countRef = useRef(0);

  const startTyping = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCount(0);
    setTyping(true);
    countRef.current = 0;

    const tick = () => {
      countRef.current += 1;
      setCount(countRef.current);
      if (countRef.current < FULL_TEXT.length) {
        const prev = FULL_TEXT[countRef.current - 1];
        const delay = prev === " " ? 120 : 40 + Math.random() * 70;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setTyping(false);
      }
    };
    timerRef.current = setTimeout(tick, 300);
  }, [FULL_TEXT]);

  useEffect(() => {
    startTyping();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTyping]);

  // Replay typewriter every 5 seconds
  useEffect(() => {
    const id = setInterval(() => startTyping(), 5000);
    return () => clearInterval(id);
  }, [startTyping]);

  return (
    <span className="term-type">
      {FULL_TEXT.slice(0, count).split("").map((char, i) => (
        <span
          key={i}
          className={`term-type__char ${
            i >= ACCENT_START && i < ACCENT_END ? "term-type__char--accent" : ""
          }`}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
      <span className={`term-type__caret ${typing ? "" : "term-type__caret--blink"}`} />
    </span>
  );
}
