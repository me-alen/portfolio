"use client";

import { useEffect, useRef, useState } from "react";

import { syne } from "../fonts";
import { STYLE_OPTIONS } from "../styleConfig";
import type { PortfolioStyle } from "../styleConfig";

type StyleSwitcherProps = {
  initials: string;
  currentStyle: PortfolioStyle;
  onSelect: (style: PortfolioStyle) => void;
  onPlayGame: () => void;
};

type SwitcherTheme = {
  accent: string;
  logo: string;
  panelBg: string;
  panelBorder: string;
  panelText: string;
  activeBg: string;
  hoverBg: string;
  label: string;
  /** Render the closed-state logo white with blend-mode "difference" so it
   *  stays legible over both light and dark regions of the page. */
  blendLogo?: boolean;
};

const DEFAULT_THEME: SwitcherTheme = {
  accent: "#818cf8",
  logo: "var(--foreground)",
  panelBg: "var(--card-bg)",
  panelBorder: "var(--border-color)",
  panelText: "var(--foreground)",
  activeBg: "rgba(99, 102, 241, 0.14)",
  hoverBg: "rgba(0, 0, 0, 0.05)",
  label: "var(--subtle-foreground)",
};

const SWITCHER_THEMES: Partial<Record<PortfolioStyle, SwitcherTheme>> = {
  "style-2": {
    accent: "#c8f542",
    logo: "#f0ede8",
    panelBg: "rgba(16, 17, 16, 0.95)",
    panelBorder: "rgba(200, 245, 66, 0.35)",
    panelText: "#f0ede8",
    activeBg: "rgba(200, 245, 66, 0.14)",
    hoverBg: "rgba(255, 255, 255, 0.06)",
    label: "#96928b",
  },
  "style-3": {
    accent: "#f00000",
    logo: "#141412",
    panelBg: "rgba(244, 242, 237, 0.97)",
    panelBorder: "rgba(20, 20, 18, 0.18)",
    panelText: "#141412",
    activeBg: "rgba(164, 80, 44, 0.12)",
    hoverBg: "rgba(20, 20, 18, 0.06)",
    label: "#6c685f",
    blendLogo: true,
  },
  "style-4": {
    accent: "#e63946",
    logo: "#17130d",
    panelBg: "rgba(253, 243, 224, 0.97)",
    panelBorder: "#17130d",
    panelText: "#17130d",
    activeBg: "rgba(230, 57, 70, 0.14)",
    hoverBg: "rgba(23, 19, 13, 0.06)",
    label: "#8a7f6a",
  },
  "style-5": {
    accent: "#c9a96a",
    logo: "#ede6d8",
    panelBg: "rgba(11, 10, 8, 0.95)",
    panelBorder: "rgba(201, 169, 106, 0.4)",
    panelText: "#ede6d8",
    activeBg: "rgba(201, 169, 106, 0.16)",
    hoverBg: "rgba(255, 255, 255, 0.06)",
    label: "#8d8474",
  },
  "style-6": {
    accent: "#ff2e00",
    logo: "#0a0a0a",
    panelBg: "rgba(255, 255, 255, 0.97)",
    panelBorder: "#0a0a0a",
    panelText: "#0a0a0a",
    activeBg: "rgba(255, 46, 0, 0.12)",
    hoverBg: "rgba(0, 0, 0, 0.05)",
    label: "#6b6b6b",
  },
  "style-7": {
    accent: "#3554ff",
    logo: "#14151a",
    panelBg: "rgba(255, 255, 255, 0.97)",
    panelBorder: "#d8d8cd",
    panelText: "#14151a",
    activeBg: "rgba(53, 84, 255, 0.1)",
    hoverBg: "rgba(20, 21, 26, 0.05)",
    label: "#5d6069",
  },
  "style-8": {
    accent: "#ff8fab",
    logo: "#3a2e39",
    panelBg: "rgba(255, 245, 250, 0.97)",
    panelBorder: "#3a2e39",
    panelText: "#3a2e39",
    activeBg: "rgba(255, 143, 171, 0.2)",
    hoverBg: "rgba(58, 46, 57, 0.06)",
    label: "#6d5a6c",
  },
  "style-9": {
    accent: "#33ff66",
    logo: "#33ff66",
    panelBg: "rgba(7, 11, 20, 0.96)",
    panelBorder: "rgba(51, 255, 102, 0.45)",
    panelText: "#33ff66",
    activeBg: "rgba(51, 255, 102, 0.14)",
    hoverBg: "rgba(51, 255, 102, 0.08)",
    label: "rgba(51, 255, 102, 0.6)",
  },
  "style-10": {
    accent: "#ffd166",
    logo: "#f4f7ff",
    panelBg: "rgba(18, 42, 105, 0.96)",
    panelBorder: "rgba(244, 247, 255, 0.35)",
    panelText: "#f4f7ff",
    activeBg: "rgba(255, 209, 102, 0.15)",
    hoverBg: "rgba(255, 255, 255, 0.07)",
    label: "rgba(244, 247, 255, 0.6)",
  },
};

