export type PortfolioStyle = "style-1" | "style-2";

export const STYLE_COOKIE = "portfolio-style";
export const STYLE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
export const DEFAULT_STYLE: PortfolioStyle = "style-1";

export type StyleOption = {
  id: PortfolioStyle;
  label: string;
  swatch: string;
};

export const STYLE_OPTIONS: StyleOption[] = [
  { id: "style-1", label: "Ebony & Ivory", swatch: "#818cf8" },
  { id: "style-2", label: "Burnt Neon", swatch: "#c8f542" },
];
