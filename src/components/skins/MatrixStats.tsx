"use client";

import { useEffect, useMemo, useState } from "react";
import portfolio from "@/data/portfolio.json";

// Real portfolio metrics, presented as a hacker "system monitor".
function useMetrics() {
  return useMemo(() => {
    const projects = portfolio.projects ?? [];
    const years = projects
      .map((p) => Number((p as { startDate?: string }).startDate))
      .filter((n) => !Number.isNaN(n));
    const minYear = years.length ? Math.min(...years) : 2016;
    const techs = new Set<string>();
    projects.forEach((p) =>
      (p as { technologies?: { name: string }[] }).technologies?.forEach((t) =>
        techs.add(t.name),
      ),
    );
    const span = new Date().getFullYear() - minYear;
    return {
      projects: projects.length,
      years: span,
      stacks: techs.size,
      pubs: portfolio.resume?.publications?.length ?? 0,
    };
  }, []);
}

export default function MatrixStats() {
  const m = useMetrics();
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;
    const id = setInterval(() => setUptime((u) => u + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const rows = [
    { label: "PROJECTS", value: m.projects, max: 20 },
    { label: "YRS.ACTIVE", value: m.years, max: 12 },
    { label: "STACKS", value: m.stacks, max: 20 },
    { label: "PUBS", value: m.pubs, max: 4 },
  ];

  const hh = String(Math.floor((uptime / 60) % 24)).padStart(2, "0");
  const mm = String(Math.floor(uptime % 60)).padStart(2, "0");

  return (
    <aside
      aria-label="Portfolio metrics"
      className="fixed bottom-3 right-3 z-40 w-[190px] sm:w-[220px] skin-surface p-3 select-none"
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      <div
        className="mb-2 flex items-center justify-between text-[10px]"
        style={{ color: "var(--accent)" }}
      >
        <span>▮ SYS.MONITOR</span>
        <span>
          {hh}:{mm}
        </span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2 text-[11px]">
            <span style={{ color: "var(--muted)", width: 62 }}>{r.label}</span>
            <div
              className="flex-1 h-2.5"
              style={{
                background: "rgba(0,255,65,0.08)",
                border: "1px solid rgba(0,255,65,0.3)",
              }}
            >
              <div
                className="h-full"
                style={{
                  width: `${Math.min(100, (r.value / r.max) * 100)}%`,
                  background:
                    "linear-gradient(90deg, rgba(0,255,65,0.85), rgba(0,255,170,0.85))",
                  boxShadow: "0 0 6px rgba(0,255,65,0.6)",
                }}
              />
            </div>
            <span
              style={{ color: "var(--accent)", width: 22, textAlign: "right" }}
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[10px]" style={{ color: "var(--subtle)" }}>
        {"> phil@medialab:~$ _"}
      </div>
    </aside>
  );
}
