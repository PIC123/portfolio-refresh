"use client";

import { useEffect, useMemo, useRef } from "react";

const CHARACTERS = ["*", "+", "#", "@", "~", "%"] as const;
const NUM_SPARKLES = 40;
const GLOW_RADIUS = 150;

// Deterministic pseudo-random so server and client render identically.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Sparkle = {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
  char: string;
};

export default function AsciiSparkles() {
  const containerRef = useRef<HTMLDivElement>(null);

  const sparkles = useMemo<Sparkle[]>(() => {
    const rand = mulberry32(42);
    return Array.from({ length: NUM_SPARKLES }, (_, id) => ({
      id,
      left: rand() * 100,
      top: rand() * 100,
      duration: 2 + rand() * 3,
      delay: rand() * 5,
      char: CHARACTERS[Math.floor(rand() * CHARACTERS.length)],
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const container = containerRef.current;
    if (!container) return;

    let rafId = 0;
    let pendingMouse: { x: number; y: number } | null = null;
    let pendingScroll = false;

    const layers = Array.from(
      container.querySelectorAll<HTMLElement>(".sparkle-layer"),
    );

    const apply = () => {
      rafId = 0;
      if (pendingScroll) {
        const scrollY = window.scrollY;
        layers.forEach((layer, index) => {
          const depth = (index + 1) * 5;
          layer.style.setProperty("--scroll-y", `${scrollY / depth}px`);
        });
        pendingScroll = false;
      }
      if (pendingMouse) {
        const { x, y } = pendingMouse;
        layers.forEach((layer) => {
          const rect = layer.getBoundingClientRect();
          const lx = rect.left + rect.width / 2;
          const ly = rect.top + rect.height / 2;
          const dist = Math.hypot(lx - x, ly - y);
          const glow = Math.max(0, 1 - dist / GLOW_RADIUS);
          layer.style.textShadow = `0 0 ${glow * 60}px white`;
          layer.style.opacity = `${0.5 + glow * 0.5}`;
        });
        pendingMouse = null;
      }
    };

    const schedule = () => {
      if (rafId === 0) rafId = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      pendingScroll = true;
      schedule();
    };
    const onMouseMove = (e: MouseEvent) => {
      pendingMouse = { x: e.clientX, y: e.clientY };
      schedule();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          className="sparkle-layer absolute select-none text-2xl text-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            opacity: 0.7,
            textShadow: "0 0 30px white",
            animation: `sparkle-float ${s.duration}s linear ${s.delay}s infinite`,
            transform: "translateY(var(--scroll-y, 0))",
          }}
        >
          {s.char}
        </span>
      ))}
    </div>
  );
}
