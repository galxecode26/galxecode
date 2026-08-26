"use client";

import { useEffect, useRef, useState } from "react";

const WORD_WHITE = "« Event";
const WORD_ACCENT = "Journey »";
const STAGGER = 45;

export default function TimelineRevealText() {
  const ref = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playedRef.current) {
          setPlay(true);
          playedRef.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Replay 3D drop every 5 seconds
  useEffect(() => {
    if (!play) return;
    const id = setInterval(() => {
      setPlay(false);
      requestAnimationFrame(() => requestAnimationFrame(() => setPlay(true)));
    }, 5000);
    return () => clearInterval(id);
  }, [play]);

  const renderWord = (
    word: string,
    offset: number,
    accent?: boolean
  ) => (
    <span className="tlr-word">
      {word.split("").map((ch, i) => (
        <span
          key={`${word}-${i}`}
          className={`tlr-ch ${accent ? "tlr-ch--accent" : ""} ${
            play ? "tlr-ch--in" : ""
          }`}
          style={
            {
              "--d": `${offset + i * STAGGER}ms`,
            } as React.CSSProperties
          }
        >
          {ch}
        </span>
      ))}
      {"\u00A0"}
    </span>
  );

  return (
    <span ref={ref} className="tlr-reveal">
      {renderWord(WORD_WHITE, 0)}
      {renderWord(WORD_ACCENT, WORD_WHITE.length * STAGGER, true)}
    </span>
  );
}
