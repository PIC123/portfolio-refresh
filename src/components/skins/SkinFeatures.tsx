"use client";

import dynamic from "next/dynamic";
import { useSkin } from "./useSkin";

const MatrixRain = dynamic(() => import("./MatrixRain"), { ssr: false });
const VaporSun = dynamic(() => import("./VaporSun"), { ssr: false });
const WinampTransport = dynamic(() => import("./WinampTransport"), { ssr: false });
const LlamaToast = dynamic(() => import("./LlamaToast"), { ssr: false });

export default function SkinFeatures() {
  const { skin, mounted } = useSkin();
  if (!mounted) return null;

  return (
    <>
      {skin === "matrix" && <MatrixRain />}
      {skin === "vaporwave" && <VaporSun />}
      {skin === "winamp-classic" && <WinampTransport />}
      {/* LlamaToast subscribes globally for the "skin changed to llama" event */}
      <LlamaToast />
    </>
  );
}
