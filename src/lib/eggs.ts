// Easter-egg registry. Progress lives in localStorage so the hunt persists
// across visits; everything degrades to "nothing found" if storage is blocked.

export const EGGS = [
  { id: "terminal", name: "Shell access", hint: "There's a key under Esc." },
  { id: "konami", name: "Party mode", hint: "↑ ↑ ↓ ↓ … you know the rest." },
  { id: "logo", name: "Costume roulette", hint: "The logo doesn't like being poked." },
  { id: "skin", name: "Costume change", hint: "Try something on." },
  { id: "wardrobe", name: "Full wardrobe", hint: "Wear all six." },
  { id: "winamp", name: "It really whips", hint: "One skin makes actual sound." },
  { id: "sudo", name: "Nice try", hint: "Ask the shell for more power." },
  { id: "console", name: "Inspector", hint: "Developers leave notes for developers." },
  { id: "lost", name: "Lost in space", hint: "Get lost, then score 10." },
  { id: "handshake", name: "Secret handshake", hint: "A page no link points to." },
] as const;

export type EggId = (typeof EGGS)[number]["id"];

const KEY = "pc-eggs";
const SKINS_TRIED_KEY = "pc-skins-tried";
export const EGG_EVENT = "pc-egg";

function read(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function write(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked — the egg still toasts, it just won't persist.
  }
}

export function foundEggs(): EggId[] {
  const valid = new Set<string>(EGGS.map((e) => e.id));
  return read(KEY).filter((id): id is EggId => valid.has(id));
}

/** Returns true only the first time an egg is found. */
export function unlockEgg(id: EggId): boolean {
  if (typeof window === "undefined") return false;
  const found = foundEggs();
  if (found.includes(id)) return false;
  const next = [...found, id];
  write(KEY, next);
  window.dispatchEvent(
    new CustomEvent(EGG_EVENT, { detail: { id, count: next.length } }),
  );
  return true;
}

/** Tracks distinct skins worn; unlocks the wardrobe egg at all six. */
export function noteSkinTried(skin: string, total: number) {
  const tried = new Set(read(SKINS_TRIED_KEY));
  tried.add(skin);
  write(SKINS_TRIED_KEY, [...tried]);
  if (tried.size >= total) unlockEgg("wardrobe");
}

export function resetEggs() {
  write(KEY, []);
  write(SKINS_TRIED_KEY, []);
  window.dispatchEvent(new CustomEvent(EGG_EVENT, { detail: { count: 0 } }));
}