export default function StyleSwitcher({
  initials,
  currentStyle,
  onSelect,
  onPlayGame,
}: StyleSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<PortfolioStyle | "game" | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const theme = SWITCHER_THEMES[currentStyle] ?? DEFAULT_THEME;
  const { accent, panelBg, panelBorder, panelText, activeBg, hoverBg } = theme;
  // The blend must sit on the fixed root (a stacking context isolates its
  // children's blending) and is dropped while the panel is open so the panel
  // keeps its real colors; the logo then falls back to its solid color.
  const blendLogo = Boolean(theme.blendLogo) && !open;
  const logoColor = blendLogo ? "#ffffff" : theme.logo;

  const handleSelect = (id: PortfolioStyle) => {
    onSelect(id);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className="fixed left-6 top-5 z-[1150] sm:left-12"
      style={{ mixBlendMode: blendLogo ? "difference" : undefined }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change portfolio style"
        style={{
          alignItems: "baseline",
          background: "transparent",
          border: "none",
          color: logoColor,
          cursor: "pointer",
          display: "inline-flex",
          fontFamily: syne.style.fontFamily,
          fontSize: 20,
          fontWeight: 800,
          letterSpacing: "0.02em",
          lineHeight: 1,
          padding: 0,
          textTransform: "uppercase",
        }}
      >
        {initials}
        <span style={{ color: blendLogo ? "#ffffff" : accent }}>.</span>
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Select portfolio style"
          style={{
            backdropFilter: "blur(10px)",
            background: panelBg,
            border: `1px solid ${panelBorder}`,
            borderRadius: 10,
            boxShadow: "0 14px 32px rgba(0, 0, 0, 0.28)",
            color: panelText,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            left: 0,
            maxHeight: "calc(100vh - 90px)",
            minWidth: 172,
            overflowY: "auto",
            padding: 6,
            position: "absolute",
            top: "calc(100% + 10px)",
          }}
        >
          <div
            style={{
              color: theme.label,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "6px 10px 4px",
              textTransform: "uppercase",
            }}
          >
            Choose a style
          </div>
          {STYLE_OPTIONS.map((option) => {
            const active = option.id === currentStyle;
            const isHover = hovered === option.id;

            return (
              <button
                key={option.id}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => handleSelect(option.id)}
                onMouseEnter={() => setHovered(option.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  alignItems: "center",
                  background: active ? activeBg : isHover ? hoverBg : "transparent",
                  border: "none",
                  borderRadius: 6,
                  color: panelText,
                  cursor: "pointer",
                  display: "flex",
                  fontSize: 13,
                  fontWeight: active ? 700 : 500,
                  gap: 10,
                  padding: "8px 10px",
                  textAlign: "left",
                  transition: "background 0.15s ease",
                  width: "100%",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    background: option.swatch,
                    borderRadius: 999,
                    flex: "0 0 auto",
                    height: 9,
                    width: 9,
                  }}
                />
                <span style={{ flex: 1 }}>{option.label}</span>
                {active ? (
                  <span aria-hidden="true" style={{ color: accent, fontSize: 12 }}>
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}

          <div
            aria-hidden="true"
            style={{ background: panelBorder, height: 1, margin: "6px 4px" }}
          />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              onPlayGame();
              setOpen(false);
            }}
            onMouseEnter={() => setHovered("game")}
            onMouseLeave={() => setHovered(null)}
            style={{
              alignItems: "center",
              background: hovered === "game" ? hoverBg : "transparent",
              border: "none",
              borderRadius: 6,
              color: panelText,
              cursor: "pointer",
              display: "flex",
              fontSize: 13,
              fontWeight: 500,
              gap: 10,
              padding: "8px 10px",
              textAlign: "left",
              transition: "background 0.15s ease",
              width: "100%",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                color: accent,
                flex: "0 0 auto",
                fontSize: 9,
                lineHeight: 1,
                textAlign: "center",
                width: 9,
              }}
            >
              ▶
            </span>
            <span style={{ flex: 1 }}>Play Pour an Ocean</span>
          </button>

        </div>
      ) : null}
    </div>
  );
}
