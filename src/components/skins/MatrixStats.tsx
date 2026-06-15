"use client";

import { useEffect, useState } from "react";

type Stat = { label: string; value: number };

export default function MatrixStats() {
  const [stats, setStats] = useState<Stat[]>([
    { label: "CPU", value: 0.34 },
    { label: "MEM", value: 0.62 },
    { label: "NET", value: 0.18 },
    { label: "DSK", value: 0.71 },
  ]);
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const id = setInterval(() => {
      setStats((s) =>
        s.map((stat) => ({
          ...stat,
          value: Math.max(
            0.05,
            Math.min(0.98, stat.value + (Math.random() - 0.5) * 0.3),
          ),
        })),
      );
      setUptime((u) => u + 1);
    }, 900);
    return () => clearInterval(id);
  }, []);

  const u = uptime;
  const days = Math.floor(u / (60 * 60 * 24)) + 412;
  const hours = String(Math.floor((u / 60) % 24)).padStart(2, "0");
  const mins = String(Math.floor(u % 60)).padStart(2, "0");

  return (
    <aside
      aria-label="System stats (decorative)"
      className="fixed bottom-4 right-4 z-40 w-[220px] skin-surface p-3 select-none"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="mb-2 flex items-center justify-between text-[10px]"
        style={{ color: "var(--accent)" }}
      >
        <span>▮ SYS.MONITOR</span>
        <span>up {days}d {hours}:{mins}</span>
      </div>
      <div className="space-y-1.5">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[11px]">
            <span style={{ color: "var(--muted)", width: 28 }}>{s.label}</span>
            <div
              className="flex-1 h-2.5"
              style={{
                background: "rgba(0,255,65,0.08)",
                border: "1px solid rgba(0,255,65,0.3)",
              }}
            >
              <div
                className="h-full transition-[width] duration-500"
                style={{
                  width: `${s.value * 100}%`,
                  background:
                    "linear-gradient(90deg, rgba(0,255,65,0.85), rgba(0,255,170,0.85))",
                  boxShadow: "0 0 6px rgba(0,255,65,0.6)",
                }}
              />
            </div>
            <span
              style={{ color: "var(--accent)", width: 32, textAlign: "right" }}
            >
              {(s.value * 100).toFixed(0)}%
            </span>
          </div>
        ))}
      </div>
      <div
        className="mt-2 text-[10px]"
        style={{ color: "var(--subtle)" }}
      >
        {"> awaiting input_"}
      </div>
    </aside>
  );
}
