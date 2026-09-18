"use client";

import { useEffect, useRef } from "react";

// Decorative only. A stylized OAuth handshake: two endpoints exchanging
// tokens along arcs. Purely an easter egg for anyone who finds this URL —
// it carries no information, sits above the disclosure text, and never
// overlaps it. Respects prefers-reduced-motion (renders one static frame).

const TOKEN_COUNT = 16;
const ACCENT = "#00fff9";

type Token = {
  t: number;
  dir: 1 | -1;
  speed: number;
  lift: number;
  size: number;
};

export default function OAuthHandshake() {
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

    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const tokens: Token[] = Array.from({ length: TOKEN_COUNT }, (_, i) => ({
      t: i / TOKEN_COUNT,
      dir: i % 2 === 0 ? 1 : -1,
      speed: 0.0022 + (i % 5) * 0.0006,
      lift: 0.35 + (i % 4) * 0.22,
      size: 1.6 + (i % 3) * 0.7,
    }));

    const bezier = (
      t: number,
      x0: number,
      y0: number,
      cx: number,
      cy: number,
      x1: number,
      y1: number,
    ) => {
      const u = 1 - t;
      return {
        x: u * u * x0 + 2 * u * t * cx + t * t * x1,
        y: u * u * y0 + 2 * u * t * cy + t * t * y1,
      };
    };

    const drawNode = (x: number, y: number, phase: number) => {
      // Outer pulsing ring
      const pulse = 10 + Math.sin(phase) * 2.5;
      ctx.beginPath();
      ctx.arc(x, y, pulse + 8, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,249,0.18)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,255,249,0.45)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Core
      ctx.beginPath();
      ctx.arc(x, y, 3.4, 0, Math.PI * 2);
      ctx.fillStyle = ACCENT;
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    let raf = 0;
    let frame = 0;

    const draw = () => {
      frame += 1;
      ctx.clearRect(0, 0, w, h);

      // Faint scanline grid for terminal texture
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 6) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }

      const x0 = w * 0.16;
      const x1 = w * 0.84;
      const midY = h * 0.5;

      // Arcs
      tokens.forEach((tok, i) => {
        if (i % 4 !== 0) return;
        const cy = midY - h * 0.3 * tok.lift * tok.dir;
        ctx.beginPath();
        ctx.moveTo(x0, midY);
        ctx.quadraticCurveTo(w * 0.5, cy, x1, midY);
        ctx.strokeStyle = "rgba(0,255,249,0.12)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Travelling tokens
      tokens.forEach((tok) => {
        if (!reduce) tok.t += tok.speed;
        if (tok.t > 1) tok.t -= 1;

        const cy = midY - h * 0.3 * tok.lift * tok.dir;
        // Odd-direction tokens travel right-to-left.
        const p =
          tok.dir === 1
            ? bezier(tok.t, x0, midY, w * 0.5, cy, x1, midY)
            : bezier(1 - tok.t, x0, midY, w * 0.5, cy, x1, midY);

        // Fade in/out at the endpoints so tokens appear to be absorbed.
        const edge = Math.min(tok.t, 1 - tok.t);
        const alpha = Math.min(1, edge * 6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, tok.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,255,249,${0.85 * alpha})`;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 8 * alpha;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      drawNode(x0, midY, frame * 0.04);
      drawNode(x1, midY, frame * 0.04 + Math.PI);

      if (!reduce) raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block w-full h-32 sm:h-40 rounded border border-white/15"
    />
  );
}
