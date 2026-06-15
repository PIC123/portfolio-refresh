"use client";

import AnalyserBars from "./audio/AnalyserBars";
import { useAudio, formatTime } from "./audio/AudioProvider";

export default function WinampSpectrum() {
  const { state, tracks, toggle } = useAudio();
  const track = tracks[state.trackIndex];

  return (
    <div
      className="relative w-full skin-surface overflow-hidden"
      style={{ aspectRatio: "16 / 11", padding: 6 }}
    >
      <div
        className="flex items-center justify-between px-1 pb-1 text-[11px]"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-lcd), monospace",
          textShadow: "0 0 6px var(--accent)",
        }}
      >
        <span>{state.playing ? "► PLAYING" : "❚❚ PAUSED"}</span>
        <span>44.1kHz · STEREO</span>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={state.playing ? "Pause" : "Play"}
        className="relative block w-full"
        style={{ height: "calc(100% - 42px)" }}
      >
        <AnalyserBars bars={20} className="w-full h-full block" />
      </button>

      <div
        className="mt-1 flex items-center justify-between px-1 text-[11px]"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-lcd), monospace",
        }}
      >
        <span className="truncate pr-2">{track.title}</span>
        <span>
          {formatTime(state.elapsed)} / {formatTime(state.duration)}
        </span>
      </div>
    </div>
  );
}
