"use client";

import { useEffect, useRef, useState } from "react";

const LINES = [
  { prompt: "$", cmd: "whoami", out: ["phil_cherner"] },
  { prompt: "$", cmd: "pwd", out: ["/home/phil/portfolio"] },
  {
    prompt: "$",
    cmd: "ls -la projects/",
    out: [
      "drwxr-xr-x  inter_museum.exe       2025-01-12",
      "drwxr-xr-x  jordan_rudess_ai.exe   2024-11-03",
      "drwxr-xr-x  earth_mission.app      2024-05-21",
      "drwxr-xr-x  natural_harmony.bin    2024-03-17",
    ],
  },
  { prompt: "$", cmd: "echo $STATUS", out: ["OPEN_TO_WORK=true"] },
  { prompt: "$", cmd: "_", out: [] },
];

type Token = { text: string; type: "prompt" | "cmd" | "out" };

export default function MatrixTerminal() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const idxRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef<"cmd" | "out" | "pause">("cmd");

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const tick = reduce ? 0 : 38;

    if (reduce) {
      const all: Token[] = [];
      for (const line of LINES) {
        all.push({ text: `${line.prompt} `, type: "prompt" });
        all.push({ text: `${line.cmd}\n`, type: "cmd" });
        for (const o of line.out) all.push({ text: `${o}\n`, type: "out" });
      }
      setTokens(all);
      return;
    }

    let cancelled = false;
    const step = () => {
      if (cancelled) return;
      const lineIdx = idxRef.current;
      if (lineIdx >= LINES.length) return;
      const line = LINES[lineIdx];
      if (phaseRef.current === "cmd") {
        const c = charRef.current;
        if (c === 0) {
          setTokens((t) => [...t, { text: `${line.prompt} `, type: "prompt" }]);
        }
        if (c < line.cmd.length) {
          const ch = line.cmd[c];
          setTokens((t) => {
            const last = t[t.length - 1];
            if (last?.type === "cmd") {
              return [...t.slice(0, -1), { text: last.text + ch, type: "cmd" }];
            }
            return [...t, { text: ch, type: "cmd" }];
          });
          charRef.current = c + 1;
          setTimeout(step, tick);
        } else {
          setTokens((t) => [...t, { text: "\n", type: "cmd" }]);
          phaseRef.current = "out";
          charRef.current = 0;
          setTimeout(step, 240);
        }
      } else if (phaseRef.current === "out") {
        if (line.out.length === 0) {
          phaseRef.current = "cmd";
          charRef.current = 0;
          idxRef.current += 1;
          setTimeout(step, 320);
          return;
        }
        const outLine = line.out.join("\n");
        setTokens((t) => [...t, { text: outLine + "\n", type: "out" }]);
        phaseRef.current = "cmd";
        charRef.current = 0;
        idxRef.current += 1;
        setTimeout(step, 460);
      }
    };

    const startId = setTimeout(step, 400);
    return () => {
      cancelled = true;
      clearTimeout(startId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full skin-surface overflow-hidden"
      style={{
        background: "rgba(0,0,0,0.6)",
        padding: "10px 12px",
        minHeight: "260px",
        fontFamily: "var(--font-terminal), 'Share Tech Mono', monospace",
      }}
    >
      <div
        className="absolute top-1 right-2 text-[10px]"
        style={{ color: "rgba(0,255,65,0.6)" }}
      >
        tty1 — 80x24
      </div>
      <pre
        className="whitespace-pre-wrap text-[12px] leading-[1.45]"
        style={{
          color: "#00ff41",
          textShadow: "0 0 6px rgba(0,255,65,0.55)",
        }}
      >
        {tokens.map((t, i) => (
          <span
            key={i}
            style={{
              color:
                t.type === "prompt"
                  ? "#7fff7f"
                  : t.type === "out"
                  ? "rgba(0,255,65,0.75)"
                  : "#00ff41",
            }}
          >
            {t.text}
          </span>
        ))}
        <span style={{ animation: "blink 0.9s step-end infinite" }}>▌</span>
      </pre>
    </div>
  );
}
