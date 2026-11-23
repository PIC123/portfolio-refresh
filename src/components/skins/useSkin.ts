"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SKIN,
  SKIN_STORAGE_KEY,
  isSkinId,
  type SkinId,
} from "@/lib/skins";

const SKIN_EVENT = "pc-skin-change";

/** Apply a skin from anywhere (terminal, logo egg, switcher). */
export function applySkin(next: SkinId) {
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem(SKIN_STORAGE_KEY, next);
  } catch {
    // localStorage unavailable — non-fatal.
  }
  window.dispatchEvent(new CustomEvent(SKIN_EVENT, { detail: next }));
}

export function currentSkin(): SkinId {
  const attr = document.documentElement.getAttribute("data-theme");
  return isSkinId(attr) ? attr : DEFAULT_SKIN;
}

/**
 * Every caller gets its own state, so the hook listens for the change event
 * rather than relying on the caller that triggered it — otherwise the
 * switcher would update but the per-skin widgets would not.
 */
export function useSkin() {
  const [skin, setSkinState] = useState<SkinId>(DEFAULT_SKIN);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setSkinState(currentSkin());
    setMounted(true);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (isSkinId(detail)) setSkinState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === SKIN_STORAGE_KEY && isSkinId(e.newValue)) {
        document.documentElement.setAttribute("data-theme", e.newValue);
        setSkinState(e.newValue);
      }
    };
    window.addEventListener(SKIN_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(SKIN_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setSkin = useCallback((next: SkinId) => applySkin(next), []);

  return { skin, setSkin, mounted };
}
