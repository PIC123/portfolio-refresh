"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝ0123456789ABCDEF";

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fontSize = 16;
    let columns: number[] = [];
    let columnCount = 0;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      columnCount = Math.ceil(window.innerWidth / fontSize);
      columns = new Array(columnCount)
        .fill(0)
        .map(() => Math.random() * -50);
    };
    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    let last = 0;
    const tickMs = reduceMotion ? 500 : 60;

    const draw = (t: number) => {
      if (t - last >= tickMs) {
        last = t;
        ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = "#00ff41";
        ctx.font = `${fontSize}px "Share Tech Mono", monospace`;
        for (let i = 0; i < columnCount; i++) {
          const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
          const x = i * fontSize;
          const y = columns[i] * fontSize;
          ctx.fillText(ch, x, y);
          if (y > window.innerHeight && Math.random() > 0.975) {
            columns[i] = 0;
          } else {
            columns[i]++;
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="skin-bg-canvas"
      style={{ opacity: 0.55 }}
    />
  );
}
