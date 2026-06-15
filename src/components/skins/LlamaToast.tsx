"use client";

import { useEffect, useState } from "react";

export default function LlamaToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onSkinChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "llama") {
        setVisible(true);
        const t = setTimeout(() => setVisible(false), 4500);
        return () => clearTimeout(t);
      }
    };
    window.addEventListener("pc-skin-change", onSkinChange);
    return () => window.removeEventListener("pc-skin-change", onSkinChange);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 z-40 max-w-xs skin-surface p-4"
      style={{ background: "var(--surface)" }}
    >
      <p
        className="font-pixel text-sm leading-snug"
        style={{ color: "var(--accent)" }}
      >
        🦙 It really whips the llama&apos;s ass.
      </p>
      <p
        className="mt-2 font-terminal text-xs"
        style={{ color: "var(--muted)" }}
      >
        Welcome to llama mode.
      </p>
    </div>
  );
}
