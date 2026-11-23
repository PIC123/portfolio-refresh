"use client";

import { useEffect, useState } from "react";
import { EGGS, EGG_EVENT, foundEggs } from "@/lib/eggs";
import { TERMINAL_OPEN_EVENT } from "./Terminal";

/** Footer tally. Renders nothing until mounted to avoid a hydration flash. */
export default function EggCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const sync = () => setCount(foundEggs().length);
    sync();
    window.addEventListener(EGG_EVENT, sync);
    return () => window.removeEventListener(EGG_EVENT, sync);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TERMINAL_OPEN_EVENT))}
      className="font-pixel text-[9px] text-white/50 hover:text-accent"
      title="Open the shell and type `secrets`"
    >
      ★ {count ?? "–"}/{EGGS.length} secrets found
    </button>
  );
}
