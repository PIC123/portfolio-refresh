import {
  Press_Start_2P,
  Share_Tech_Mono,
  VT323,
  Audiowide,
  Pacifico,
} from "next/font/google";

export const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

export const terminalFont = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-terminal",
  display: "swap",
});

// Winamp-classic LCD-ish.
export const lcdFont = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lcd",
  display: "swap",
});

// Vaporwave / retro-futurism.
export const retroFont = Audiowide({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-retro",
  display: "swap",
});

// Llama skin.
export const scriptFont = Pacifico({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const allFontVariables = [
  pixelFont.variable,
  terminalFont.variable,
  lcdFont.variable,
  retroFont.variable,
  scriptFont.variable,
].join(" ");
