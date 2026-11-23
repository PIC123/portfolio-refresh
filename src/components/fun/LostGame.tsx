"use client";

import { useEffect, useRef, useState } from "react";
import { unlockEgg } from "@/lib/eggs";

const GOAL = 10;

type Capsule = { x: number; y: number; vy: number; good: boolean };

/**
 * 404 mini-game, borrowed from the INTER installation: catch the green
 * capsules, dodge the red ones. Mouse or touch moves the catcher.
 */
export default function LostGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let catcherX = w / 2;
    const capsules: Capsule[] = [];
    let frame = 0;
    let raf = 0;

    const onMove = (clientX: number) => {
      const r = canvas.getBoundingClientRect();
      catcherX = Math.max(24, Math.min(w - 24, clientX - r.left));
    };
    const onMouse = (e: MouseEvent) => onMove(e.clientX);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX);
    };
    canvas.addEventListener("mousemove", onMouse);
    canvas.addEventListener("touchmove", onTouch, { passive: true });

    const bump = (delta: number) => {
      scoreRef.current = Math.max(0, scoreRef.current + delta);
      setScore(scoreRef.current);
      if (scoreRef.current >= GOAL) unlockEgg("lost");
    };

    const tick = () => {
      frame += 1;
      if (frame % 32 === 0) {
        capsules.push({
          x: 16 + Math.random() * (w - 32),
          y: -10,
          vy: 1.4 + Math.random() * 1.6,
          good: Math.random() > 0.3,
        });
      }

      ctx.clearRect(0, 0, w, h);
      const catcherY = h - 18;

      for (let i = capsules.length - 1; i >= 0; i--) {
        const c = capsules[i];
        c.y += c.vy;
        const caught =
          Math.abs(c.x - catcherX) < 28 && Math.abs(c.y - catcherY) < 12;
        if (caught) {
          bump(c.good ? 1 : -2);
          capsules.splice(i, 1);
          continue;
        }
        if (c.y > h + 12) {
          capsules.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(c.x, c.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = c.good ? "#14ff5a" : "#ff3b5c";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      ctx.fillStyle = "#00fff9";
      ctx.fillRect(catcherX - 24, catcherY, 48, 6);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("mousemove", onMouse);
      canvas.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between font-pixel text-[10px]">
        <span className="text-white/60">
          catch <span style={{ color: "#14ff5a" }}>green</span>, dodge{" "}
          <span style={{ color: "#ff3b5c" }}>red</span>
        </span>
        <span className="text-accent" aria-live="polite">
          {score >= GOAL ? "OXYGEN RESTORED" : `SCORE ${score}/${GOAL}`}
        </span>
      </div>
      <canvas
        ref={canvasRef}
        aria-label="Mini-game: move to catch falling capsules"
        className="block h-56 w-full touch-none border border-white/25 bg-black"
      />
    </div>
  );
}
