export type PortfolioStyle =
  | "style-1"
  | "style-2"
  | "style-3"
  | "style-4"
  | "style-5"
  | "style-6"
  | "style-7"
  | "style-8"
  | "style-9"
  | "style-10";

export const STYLE_COOKIE = "portfolio-style";
export const STYLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const DEFAULT_STYLE: PortfolioStyle = "style-1";

export type StyleOption = {
  id: PortfolioStyle;
  label: string;
  swatch: string;
  /** Page background for the mini two-tone preview tile in the style chooser. */
  tileBg: string;
};

export const STYLE_OPTIONS: StyleOption[] = [
  { id: "style-1", label: "Ebony & Ivory", swatch: "#818cf8", tileBg: "#f3efe7" },
  { id: "style-2", label: "Burnt Neon", swatch: "#c8f542", tileBg: "#101110" },
  { id: "style-3", label: "Atelier", swatch: "#a4502c", tileBg: "#f2f0eb" },
  { id: "style-4", label: "Comic Ink", swatch: "#e63946", tileBg: "#fdf3e0" },
  { id: "style-5", label: "Gilded Noir", swatch: "#c9a96a", tileBg: "#0b0a08" },
  { id: "style-6", label: "Swiss Grid", swatch: "#ff2e00", tileBg: "#ffffff" },
  { id: "style-7", label: "Bento", swatch: "#3554ff", tileBg: "#f1f1ec" },
  { id: "style-8", label: "Bubblegum", swatch: "#ff8fab", tileBg: "#fff5fa" },
  { id: "style-9", label: "Arcade", swatch: "#33ff66", tileBg: "#070b14" },
  { id: "style-10", label: "Blueprint", swatch: "#f4f7ff", tileBg: "#1c3d8f" },
];

export function isPortfolioStyle(
  value: string | undefined,
): value is PortfolioStyle {
  return STYLE_OPTIONS.some((option) => option.id === value);
}
