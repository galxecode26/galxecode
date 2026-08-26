"use client";

import { useEffect, useRef, useCallback } from "react";

const RAIN_FONT_SIZE = 15;
const RAIN_THROTTLE = 50;
const RAIN_CHARS = "01";

function BinaryRain({ canvasRef }: { canvasRef: React.RefObject<HTMLCanvasElement | null> }) {
  const columnsRef = useRef<
    { x: number; y: number; speed: number; chars: string[]; length: number }[]
  >([]);
  const lastFrameRef = useRef(0);
  const rafRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const initColumns = () => {
      const w = canvas.width;
      const dpr = window.devicePixelRatio || 1;
      const fontSize = RAIN_FONT_SIZE * dpr;
      const colCount = Math.floor(w / (fontSize * 1.8));
      const columns: typeof columnsRef.current = [];

      for (let i = 0; i < colCount; i++) {
        const charCount = 15 + Math.floor(Math.random() * 25);
        const chars: string[] = [];
        for (let j = 0; j < charCount; j++) {
          chars.push(RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)]);
        }
        columns.push({
          x: (i + 0.3 + Math.random() * 0.4) * (w / colCount),
          y: Math.random() * canvas.height * -1,
          speed: 0.4 + Math.random() * 0.8,
          chars,
          length: charCount,
        });
      }
      columnsRef.current = columns;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      initColumns();
    };

    resize();
    window.addEventListener("resize", resize);

    const onVisChange = () => {
      pausedRef.current = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisChange);

    const draw = (timestamp: number) => {
      rafRef.current = requestAnimationFrame(draw);
      if (pausedRef.current) return;
      if (timestamp - lastFrameRef.current < RAIN_THROTTLE) return;
      lastFrameRef.current = timestamp;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width;
      const h = canvas.height;
      const fontSize = RAIN_FONT_SIZE * dpr;

      ctx.clearRect(0, 0, w, h);
      ctx.font = `${fontSize}px "Courier New", monospace`;
      ctx.textAlign = "center";

      for (const col of columnsRef.current) {
        col.y += col.speed * dpr;

        for (let j = 0; j < col.chars.length; j++) {
          const charY = col.y + j * fontSize * 1.5;
          if (charY < -fontSize || charY > h + fontSize) continue;

          const progress = charY / h;
          const fade = progress < 0.1 ? progress / 0.1 : progress > 0.65 ? (1 - progress) / 0.35 : 1;
          const alpha = Math.max(0, Math.min(1, fade)) * (0.12 + Math.random() * 0.03);

          ctx.fillStyle = `rgba(196, 181, 253, ${alpha})`;
          ctx.fillText(col.chars[j], col.x, charY);

          // Glitch: flip 0↔1 occasionally
          if (Math.random() < 0.01) {
            col.chars[j] = col.chars[j] === "0" ? "1" : "0";
          } else if (Math.random() < 0.003) {
            col.chars[j] = RAIN_CHARS[Math.floor(Math.random() * RAIN_CHARS.length)];
          }
        }

        const bottomOfCol = col.y + col.chars.length * fontSize * 1.5;
        if (bottomOfCol > h) {
          col.y = Math.random() * h * -0.6;
          col.speed = 0.4 + Math.random() * 0.8;
        }
      }
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [canvasRef]);

  return null;
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Layer 1 — Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #050014 0%, #0c0225 20%, #1a0840 35%, #2d1155 48%, #1a0840 60%, #0a0410 80%, #020008 100%)",
        }}
      />

      {/* Layer 2 — Matrix/binary rain canvas */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 70%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 70%)",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
        <BinaryRain canvasRef={canvasRef} />
      </div>

      {/* Layer 3 — Glow waves image */}
      <div
        className="absolute left-0 right-0 bottom-0 pointer-events-none"
        style={{
          height: "65%",
          mixBlendMode: "screen",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 70%, transparent 100%)",
        }}
      >
        <img
          src="/hero-glow-waves.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ opacity: 0.85 }}
        />
      </div>

      {/* Layer 4 — Bottom fade to pure black */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{
          height: "30%",
          background: "linear-gradient(180deg, transparent 0%, #000 60%)",
        }}
      />

      {/* Grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
    </div>
  );
}
