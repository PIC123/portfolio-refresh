"use client";

import { useEffect, useState } from "react";

export default function VaporClock() {
  const [time, setTime] = useState<{
    hh: string;
    mm: string;
    ss: string;
    colon: boolean;
  }>({ hh: "--", mm: "--", ss: "--", colon: true });

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTime({
        hh: String(d.getHours()).padStart(2, "0"),
        mm: String(d.getMinutes()).padStart(2, "0"),
        ss: String(d.getSeconds()).padStart(2, "0"),
        colon: d.getSeconds() % 2 === 0,
      });
    };
    update();
    const id = setInterval(update, 500);
    return () => clearInterval(id);
  }, []);

  return (
    <aside
      aria-label="Clock (decorative)"
      className="fixed bottom-4 left-4 z-40 skin-surface select-none"
      style={{
        background: "rgba(26,0,42,0.8)",
        padding: "12px 18px",
        border: "2px solid #00ffff",
        boxShadow:
          "0 0 22px rgba(0,255,255,0.7), 0 0 40px rgba(255,0,170,0.45)",
      }}
    >
      <div
        className="text-[10px] mb-1 tracking-widest"
        style={{
          color: "#ff00aa",
          fontFamily: "var(--font-retro), 'Audiowide', sans-serif",
        }}
      >
        ◆ CURRENT TIME
      </div>
      <div
        className="text-4xl leading-none tabular-nums"
        style={{
          color: "#00ffff",
          fontFamily: "var(--font-retro), 'Audiowide', sans-serif",
          textShadow:
            "0 0 8px #00ffff, 2px 2px 0 #ff00aa, -2px -2px 0 rgba(255,255,255,0.3)",
        }}
      >
        {time.hh}
        <span style={{ opacity: time.colon ? 1 : 0.25 }}>:</span>
        {time.mm}
        <span style={{ opacity: time.colon ? 1 : 0.25 }}>:</span>
        {time.ss}
      </div>
    </aside>
  );
}
