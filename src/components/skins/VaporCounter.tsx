"use client";

import { useEffect, useState } from "react";

const KEY = "pc-visits";
const BASE = 90210; // because it's the 90s.

// A period-accurate GeoCities-style hit counter. Persists per browser.
export default function VaporCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let n = BASE;
    try {
      const stored = Number(localStorage.getItem(KEY));
      n = Number.isFinite(stored) && stored > 0 ? stored + 1 : BASE + 1;
      localStorage.setItem(KEY, String(n));
    } catch {
      n = BASE + 1;
    }
    setCount(n);
  }, []);

  const digits = String(count ?? BASE).padStart(8, "0").split("");

  return (
    <aside
      aria-label="Visitor counter (decorative)"
      className="fixed top-16 right-3 z-40 select-none"
      style={{
        fontFamily: "var(--font-retro), 'Audiowide', sans-serif",
      }}
    >
      <div
        className="mb-1 text-[9px] tracking-widest text-center"
        style={{ color: "#ff00aa" }}
      >
        ✦ YOU ARE VISITOR ✦
      </div>
      <div
        className="flex gap-[2px] p-1"
        style={{
          background: "#000",
          border: "2px solid #00ffff",
          boxShadow: "0 0 14px rgba(0,255,255,0.6)",
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            className="inline-flex h-6 w-4 items-center justify-center text-sm tabular-nums"
            style={{
              background: "linear-gradient(180deg, #1a1a1a, #000)",
              color: "#00ff88",
              textShadow: "0 0 6px #00ff88",
            }}
          >
            {d}
          </span>
        ))}
      </div>
    </aside>
  );
}
