"use client";

import { useCallback, useRef } from "react";
import { EQ_FREQUENCIES } from "@/lib/audio/engine";
import { useAudio } from "./audio/AudioProvider";

const MIN_DB = -12;
const MAX_DB = 12;
const RANGE = MAX_DB - MIN_DB;

const PRESETS: Record<string, number[]> = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Bass: [9, 7, 5, 2, 0, -1, -2, -2, -1, 0],
  Vocal: [-3, -2, 0, 3, 5, 5, 3, 1, 0, -1],
  Lab: [4, 2, 0, -2, 1, 3, 4, 5, 6, 6],
};

function label(freq: number): string {
  return freq >= 1000 ? `${freq / 1000}K` : `${freq}`;
}

export default function WinampEqualizer() {
  const { eqGains, setEqBand, resetEq } = useAudio();

  const applyPreset = (name: string) => {
    PRESETS[name].forEach((dB, i) => setEqBand(i, dB));
  };

  return (
    <aside
      aria-label="Graphic equalizer"
      className="w-[300px] skin-surface p-3 select-none"
      style={{ background: "var(--surface)" }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-[11px]"
          style={{
            color: "var(--accent)",
            fontFamily: "var(--font-lcd), monospace",
            textShadow: "0 0 4px var(--accent)",
          }}
        >
          ● EQUALIZER
        </span>
        <div className="flex items-center gap-1">
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() =>
                name === "Flat" ? resetEq() : applyPreset(name)
              }
              className="skin-button px-1.5 py-0.5 font-pixel text-[7px]"
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-1.5 h-28">
        {EQ_FREQUENCIES.map((freq, i) => (
          <Fader
            key={freq}
            value={eqGains[i] ?? 0}
            onChange={(dB) => setEqBand(i, dB)}
            label={label(freq)}
          />
        ))}
      </div>
    </aside>
  );
}

function Fader({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (dB: number) => void;
  label: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const fillPct = ((value - MIN_DB) / RANGE) * 100;

  const setFromClientY = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const ratio = 1 - (clientY - r.top) / r.height;
      const dB = Math.max(
        MIN_DB,
        Math.min(MAX_DB, MIN_DB + ratio * RANGE),
      );
      onChange(Math.round(dB));
    },
    [onChange],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setFromClientY(e.clientY);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    setFromClientY(e.clientY);
  };

  return (
    <div className="flex flex-1 flex-col items-center gap-1">
      <div
        ref={trackRef}
        role="slider"
        aria-label={`${label} Hz`}
        aria-valuemin={MIN_DB}
        aria-valuemax={MAX_DB}
        aria-valuenow={value}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") onChange(Math.min(MAX_DB, value + 1));
          if (e.key === "ArrowDown") onChange(Math.max(MIN_DB, value - 1));
        }}
        className="relative w-2.5 flex-1 cursor-ns-resize"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid #111",
          touchAction: "none",
        }}
      >
        <div
          className="absolute inset-x-0 bottom-0"
          style={{
            height: `${fillPct}%`,
            background:
              "linear-gradient(0deg, #14ff5a 0%, #88ff88 60%, #d9ff80 100%)",
            boxShadow: "0 0 6px #14ff5a",
          }}
        />
        <div
          className="absolute left-1/2 h-1.5 w-3.5 -translate-x-1/2"
          style={{
            bottom: `calc(${fillPct}% - 3px)`,
            background: "linear-gradient(180deg, #e0e0e0 0%, #5a5a5a 100%)",
            border: "1px solid #111",
          }}
        />
      </div>
      <span
        className="text-[7px] leading-none"
        style={{ color: "var(--muted)", fontFamily: "var(--font-lcd), monospace" }}
      >
        {label}
      </span>
    </div>
  );
}
