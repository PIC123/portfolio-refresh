"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AudioEngine, type EngineState, type Track } from "@/lib/audio/engine";
import { TRACKS } from "@/lib/audio/tracks";

type AudioContextValue = {
  state: EngineState;
  tracks: Track[];
  eqGains: number[];
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  selectTrack: (index: number) => void;
  seek: (seconds: number) => void;
  setVolume: (v: number) => void;
  setEqBand: (index: number, dB: number) => void;
  resetEq: () => void;
  getAnalyserData: (target: Uint8Array) => boolean;
};

const Ctx = createContext<AudioContextValue | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const engineRef = useRef<AudioEngine | null>(null);
  if (engineRef.current === null && typeof window !== "undefined") {
    engineRef.current = new AudioEngine(TRACKS);
  }

  const [state, setState] = useState<EngineState>(
    () =>
      engineRef.current?.getState() ?? {
        ready: false,
        playing: false,
        trackIndex: 0,
        elapsed: 0,
        duration: 0,
        volume: 0.7,
      },
  );
  const [eqGains, setEqGains] = useState<number[]>(
    () => engineRef.current?.getEqGains() ?? [],
  );

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const unsub = engine.subscribe((s) => {
      setState(s);
      setEqGains([...engine.getEqGains()]);
    });
    return () => {
      unsub();
    };
  }, []);

  // Stable control identities — they only touch the engine ref, never state,
  // so consumers (e.g. the canvas visualizer) don't re-run effects on each
  // playback tick.
  const controls = useMemo(() => {
    const engine = () => engineRef.current;
    return {
      tracks: engineRef.current?.trackList ?? TRACKS,
      play: () => engine()?.play(),
      pause: () => engine()?.pause(),
      toggle: () => engine()?.toggle(),
      next: () => engine()?.next(),
      prev: () => engine()?.prev(),
      selectTrack: (i: number) => engine()?.changeTrack(i),
      seek: (s: number) => engine()?.seek(s),
      setVolume: (v: number) => engine()?.setVolume(v),
      setEqBand: (i: number, dB: number) => engine()?.setEqBand(i, dB),
      resetEq: () => engine()?.resetEq(),
      getAnalyserData: (t: Uint8Array) => engine()?.getAnalyserData(t) ?? false,
    };
  }, []);

  const value = useMemo<AudioContextValue>(
    () => ({ state, eqGains, ...controls }),
    [state, eqGains, controls],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useAudio must be used within <AudioProvider>");
  }
  return ctx;
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "00:00";
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}
