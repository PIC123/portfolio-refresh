"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";
import SkinSwitcher from "@/components/skins/SkinSwitcher";

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
      className="skin-nav fixed top-0 inset-x-0 z-50"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-pixel text-xl tracking-wide transition-colors"
          style={{ color: "var(--foreground)" }}
          aria-label={`${siteConfig.name} — home`}
        >
          {siteConfig.shortName}
        </Link>

        <ul className="hidden gap-6 font-pixel text-xs sm:flex">
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="relative inline-block py-1 transition-colors hover:opacity-70"
                style={{ color: "var(--foreground)" }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <SkinSwitcher />

          <button
            type="button"
            className="sm:hidden inline-flex h-9 w-9 items-center justify-center skin-button font-pixel text-sm"
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
          className="sm:hidden flex flex-col gap-1 px-4 py-3 font-pixel text-sm"
          style={{
            borderTop: "1px solid var(--border)",
            background: "var(--nav-bg)",
          }}
        >
          {links.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="block px-2 py-3"
                style={{ color: "var(--foreground)" }}
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
