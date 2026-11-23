"use client";

import { useEffect, useRef, useState } from "react";
import { SKINS, SKIN_IDS, type SkinId } from "@/lib/skins";
import { useSkin } from "./useSkin";

export default function SkinSwitcher() {
  const { skin, setSkin, mounted } = useSkin();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const active = SKINS[skin];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change skin (current: ${active.label})`}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded border px-2.5 py-1 font-pixel text-[10px] transition"
        style={{
          borderColor: "var(--border-strong)",
          color: "var(--foreground)",
          background: "var(--surface)",
        }}
      >
        <span aria-hidden="true">{active.emoji}</span>
        <span className="hidden sm:inline">{mounted ? active.label : "Skin"}</span>
        <span aria-hidden="true" className="text-[8px] opacity-70">▾</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          aria-label="Choose a skin"
          className="absolute right-0 mt-2 w-72 z-50 skin-surface p-2"
          style={{ background: "var(--surface)" }}
        >
          <p
            className="px-2 py-1 font-pixel text-[10px]"
            style={{ color: "var(--subtle)" }}
          >
            {"// SELECT.SKIN"}
          </p>
          <ul className="mt-1 space-y-1">
            {SKIN_IDS.map((id) => {
              const meta = SKINS[id];
              const isActive = id === skin;
              return (
                <li key={id}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => {
                      setSkin(id as SkinId);
                      setOpen(false);
                    }}
                    className="flex w-full items-start gap-3 rounded p-2 text-left transition"
                    style={
                      isActive
                        ? {
                            background: "color-mix(in oklab, var(--accent) 20%, transparent)",
                            border: "1px solid var(--accent)",
                          }
                        : {
                            background: "transparent",
                            border: "1px solid transparent",
                          }
                    }
                  >
                    <span
                      aria-hidden="true"
                      className="text-xl leading-none mt-0.5"
                    >
                      {meta.emoji}
                    </span>
                    <span className="flex-1">
                      <span className="block font-pixel text-[11px]">
                        {meta.label}
                        {isActive && (
                          <span
                            className="ml-2 text-[9px]"
                            style={{ color: "var(--accent)" }}
                          >
                            ● active
                          </span>
                        )}
                      </span>
                      <span
                        className="block font-terminal text-xs leading-snug"
                        style={{ color: "var(--muted)" }}
                      >
                        {meta.blurb}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
