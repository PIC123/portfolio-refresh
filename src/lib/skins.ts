export const SKIN_IDS = [
  "terminal",
  "winamp-classic",
  "llama",
  "matrix",
  "vaporwave",
  "gameboy",
] as const;

export type SkinId = (typeof SKIN_IDS)[number];

export const DEFAULT_SKIN: SkinId = "terminal";
export const SKIN_STORAGE_KEY = "pc-skin";

export type SkinMeta = {
  id: SkinId;
  label: string;
  blurb: string;
  emoji: string;
};

export const SKINS: Record<SkinId, SkinMeta> = {
  terminal: {
    id: "terminal",
    label: "Terminal",
    blurb: "Default. Black + cyan, monospace, ASCII sparkles.",
    emoji: "▮",
  },
  "winamp-classic": {
    id: "winamp-classic",
    label: "Winamp Classic",
    blurb: "Beveled gray chrome, LCD green readout, fake transport.",
    emoji: "♪",
  },
  llama: {
    id: "llama",
    label: "Llama",
    blurb: "Brown + orange, cursive, whips the llama's ass.",
    emoji: "🦙",
  },
  matrix: {
    id: "matrix",
    label: "Matrix",
    blurb: "Falling green characters. Wake up, Phil…",
    emoji: "⬛",
  },
  vaporwave: {
    id: "vaporwave",
    label: "Vaporwave",
    blurb: "Pink, cyan, sun grid. ᴀ ᴇ s ᴛ ʜ ᴇ ᴛ ɪ ᴄ.",
    emoji: "🌴",
  },
  gameboy: {
    id: "gameboy",
    label: "Game Boy",
    blurb: "4 shades of green, scanlines, DMG energy.",
    emoji: "🎮",
  },
};

export function isSkinId(value: unknown): value is SkinId {
  return (
    typeof value === "string" && (SKIN_IDS as readonly string[]).includes(value)
  );
}
