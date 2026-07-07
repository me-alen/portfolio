import { DM_Mono, Fraunces, Instrument_Serif, Syne } from "next/font/google";

export const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-display",
});

export const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-mono",
  weight: ["300", "400"],
});

export const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-serif",
  axes: ["opsz"],
});

export const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style3-serif",
  weight: "400",
  style: ["normal", "italic"],
});
