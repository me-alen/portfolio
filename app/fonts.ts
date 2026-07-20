import {
  Archivo,
  Baloo_2,
  Bangers,
  Comic_Neue,
  Cormorant_Garamond,
  DM_Mono,
  Fraunces,
  Instrument_Serif,
  Manrope,
  Press_Start_2P,
  Saira,
  Sora,
  Syne,
  VT323,
} from "next/font/google";

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

export const bangers = Bangers({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style4-display",
  weight: "400",
});

export const comicNeue = Comic_Neue({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style4-body",
  weight: ["400", "700"],
});

export const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style5-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style6-sans",
});

export const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style7-display",
});

export const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style7-body",
});

export const baloo = Baloo_2({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style8-round",
});

export const pressStart = Press_Start_2P({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style9-pixel",
  weight: "400",
});

export const vt323 = VT323({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style9-mono",
  weight: "400",
});

export const saira = Saira({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style10-display",
});
