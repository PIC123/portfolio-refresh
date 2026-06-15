"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "pc-gb-started";

export default function GameboyPressStart() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const dismiss = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        hide();
      }
    };
    const onSkinChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail === "gameboy") {
        setVisible(true);
      }
    };
    document.addEventListener("keydown", dismiss);
    window.addEventListener("pc-skin-change", onSkinChange);
    return () => {
      document.removeEventListener("keydown", dismiss);
      window.removeEventListener("pc-skin-change", onSkinChange);
    };
  }, []);

  const hide = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Non-fatal.
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Press start"
      className="fixed inset-0 z-[80] flex items-center justify-center cursor-pointer"
      onClick={hide}
      style={{ background: "#8bac0f" }}
    >
      <div className="text-center select-none">
        <div
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#0f380f",
            fontSize: 38,
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          PHIL
        </div>
        <div
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#0f380f",
            fontSize: 38,
            letterSpacing: 4,
            lineHeight: 1,
            marginTop: 6,
          }}
        >
          CHERNER
        </div>
        <div
          className="mt-12"
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#0f380f",
            fontSize: 12,
            letterSpacing: 2,
            animation: "blink 0.9s step-end infinite",
          }}
        >
          ▶ PRESS START
        </div>
        <div
          className="mt-6"
          style={{
            fontFamily: "var(--font-pixel), 'Press Start 2P', monospace",
            color: "#306230",
            fontSize: 8,
          }}
        >
          © 2026  PIC123
        </div>
      </div>
    </div>
  );
}
