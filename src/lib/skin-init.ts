import { DEFAULT_SKIN, SKIN_IDS, SKIN_STORAGE_KEY } from "./skins";

// String inlined into <head> as a <script> so the theme attribute is set
// before paint. Keep it tiny and self-contained — no imports at runtime.
export const SKIN_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(
  SKIN_STORAGE_KEY,
)};var allowed=${JSON.stringify(
  SKIN_IDS,
)};var stored=localStorage.getItem(k);var pick=allowed.indexOf(stored)>-1?stored:${JSON.stringify(
  DEFAULT_SKIN,
)};document.documentElement.setAttribute('data-theme',pick);}catch(e){document.documentElement.setAttribute('data-theme',${JSON.stringify(
  DEFAULT_SKIN,
)});}})();`;
