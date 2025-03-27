"use client";

import { JSX, useEffect, useRef, useState } from "react";

const CHARACTERS = ["*", "+", "#", "@", "~", "%"];
const NUM_SPARKLES = 50;

export default function AsciiSparkles() {
  const [sparkles, setSparkles] = useState<JSX.Element[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const positions = useRef<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const layers = document.querySelectorAll(".sparkle-layer");
      layers.forEach((layer, index) => {
        const depth = (index + 1) * 5;
        (layer as HTMLElement).style.transform = `translateY(${scrollY / depth}px)`;
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      const bounds = containerRef.current?.getBoundingClientRect();
      if (!bounds) return;

      const cx = e.clientX - bounds.left;
      const cy = e.clientY - bounds.top;

      const layers = containerRef.current?.querySelectorAll(".sparkle-layer");
      layers?.forEach((layer, i) => {
        const el = layer as HTMLElement;
        const rect = el.getBoundingClientRect();
        const lx = rect.left + rect.width / 2;
        const ly = rect.top + rect.height / 2;
        const dist = Math.sqrt((lx - e.clientX) ** 2 + (ly - e.clientY) ** 2);
        const maxDist = 150;
        const glow = Math.max(0, 1 - dist / maxDist);
        el.style.textShadow = `0 0 ${glow * 60}px white`;
        el.style.opacity = `${0.5 + glow * 0.5}`;
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);

    const elements = [...Array(NUM_SPARKLES)].map((_, i) => {
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const duration = 2 + Math.random() * 3;
      const delay = Math.random() * 5;
      const char = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];

      return (
        <div
          key={i}
          className="absolute text-white text-2xl select-none sparkle-layer"
          style={{
            left,
            top,
            animation: `float ${duration}s linear infinite`,
            animationDelay: `${delay}s`,
            textShadow: "0 0 30px white",
            opacity: 0.7,
          }}
        >
          {char}
        </div>
      );
    });

    setSparkles(elements);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute top-0 left-0 w-full h-full pointer-events-none">
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100px); opacity: 0; }
        }
      `}</style>
      {sparkles}
    </div>
  );
}