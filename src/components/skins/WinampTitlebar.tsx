"use client";

export default function WinampTitlebar() {
  return (
    <div
      aria-hidden="true"
      className="fixed top-0 inset-x-0 z-[55] select-none"
      style={{
        background:
          "linear-gradient(180deg, #4a4a4a 0%, #2a2a2a 100%)",
        borderBottom: "1px solid #111",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.18), 0 1px 2px rgba(0,0,0,0.6)",
        fontFamily: "var(--font-lcd), 'VT323', monospace",
      }}
    >
      <div className="flex items-center justify-between px-3 py-1">
        <div className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, #d9ff80, #14ff5a 60%, #00220c)",
              borderRadius: "50%",
              boxShadow: "0 0 6px #14ff5a",
            }}
          />
          <span
            className="text-[13px] tracking-wider"
            style={{ color: "#14ff5a", textShadow: "0 0 4px #14ff5a" }}
          >
            PHIL CHERNER v1.0 — CREATIVE.TECH
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: "_", title: "Minimize" },
            { label: "▢", title: "Maximize" },
            { label: "×", title: "Close" },
          ].map(({ label, title }) => (
            <span
              key={title}
              title={title}
              className="inline-flex h-4 w-5 items-center justify-center text-[10px] leading-none"
              style={{
                background:
                  "linear-gradient(180deg, #6a6a6a 0%, #3a3a3a 100%)",
                color: "#d8d8d8",
                border: "1px solid #111",
                boxShadow:
                  "inset 1px 1px 0 rgba(255,255,255,0.2), inset -1px -1px 0 rgba(0,0,0,0.5)",
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
