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

/**
 * Each sparkle is two nested elements on purpose:
 *
 *   wrapper  — scroll parallax + pointer glow (plain inline styles)
 *   glyph    — the looping float animation
 *
 * They have to be separate. A running CSS animation sits in a higher cascade
 * origin than inline styles, so when the float animation drove `transform`
 * and `opacity` on the same node, the parallax and glow written from JS were
 * silently discarded once the animation started. Splitting them lets the two
 * transforms compose (and opacity multiply) instead of fighting.
 */
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
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The hero column is `hidden` below lg, so there is nothing to animate.
    const desktop = window.matchMedia("(min-width: 1024px)");
    if (!desktop.matches) return;

    const wrappers = Array.from(
      container.querySelectorAll<HTMLElement>("[data-sparkle]"),
    );
    if (wrappers.length === 0) return;

    let rafId = 0;
    let onScreen = true;
    let bounds: DOMRect | null = null;
    let pendingMouse: { x: number; y: number } | null = null;
    let pendingScroll = false;

    // One rect read for the whole field instead of one per sparkle. Sparkle
    // centres are derived from their percentage offsets, so 40 forced layouts
    // per frame become a single cached measurement.
    const measure = () => {
      bounds = container.getBoundingClientRect();
    };
    measure();

    const apply = () => {
      rafId = 0;
      if (!onScreen) return;
      if (!bounds) measure();
      if (!bounds) return;

      if (pendingScroll) {
        const scrollY = window.scrollY;
        wrappers.forEach((w, i) => {
          const depth = ((i % 5) + 1) * 6;
          w.style.setProperty("--parallax-y", `${scrollY / depth}px`);
        });
        pendingScroll = false;
      }

      if (pendingMouse) {
        const { x, y } = pendingMouse;
        for (let i = 0; i < wrappers.length; i++) {
          const s = sparkles[i];
          const cx = bounds.left + (s.left / 100) * bounds.width;
          const cy = bounds.top + (s.top / 100) * bounds.height;
          const glow = Math.max(0, 1 - Math.hypot(cx - x, cy - y) / GLOW_RADIUS);
          const w = wrappers[i];
          w.style.setProperty("--glow-blur", `${glow * 60}px`);
          w.style.setProperty("--glow-opacity", `${0.5 + glow * 0.5}`);
        }
        pendingMouse = null;
      }
    };

    const schedule = () => {
      if (rafId === 0) rafId = requestAnimationFrame(apply);
    };

    const onScroll = () => {
      bounds = null; // position changed; re-measure next frame
      pendingScroll = true;
      schedule();
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!onScreen) return;
      pendingMouse = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onResize = () => {
      bounds = null;
      schedule();
    };

    // Stop doing any work while the hero is scrolled out of view.
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        ([entry]) => {
          onScreen = entry.isIntersecting;
        },
        { rootMargin: "100px" },
      );
      io.observe(container);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      io?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [sparkles]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          data-sparkle
          className="absolute select-none"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            opacity: "var(--glow-opacity, 0.7)",
            textShadow: "0 0 var(--glow-blur, 30px) white",
            transform: "translateY(var(--parallax-y, 0px))",
            willChange: "transform",
          }}
        >
          <span
            className="block text-2xl text-white"
            style={{
              animation: `sparkle-float ${s.duration}s linear ${s.delay}s infinite`,
            }}
          >
            {s.char}
          </span>
        </span>
      ))}
    </div>
  );
}
