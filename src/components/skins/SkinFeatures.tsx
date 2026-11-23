"use client";

import dynamic from "next/dynamic";
import { useSkin } from "./useSkin";

// Lazy-load so the default `terminal` skin pays for nothing.
const MatrixRain = dynamic(() => import("./MatrixRain"), { ssr: false });
const MatrixStats = dynamic(() => import("./MatrixStats"), { ssr: false });
const WinampTransport = dynamic(() => import("./WinampTransport"), {
  ssr: false,
});
const WinampTitlebar = dynamic(() => import("./WinampTitlebar"), {
  ssr: false,
});
const WinampPlaylist = dynamic(() => import("./WinampPlaylist"), {
  ssr: false,
});
const WinampDock = dynamic(() => import("./WinampDock"), { ssr: false });
const VaporMarquee = dynamic(() => import("./VaporMarquee"), { ssr: false });
const VaporClock = dynamic(() => import("./VaporClock"), { ssr: false });
const VaporCounter = dynamic(() => import("./VaporCounter"), { ssr: false });
const VaporFloaters = dynamic(() => import("./VaporFloaters"), { ssr: false });
const GameboyBezel = dynamic(() => import("./GameboyBezel"), { ssr: false });
const GameboyBattery = dynamic(() => import("./GameboyBattery"), {
  ssr: false,
});
const GameboyPressStart = dynamic(() => import("./GameboyPressStart"), {
  ssr: false,
});
const LlamaToast = dynamic(() => import("./LlamaToast"), { ssr: false });
const LlamaWalker = dynamic(() => import("./LlamaWalker"), { ssr: false });
const LlamaBadge = dynamic(() => import("./LlamaBadge"), { ssr: false });

export default function SkinFeatures() {
  const { skin, mounted } = useSkin();
  if (!mounted) return null;

  return (
    <>
      {skin === "winamp-classic" && (
        <>
          <WinampTitlebar />
          <WinampPlaylist />
          <WinampTransport />
          <WinampDock />
        </>
      )}

      {skin === "matrix" && (
        <>
          <MatrixRain />
          <MatrixStats />
        </>
      )}

      {skin === "vaporwave" && (
        <>
          <VaporMarquee />
          <VaporClock />
          <VaporCounter />
          <VaporFloaters />
        </>
      )}

      {skin === "gameboy" && (
        <>
          <GameboyBezel />
          <GameboyBattery />
          <GameboyPressStart />
        </>
      )}

      {skin === "llama" && (
        <>
          <LlamaToast />
          <LlamaWalker />
          <LlamaBadge />
        </>
      )}
    </>
  );
}
