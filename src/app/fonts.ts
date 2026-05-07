import { Press_Start_2P, Share_Tech_Mono } from "next/font/google";

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
