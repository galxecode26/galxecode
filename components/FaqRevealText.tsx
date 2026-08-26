"use client";

import { useEffect, useRef, useState } from "react";

const LINE_WHITE = ":: Frequently Asked ";
const LINE_ACCENT = "Questions ::";

interface CharsProps {
  text: string;
  offset: number;
  play: boolean;
  instant?: boolean;
  accent?: boolean;
}

function Chars({ text, offset, play, instant, accent }: CharsProps) {
  return (
    <>
      {text.split("").map((ch, i) =>
        ch === " " ? (
          <span key={`s-${i}`} className="fq-space">
            {"\u00A0"}
          </span>
        ) : (
          <span
            key={`${ch}-${i}`}
            className={`fq-ch ${accent ? "fq-ch--accent" : ""} ${
              play ? "fq-ch--in" : ""
            } ${instant ? "fq-ch--instant" : ""}`}
            style={{ "--d": `${offset + i * 42}ms` } as React.CSSProperties}
          >
            {ch}
          </span>
        )
      )}
    </>
  );
}

export default function FaqRevealText() {
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

  // Replay letter stagger every 5 seconds
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

  return (
    <span ref={ref} className="fq-reveal">
      <Chars text={LINE_WHITE} offset={0} play={play} instant={instant} />
      <Chars
        text={LINE_ACCENT}
        offset={LINE_WHITE.length * 42}
        play={play}
        instant={instant}
        accent
      />
    </span>
  );
}
