"use client";

import { useEffect, useState, useCallback } from "react";
import {
  DEFAULT_SKIN,
  SKIN_STORAGE_KEY,
  isSkinId,
  type SkinId,
} from "@/lib/skins";

export function useSkin() {
  const [skin, setSkinState] = useState<SkinId>(DEFAULT_SKIN);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const attr = document.documentElement.getAttribute("data-theme");
    if (isSkinId(attr)) setSkinState(attr);
    setMounted(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === SKIN_STORAGE_KEY && isSkinId(e.newValue)) {
        document.documentElement.setAttribute("data-theme", e.newValue);
        setSkinState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setSkin = useCallback((next: SkinId) => {
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(SKIN_STORAGE_KEY, next);
    } catch {
      // localStorage unavailable — non-fatal.
    }
    setSkinState(next);
    window.dispatchEvent(new CustomEvent("pc-skin-change", { detail: next }));
  }, []);

  return { skin, setSkin, mounted };
}
