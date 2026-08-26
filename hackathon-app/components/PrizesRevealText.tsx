"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "₹$%#@&*+=?";
const WORD_WHITE = "* Prizes &";
const WORD_ACCENT = "Rewards *";

interface Cell {
  ch: string;
  steps: number;
}

function buildCells(word: string, base: number): Cell[] {
  let n = base;
  return word.split("").map((ch) => {
    if (ch === " ") return { ch, steps: 0 };
    const steps = 3 + (n % 3);
    n += 1;
    return { ch, steps };
  });
}

export default function PrizesRevealText() {
  const ref = useRef<HTMLSpanElement>(null);
  const [play, setPlay] = useState(false);
  const [instant, setInstant] = useState(false);
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

  // Replay slot-machine roll every 5 seconds
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

  const renderWord = (word: string, offset: number, accent: boolean) => {
    const cells = buildCells(word, offset);
    return (
      <span className="pz-rword">
        {cells.map((cell, i) =>
          cell.ch === " " ? (
            <span key={i} className="pz-rspace">
              {"\u00A0"}
            </span>
          ) : (
            <span key={i} className="pz-rmask">
              <span className="pz-rsize">{cell.ch}</span>
              <span
                className={`pz-strip ${play ? "pz-strip--in" : ""} ${
                  instant ? "pz-strip--instant" : ""
                }`}
                style={
                  {
                    "--d": `${offset + i * 55}ms`,
                    "--steps": cell.steps,
                  } as React.CSSProperties
                }
              >
                {Array.from({ length: cell.steps }).map((_, s) => (
                  <span key={s}>{GLYPHS[(i * 7 + s * 5) % GLYPHS.length]}</span>
                ))}
                <span className={`pz-final ${accent ? "pz-final--accent" : ""}`}>
                  {cell.ch}
                </span>
              </span>
            </span>
          )
        )}
      </span>
    );
  };

  return (
    <span ref={ref} className="pz-roll">
      {renderWord(WORD_WHITE, 0, false)}
      <span className="pz-rspace">{"\u00A0"}</span>
      {renderWord(WORD_ACCENT, 8, true)}
    </span>
  );
}
