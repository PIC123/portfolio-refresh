"use client";

import { useEffect, useRef } from "react";
import { useAudio } from "./AudioProvider";

type Props = {
  bars?: number;
  className?: string;
  peakMarkers?: boolean;
  idleAnimate?: boolean;
};

// Draws REAL frequency data from the engine's AnalyserNode. When nothing is
// playing it shows a gentle idle shimmer so the widget never looks dead.
export default function AnalyserBars({
  bars = 24,
  className,
  peakMarkers = true,
  idleAnimate = true,
}: Props) {
  const { getAnalyserData, state } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playingRef = useRef(state.playing);
  playingRef.current = state.playing;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, r.width) * dpr;
      canvas.height = Math.max(1, r.height) * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const freq = new Uint8Array(64);
    const peaks = new Array(bars).fill(0);
    let raf = 0;
    let phase = 0;

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, w, h);

      const hasData = getAnalyserData(freq);
      const gap = 2 * dpr;
      const barW = (w - (bars + 1) * gap) / bars;
      phase += 0.05;

      for (let i = 0; i < bars; i++) {
        let level: number;
        if (hasData && playingRef.current) {
          const idx = Math.floor((i / bars) * (freq.length * 0.7));
          level = freq[idx] / 255;
        } else if (idleAnimate) {
          level = 0.08 + 0.06 * (Math.sin(phase + i * 0.5) * 0.5 + 0.5);
        } else {
          level = 0.05;
        }

        const x = gap + i * (barW + gap);
        const segs = 16;
        const segH = (h - 4 * dpr) / segs;
        const lit = Math.floor(level * segs);
        for (let s = 0; s < lit; s++) {
          const y = h - 2 * dpr - (s + 1) * segH;
          ctx.fillStyle =
            s < 9 ? "#14ff5a" : s < 13 ? "#d9ff80" : "#ff5a5a";
          ctx.fillRect(x, y, barW, segH - dpr);
        }
        if (peakMarkers) {
          if (level > peaks[i]) peaks[i] = level;
          else peaks[i] = Math.max(0, peaks[i] - 0.015);
          const py = h - 2 * dpr - (Math.floor(peaks[i] * segs) + 1) * segH;
          ctx.fillStyle = "#e8ffe8";
          ctx.fillRect(x, py, barW, dpr);
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [bars, getAnalyserData, peakMarkers, idleAnimate]);

  return <canvas ref={canvasRef} className={className} />;
}
