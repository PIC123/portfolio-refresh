"use client";

import { useState } from "react";
import AnalyserBars from "./audio/AnalyserBars";
import { useAudio, formatTime } from "./audio/AudioProvider";
import WinampEqualizer from "./WinampEqualizer";
import WinampPlaylist from "./WinampPlaylist";

// Mobile-only Winamp. A compact dock pinned to the bottom that expands into a
// full sheet with the playlist + graphic EQ. Shown on < sm screens.
export default function WinampDock() {
  const { state, tracks, toggle, next, prev, setVolume } = useAudio();
  const [expanded, setExpanded] = useState(false);
  const track = tracks[state.trackIndex];
  const pct = state.duration ? (state.elapsed / state.duration) * 100 : 0;

  return (
    <div className="sm:hidden">
      {expanded && (
        <div
          className="fixed inset-0 z-[58] flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setExpanded(false)}
        >
          <div
            className="max-h-[80vh] overflow-y-auto p-3 space-y-3"
            style={{ background: "var(--nav-bg)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span
                className="font-pixel text-xs"
                style={{ color: "var(--accent)" }}
              >
                ♫ WINAMP
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close player"
                className="skin-button px-3 py-1 font-pixel text-xs"
              >
                ▼ Close
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span
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
                className="flex-1"
                style={{ accentColor: "var(--accent)" }}
              />
            </div>

            <WinampPlaylist compact />
            <WinampEqualizer />
          </div>
        </div>
      )}

      <div
        className="fixed bottom-0 inset-x-0 z-[59] skin-nav"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous track"
            className="skin-button inline-flex h-9 w-9 items-center justify-center font-pixel text-xs"
          >
            ◄◄
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={state.playing ? "Pause" : "Play"}
            className="skin-button-primary inline-flex h-9 w-9 items-center justify-center font-pixel text-sm"
          >
            {state.playing ? "❚❚" : "►"}
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next track"
            className="skin-button inline-flex h-9 w-9 items-center justify-center font-pixel text-xs"
          >
            ►►
          </button>

          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="flex min-w-0 flex-1 items-center gap-2"
            aria-label="Open full player"
          >
            <AnalyserBars
              bars={10}
              peakMarkers={false}
              className="h-9 w-14 shrink-0"
            />
            <span className="min-w-0 flex-1 overflow-hidden text-left">
              <span
                className="block truncate font-pixel text-[10px]"
                style={{ color: "var(--accent)" }}
              >
                {track.title}
              </span>
              <span
                className="block text-[10px]"
                style={{
                  color: "var(--muted)",
                  fontFamily: "var(--font-lcd), monospace",
                }}
              >
                {formatTime(state.elapsed)} / {formatTime(state.duration)}
              </span>
            </span>
            <span
              aria-hidden="true"
              className="font-pixel text-[10px]"
              style={{ color: "var(--muted)" }}
            >
              ▲
            </span>
          </button>
        </div>
        <div
          className="h-1 w-full"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div
            className="h-full"
            style={{ width: `${pct}%`, background: "var(--accent)" }}
          />
        </div>
      </div>
    </div>
  );
}
