export type PortfolioStyle = "style-1" | "style-2" | "style-3";

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
  { id: "style-3", label: "Atelier", swatch: "#f2f0eb" },
];

export function isPortfolioStyle(
  value: string | undefined,
): value is PortfolioStyle {
  return STYLE_OPTIONS.some((option) => option.id === value);
}
