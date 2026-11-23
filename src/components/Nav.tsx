"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { unlockEgg } from "@/lib/eggs";
import { SKIN_IDS } from "@/lib/skins";
import { siteConfig } from "@/lib/site";
import SkinSwitcher from "@/components/skins/SkinSwitcher";
import { applySkin, currentSkin } from "@/components/skins/useSkin";
import { TERMINAL_OPEN_EVENT } from "@/components/fun/Terminal";

const links = [
  { label: "Work", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/#contact" },
];

const LOGO_POKES = 5;
const POKE_WINDOW_MS = 2500;

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pokes = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Poke the logo five times quickly → a random different skin.
  const onLogoClick = () => {
    const now = Date.now();
    pokes.current = [...pokes.current, now].filter(
      (t) => now - t < POKE_WINDOW_MS,
    );
    if (pokes.current.length >= LOGO_POKES) {
      pokes.current = [];
      const others = SKIN_IDS.filter((id) => id !== currentSkin());
      applySkin(others[Math.floor(Math.random() * others.length)]);
      unlockEgg("logo");
    }
  };

  const openTerminal = () =>
    window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT));

  return (
    <nav
      aria-label="Primary"
      className="skin-nav fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          href="/"
          onClick={onLogoClick}
          className="font-pixel text-xl tracking-wide hover:text-accent transition-colors"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.shortName}
        </Link>

        <ul className="hidden gap-6 font-pixel text-xs md:flex">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="relative inline-block py-1 hover:text-accent transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openTerminal}
            aria-label="Open terminal"
            title="Open terminal (`)"
            className="inline-flex h-9 items-center justify-center rounded border border-white/40 px-2.5 font-terminal text-xs hover:border-accent hover:text-accent transition"
          >
            &gt;_
          </button>
          <SkinSwitcher />
          <button
            type="button"
            className="md:hidden inline-flex h-9 w-9 items-center justify-center border border-white/40 rounded font-pixel text-sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "×" : "≡"}
          </button>
        </div>
      </div>

      {open && (
        <ul
          id="mobile-menu"
          className="md:hidden flex flex-col gap-1 border-t border-white/20 bg-black px-4 py-3 font-pixel text-sm"
        >
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="block px-2 py-3 hover:text-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
