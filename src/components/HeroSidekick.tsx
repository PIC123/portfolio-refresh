"use client";

import dynamic from "next/dynamic";
import AsciiSparkles from "@/components/AsciiSparkles";
import { useSkin } from "@/components/skins/useSkin";

const WinampSpectrum = dynamic(
  () => import("@/components/skins/WinampSpectrum"),
  { ssr: false },
);
const MatrixTerminal = dynamic(
  () => import("@/components/skins/MatrixTerminal"),
  { ssr: false },
);
const VaporSun = dynamic(() => import("@/components/skins/VaporSun"), {
  ssr: false,
});
const GameboyDpad = dynamic(
  () => import("@/components/skins/GameboyDpad"),
  { ssr: false },
);
const LlamaPortrait = dynamic(
  () => import("@/components/skins/LlamaPortrait"),
  { ssr: false },
);

export default function HeroSidekick() {
  const { skin, mounted } = useSkin();
  if (!mounted) return <AsciiSparkles />;

  switch (skin) {
    case "winamp-classic":
      return <WinampSpectrum />;
    case "matrix":
      return <MatrixTerminal />;
    case "vaporwave":
      return <VaporSun inline />;
    case "gameboy":
      return <GameboyDpad />;
    case "llama":
      return <LlamaPortrait />;
    case "terminal":
    default:
      return <AsciiSparkles />;
  }
}
