"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const links = [
  { label: "Projects", href: "/#projects" },
  { label: "About", href: "/#about" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <nav
      aria-label="Primary"
      className="fixed top-0 inset-x-0 z-50 border-b border-white/20 bg-black/70 backdrop-blur supports-[backdrop-filter]:bg-black/50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-pixel text-xl tracking-wide hover:text-accent transition-colors"
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.shortName}
        </Link>

        <ul className="hidden gap-6 font-pixel text-xs sm:flex">
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

        <button
          type="button"
          className="sm:hidden inline-flex h-10 w-10 items-center justify-center border border-white/40 rounded font-pixel text-sm"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "×" : "≡"}
        </button>
      </div>

      {open && (
        <ul
          id="mobile-menu"
          className="sm:hidden flex flex-col gap-1 border-t border-white/20 bg-black px-4 py-3 font-pixel text-sm"
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
