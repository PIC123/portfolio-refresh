"use client";

import { useState } from "react";
import { useAudio, formatTime } from "./audio/AudioProvider";
import WinampEqualizer from "./WinampEqualizer";

export default function WinampTransport() {
  const { state, tracks, toggle, next, prev, seek, setVolume } = useAudio();
  const [showEq, setShowEq] = useState(false);
  const track = tracks[state.trackIndex];
  const pct = state.duration ? (state.elapsed / state.duration) * 100 : 0;

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
      {showEq && (
        <div className="mb-2">
          <WinampEqualizer />
        </div>
      )}

      <aside
        aria-label="Winamp player"
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
            ● NOW PLAYING
          </span>
          <span
            className="text-[11px]"
            style={{
              color: "var(--muted)",
              fontFamily: "var(--font-lcd), monospace",
            }}
          >
            {formatTime(state.elapsed)} / {formatTime(state.duration)}
          </span>
        </div>

        <div
          className="mb-1 h-5 overflow-hidden text-sm"
          style={{ color: "var(--accent)" }}
        >
          <span className="skin-marquee font-pixel">
            {track.title} — {track.subtitle}
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            seek(((e.clientX - r.left) / r.width) * state.duration);
          }}
          aria-label="Seek"
          className="mb-3 block h-2 w-full"
          style={{
            background: "rgba(0,0,0,0.4)",
            border: "1px solid var(--border)",
          }}
        >
          <span
            className="block h-full"
            style={{ width: `${pct}%`, background: "var(--accent)" }}
          />
        </button>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <TransportBtn label="Previous track" onClick={prev}>
              ◄◄
            </TransportBtn>
            <TransportBtn label={state.playing ? "Pause" : "Play"} onClick={toggle}>
              {state.playing ? "❚❚" : "►"}
            </TransportBtn>
            <TransportBtn label="Next track" onClick={next}>
              ►►
            </TransportBtn>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="font-pixel text-[8px]"
              style={{ color: "var(--muted)" }}
            >
              VOL
            </span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={state.volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              aria-label="Volume"
              className="w-16 accent-current"
              style={{ accentColor: "var(--accent)" }}
            />
            <button
              type="button"
              onClick={() => setShowEq((v) => !v)}
              aria-pressed={showEq}
              className="skin-button px-2 py-1 font-pixel text-[8px]"
            >
              EQ
            </button>
          </div>
        </div>
      </aside>
    </div>
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
      className="skin-button inline-flex h-8 min-w-9 items-center justify-center px-2 font-pixel text-xs"
    >
      {children}
    </button>
  );
}
