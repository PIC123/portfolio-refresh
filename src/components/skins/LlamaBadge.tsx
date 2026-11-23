"use client";

export default function LlamaBadge() {
  return (
    <aside
      aria-label="It really whips the llama's ass"
      className="fixed bottom-4 right-4 z-40 skin-surface select-none"
      style={{
        background: "var(--surface)",
        padding: "8px 14px",
        transform: "rotate(-3deg)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
      }}
    >
      <div
        className="text-[11px] uppercase tracking-wider"
        style={{
          color: "var(--accent)",
          fontFamily: "var(--font-script), 'Pacifico', cursive",
          fontSize: 20,
          letterSpacing: 0,
          textTransform: "none",
        }}
      >
        whips the llama&apos;s ass
      </div>
      <div
        className="text-[10px] mt-0.5"
        style={{ color: "var(--muted)" }}
      >
        🦙 winamp · 1997
      </div>
    </aside>
  );
}
