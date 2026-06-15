"use client";

const COLS = 8;

// Tiny pixel-art "PC" sprite as a grid of intensities (0-3).
const SPRITE: number[][] = [
  [0, 3, 3, 0, 0, 3, 3, 3],
  [0, 3, 0, 3, 0, 3, 0, 0],
  [0, 3, 0, 3, 0, 3, 0, 0],
  [0, 3, 3, 0, 0, 3, 0, 0],
  [0, 3, 0, 0, 0, 3, 0, 0],
  [0, 3, 0, 0, 0, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 2, 0, 1, 0, 2, 0],
];

const SHADES = ["transparent", "#8bac0f", "#306230", "#0f380f"];

export default function GameboyDpad() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full skin-surface overflow-hidden flex items-center justify-center"
      style={{
        aspectRatio: "1 / 1",
        background: "#9bbc0f",
        padding: 12,
      }}
    >
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gap: 2,
          width: "78%",
          aspectRatio: "1 / 1",
        }}
      >
        {SPRITE.flatMap((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              style={{
                background: SHADES[cell],
                width: "100%",
                aspectRatio: "1 / 1",
              }}
            />
          )),
        )}
      </div>
      <div
        className="absolute bottom-2 left-2 right-2 flex items-center justify-between"
        style={{
          fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
          color: "#0f380f",
          fontSize: 8,
        }}
      >
        <span>L:01</span>
        <span>SCORE: 9999</span>
      </div>
    </div>
  );
}
