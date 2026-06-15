"use client";

import { useEffect, useState } from "react";

export default function GameboyBattery() {
  const [level, setLevel] = useState(0.78);

  useEffect(() => {
    const id = setInterval(() => {
      setLevel((l) => {
        const next = l - 0.005;
        return next < 0.15 ? 0.95 : next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const segs = 4;
  const filled = Math.max(1, Math.round(level * segs));

  return (
    <aside
      aria-label="Battery (decorative)"
      className="hidden lg:flex fixed top-12 right-6 z-[46] items-center gap-2 select-none"
      style={{
        fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
        color: "#0f380f",
        fontSize: 8,
      }}
    >
      <span>BATT</span>
      <div
        className="flex items-stretch gap-[2px]"
        style={{
          border: "2px solid #0f380f",
          padding: 2,
          background: "#9bbc0f",
        }}
      >
        {Array.from({ length: segs }, (_, i) => (
          <span
            key={i}
            className="block"
            style={{
              width: 6,
              height: 10,
              background: i < filled ? "#0f380f" : "transparent",
            }}
          />
        ))}
      </div>
      <span
        className="block"
        style={{
          width: 3,
          height: 6,
          background: "#0f380f",
          marginLeft: -2,
        }}
      />
    </aside>
  );
}
