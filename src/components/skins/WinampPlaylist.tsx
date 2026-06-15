"use client";

import { useAudio, formatTime } from "./audio/AudioProvider";

// The playlist doubles as a portfolio index: each "track" is named after one
// of Phil's projects. Clicking plays it; the names map to the gallery below.
export default function WinampPlaylist({
  compact = false,
}: {
  compact?: boolean;
}) {
  const { tracks, state, selectTrack, play } = useAudio();

  return (
    <aside
      aria-label="Playlist"
      className={`${
        compact ? "w-full" : "fixed bottom-4 left-4 z-40 hidden sm:block w-[300px]"
      } skin-surface p-3 select-none`}
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
          ● PLAYLIST · {tracks.length} TRACKS
        </span>
        <span
          className="text-[10px]"
          style={{ color: "var(--muted)", fontFamily: "var(--font-lcd), monospace" }}
        >
          PHIL.CHERNER
        </span>
      </div>

      <ol className="space-y-0.5">
        {tracks.map((t, i) => {
          const active = i === state.trackIndex;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  selectTrack(i);
                  play();
                }}
                className="flex w-full items-center gap-2 px-2 py-1 text-left text-[12px]"
                style={{
                  fontFamily: "var(--font-lcd), monospace",
                  background: active
                    ? "color-mix(in oklab, var(--accent) 22%, transparent)"
                    : "transparent",
                  color: active ? "var(--accent)" : "var(--muted)",
                }}
              >
                <span style={{ width: 16, textAlign: "right" }}>
                  {active && state.playing ? "►" : `${i + 1}.`}
                </span>
                <span className="flex-1 truncate">{t.title}</span>
                <span style={{ opacity: 0.7 }}>
                  {t.kind === "synth"
                    ? formatTime(t.lengthSec)
                    : formatTime(t.lengthSec ?? 0)}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      <p
        className="mt-2 px-2 text-[9px]"
        style={{ color: "var(--subtle)", fontFamily: "var(--font-lcd), monospace" }}
      >
        ♫ procedurally synthesized · named for real projects
      </p>
    </aside>
  );
}
