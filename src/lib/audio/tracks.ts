import type { Track } from "./engine";

// Procedurally generated tracks themed after Phil's real projects. No audio
// files, no licensing — the engine synthesizes these live.
//
// To use REAL music instead, drop a file in /public/audio (or use a stream
// URL) and add a track like:
//   { id: "demo", kind: "file", title: "My Track", subtitle: "2025",
//     src: "/audio/my-track.mp3", lengthSec: 184 }
// It plays through the same graph, so the visualizer + EQ work on it too.

// MIDI note helpers (C4 = 60).
const C3 = 48;
const Ds3 = 51;
const F3 = 53;
const G3 = 55;
const Gs3 = 56;
const As3 = 58;
const C4 = 60;
const D4 = 62;
const Ds4 = 63;
const F4 = 65;
const G4 = 67;
const Gs4 = 68;
const As4 = 70;
const Fs4 = 66;
const C5 = 72;
const D5 = 74;

export const TRACKS: Track[] = [
  {
    id: "earth-mission-control",
    kind: "synth",
    title: "Earth Mission Control",
    subtitle: "MIT Media Lab · 2024",
    bpm: 72,
    lengthSec: 200,
    waveform: "sine",
    scale: [C4, Ds4, G4, As4, C5, As4, G4, Ds4],
    bass: [C3, C3, Gs3, As3],
    chord: [C4, Ds4, G4],
  },
  {
    id: "natural-harmony",
    kind: "synth",
    title: "Natural Harmony",
    subtitle: "Museum of Science · 2024",
    bpm: 90,
    lengthSec: 176,
    waveform: "triangle",
    scale: [C4, D4, F4, G4, As4, C5, As4, G4],
    bass: [C3, F3, G3, F3],
    chord: [C4, F4, G4],
  },
  {
    id: "neon-cambridge",
    kind: "synth",
    title: "Neon Cambridge",
    subtitle: "Media Lab Nights · 2023",
    bpm: 104,
    lengthSec: 168,
    waveform: "sawtooth",
    scale: [C4, Ds4, F4, G4, Gs4, G4, F4, Ds4],
    bass: [C3, C3, Gs3, F3],
    chord: [C4, Ds4, G4],
    swing: false,
  },
  {
    id: "ascii-dreams",
    kind: "synth",
    title: "ASCII Dreams",
    subtitle: "8-bit reverie · DreamWeaver",
    bpm: 120,
    lengthSec: 152,
    waveform: "square",
    scale: [C4, G4, C5, G4, Ds4, As4, D5, As4],
    bass: [C3, G3, Ds3, F3],
    chord: [C4, Ds4, G4],
    swing: true,
  },
  {
    id: "tipping-points",
    kind: "synth",
    title: "Tipping Points",
    subtitle: "Generative tension · 2023",
    bpm: 96,
    lengthSec: 184,
    waveform: "sawtooth",
    scale: [C4, Ds4, Fs4, Gs4, As4, Gs4, Fs4, Ds4],
    bass: [C3, Ds3, F3, Gs3],
    chord: [C4, Ds4, Gs4],
  },
  {
    id: "dream-machine",
    kind: "synth",
    title: "DreamMachine",
    subtitle: "Rotary phone reverie · 2023",
    bpm: 80,
    lengthSec: 192,
    waveform: "sine",
    scale: [C4, F4, Gs4, C5, D5, C5, Gs4, F4],
    bass: [F3, F3, C3, Gs3],
    chord: [F3, Gs3, C4],
  },
];
