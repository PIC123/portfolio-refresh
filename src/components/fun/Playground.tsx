"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { EGGS, EGG_EVENT, noteSkinTried, unlockEgg, type EggId } from "@/lib/eggs";
import { DEFAULT_SKIN, SKIN_IDS } from "@/lib/skins";
import { useAudio } from "@/components/skins/audio/AudioProvider";

const KONAMI = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
];
const PARTY_MS = 12000;

type Toast = { name: string; count: number };

/**
 * The always-on fun layer: watches for eggs (Konami, skin changes, the hidden
 * page, the console note) and announces each find once.
 */
export default function Playground() {
  const pathname = usePathname();
  const [toast, setToast] = useState<Toast | null>(null);
  const { state: audio } = useAudio();

  // The player making actual sound is a secret of its own.
  useEffect(() => {
    if (audio.playing) unlockEgg("winamp");
  }, [audio.playing]);

  // Announce finds.
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onEgg = (e: Event) => {
      const { id, count } = (e as CustomEvent<{ id?: EggId; count: number }>)
        .detail;
      const egg = EGGS.find((x) => x.id === id);
      if (!egg) return;
      setToast({ name: egg.name, count });
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 4500);
    };
    window.addEventListener(EGG_EVENT, onEgg);
    return () => {
      window.removeEventListener(EGG_EVENT, onEgg);
      clearTimeout(timer);
    };
  }, []);

  // Konami code → party mode.
  useEffect(() => {
    let pos = 0;
    let off: ReturnType<typeof setTimeout>;
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        unlockEgg("konami");
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        document.documentElement.setAttribute("data-party", "on");
        clearTimeout(off);
        off = setTimeout(
          () => document.documentElement.removeAttribute("data-party"),
          PARTY_MS,
        );
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(off);
    };
  }, []);

  // Skin eggs.
  useEffect(() => {
    const onSkin = (e: Event) => {
      const skin = (e as CustomEvent<string>).detail;
      if (skin !== DEFAULT_SKIN) unlockEgg("skin");
      noteSkinTried(skin, SKIN_IDS.length);
    };
    noteSkinTried(
      document.documentElement.getAttribute("data-theme") ?? DEFAULT_SKIN,
      SKIN_IDS.length,
    );
    window.addEventListener("pc-skin-change", onSkin);
    return () => window.removeEventListener("pc-skin-change", onSkin);
  }, []);

  // The page no link points to.
  useEffect(() => {
    if (pathname === "/oauth") unlockEgg("handshake");
  }, [pathname]);

  // A note for people who open devtools.
  useEffect(() => {
    const w = window as unknown as { phil?: { hello: () => string } };
    if (w.phil) return;
    w.phil = {
      hello: () => {
        unlockEgg("console");
        return "hi! you read the console. that's one of the secrets.";
      },
    };
    console.log(
      "%c PC %c hey, you opened the console.",
      "background:#00fff9;color:#000;font-weight:bold;padding:2px 6px",
      "color:#00fff9",
    );
    console.log(
      "There are %d secrets on this site. Run phil.hello() for one of them, or press ` for a shell.",
      EGGS.length,
    );
  }, []);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-in fixed left-1/2 top-20 z-[80] -translate-x-1/2 border border-accent bg-black px-4 py-3 text-center shadow-2xl"
    >
      <p className="font-pixel text-[10px] text-accent">
        ★ SECRET FOUND · {toast.count}/{EGGS.length}
      </p>
      <p className="mt-1 font-terminal text-sm text-white">{toast.name}</p>
    </div>
  );
}
