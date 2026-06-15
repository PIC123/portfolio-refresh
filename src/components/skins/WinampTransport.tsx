"use client";

import { useEffect, useState } from "react";

const TRACK_TITLES = [
  "INTER · Museum Space Experience",
  "Jordan Rudess · AI Visuals @ MIT",
  "Earth Mission Control · VR Climate",
  "Natural Harmony · Generative Mirror",
  "Tipping Points · Projection Mapping",
];

const FORMAT = (s: number) => {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const r = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${r}`;
};

export default function WinampTransport() {
  const [trackIdx, setTrackIdx] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [playing]);

  const total = 198;
  const pct = Math.min(100, (time / total) * 100);

  const next = () => {
    setTime(0);
    setTrackIdx((i) => (i + 1) % TRACK_TITLES.length);
  };
  const prev = () => {
    setTime(0);
    setTrackIdx((i) => (i - 1 + TRACK_TITLES.length) % TRACK_TITLES.length);
  };

  return (
    <aside
      aria-label="Winamp transport (decorative)"
      className="fixed bottom-4 right-4 z-40 w-[280px] skin-surface p-3 select-none"
      style={{ background: "var(--surface)" }}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className="font-pixel text-[10px]"
          style={{ color: "var(--accent)" }}
        >
          ● NOW.PLAYING
        </span>
        <span
          className="font-pixel text-[10px]"
          style={{ color: "var(--muted)" }}
        >
          {FORMAT(time)} / {FORMAT(total)}
        </span>
      </div>

      <div
        className="overflow-hidden mb-2 h-5 font-pixel text-xs"
        style={{ color: "var(--accent)" }}
      >
        <span className="skin-marquee">{TRACK_TITLES[trackIdx]}</span>
      </div>

      <div
        className="h-1.5 mb-3"
        style={{
          background: "rgba(0,0,0,0.4)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="h-full"
          style={{ width: `${pct}%`, background: "var(--accent)" }}
        />
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <TransportBtn label="Previous track" onClick={prev}>◄◄</TransportBtn>
        <TransportBtn
          label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? "❚❚" : "►"}
        </TransportBtn>
        <TransportBtn label="Stop" onClick={() => { setPlaying(false); setTime(0); }}>■</TransportBtn>
        <TransportBtn label="Next track" onClick={next}>►►</TransportBtn>
      </div>
    </aside>
  );
}

function TransportBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="skin-button inline-flex h-7 min-w-9 items-center justify-center px-2 font-pixel text-xs"
    >
      {children}
    </button>
  );
}
