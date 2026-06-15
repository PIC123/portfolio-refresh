"use client";

import { useMemo } from "react";

const ITEMS = ["🌴", "🗿", "🐬", "💾", "🪩", "🌅", "📼", "✨"];

function rand(seed: number) {
  let t = seed >>> 0;
  return () => {
    t = (t * 1664525 + 1013904223) >>> 0;
    return t / 4294967296;
  };
}

export default function VaporFloaters() {
  const items = useMemo(() => {
    const r = rand(7);
    return new Array(8).fill(0).map((_, i) => ({
      char: ITEMS[i % ITEMS.length],
      left: r() * 90,
      delay: r() * -22,
      duration: 14 + r() * 12,
      size: 28 + r() * 22,
    }));
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-[5] overflow-hidden"
    >
      <style>{`
        @keyframes vapor-bob {
          0%   { transform: translate(0, 100vh) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translate(40px, -10vh) rotate(20deg); opacity: 0; }
        }
      `}</style>
      {items.map((it, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: `${it.left}%`,
            top: 0,
            fontSize: it.size,
            filter: "drop-shadow(0 0 8px rgba(0,255,255,0.7))",
            animation: `vapor-bob ${it.duration}s linear ${it.delay}s infinite`,
          }}
        >
          {it.char}
        </span>
      ))}
    </div>
  );
}
