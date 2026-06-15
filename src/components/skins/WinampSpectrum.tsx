"use client";

import { useEffect, useRef } from "react";

const BARS = 24;

export default function WinampSpectrum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;
    let last = 0;
    const tickMs = reduce ? 600 : 90;
    const heights = new Array(BARS).fill(0).map(() => Math.random());
    const peaks = new Array(BARS).fill(0);

    const draw = (t: number) => {
      if (t - last >= tickMs) {
        last = t;
        for (let i = 0; i < BARS; i++) {
          heights[i] = Math.max(
            0,
            Math.min(1, heights[i] + (Math.random() - 0.5) * 0.7),
          );
          if (heights[i] > peaks[i]) peaks[i] = heights[i];
          peaks[i] = Math.max(0, peaks[i] - 0.02);
        }
      }

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, w, h);
      const barW = (w - (BARS + 1) * 2) / BARS;
      for (let i = 0; i < BARS; i++) {
        const x = 2 + i * (barW + 2);
        const segs = Math.floor(heights[i] * 16);
        const segH = (h - 4) / 16;
        for (let s = 0; s < segs; s++) {
          const y = h - 2 - (s + 1) * segH;
          const hue = s < 9 ? "#14ff5a" : s < 13 ? "#d9ff80" : "#ff5a5a";
          ctx.fillStyle = hue;
          ctx.fillRect(x, y, barW, segH - 1);
        }
        const pSeg = Math.floor(peaks[i] * 16);
        const py = h - 2 - (pSeg + 1) * segH;
        ctx.fillStyle = "#d8d8d8";
        ctx.fillRect(x, py, barW, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative w-full skin-surface overflow-hidden"
      style={{ aspectRatio: "16 / 11", padding: 4 }}
    >
      <div
        className="absolute top-1 left-2 z-10 text-[11px]"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-lcd), monospace",
          textShadow: "0 0 6px var(--accent)",
        }}
      >
        ► PLAYING · 44.1kHz · STEREO
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
