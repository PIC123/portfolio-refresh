"use client";

import { useEffect, useRef, useState } from "react";

const BANDS = ["60", "170", "310", "600", "1K", "3K", "6K", "12K", "14K", "16K"];

export default function WinampEqualizer() {
  const [values, setValues] = useState<number[]>(() =>
    BANDS.map(() => 0.4 + Math.random() * 0.6),
  );
  const rafRef = useRef(0);
  const lastRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tickMs = reduce ? 1000 : 220;

    const loop = (t: number) => {
      if (t - lastRef.current >= tickMs) {
        lastRef.current = t;
        setValues((prev) =>
          prev.map((v) => {
            const drift = (Math.random() - 0.5) * 0.35;
            const next = Math.max(0.05, Math.min(1, v + drift));
            return next;
          }),
        );
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <aside
      aria-label="Equalizer (decorative)"
      className="fixed bottom-4 left-4 z-40 skin-surface select-none"
      style={{ background: "var(--surface)", padding: 10 }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[10px]"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-lcd), monospace",
            textShadow: "0 0 4px var(--accent)",
          }}
        >
          ● EQUALIZER
        </span>
        <span
          className="text-[10px]"
          style={{
            color: "var(--muted)",
            fontFamily: "var(--font-lcd), monospace",
          }}
        >
          PRE.AMP
        </span>
      </div>
      <div className="flex items-end gap-2 h-24">
        {values.map((v, i) => (
          <div
            key={BANDS[i]}
            className="flex flex-col items-center gap-1"
          >
            <div
              className="relative w-2 h-16"
              style={{
                background: "rgba(0,0,0,0.55)",
                border: "1px solid #111",
                boxShadow: "inset 1px 1px 0 rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="absolute inset-x-0 bottom-0 transition-[height] duration-200"
                style={{
                  height: `${v * 100}%`,
                  background:
                    "linear-gradient(0deg, #14ff5a 0%, #88ff88 60%, #d9ff80 100%)",
                  boxShadow: "0 0 6px #14ff5a",
                }}
              />
              <div
                className="absolute left-1/2 -translate-x-1/2 w-3 h-1.5"
                style={{
                  bottom: `calc(${v * 100}% - 3px)`,
                  background:
                    "linear-gradient(180deg, #d8d8d8 0%, #5a5a5a 100%)",
                  border: "1px solid #111",
                }}
              />
            </div>
            <span
              className="text-[8px] leading-none"
              style={{
                color: "var(--muted)",
                fontFamily: "var(--font-lcd), monospace",
              }}
            >
              {BANDS[i]}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}
