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

  const isStyle2 = currentStyle === "style-2";
  const isStyle3 = currentStyle === "style-3";
  const accent = isStyle2 ? "#c8f542" : isStyle3 ? "#f00000" : "#818cf8";
  // Style 3 renders the initials in white with blend-mode "difference" so the
  // logo stays legible over both its paper hero and its black contact finale.
  // The blend must sit on the fixed root (a stacking context isolates its
  // children's blending) and is dropped while the panel is open so the panel
  // keeps its real colors; the logo then falls back to ink over the panel.
  const blendLogo = isStyle3 && !open;
  const logoColor = isStyle2
    ? "#f0ede8"
    : isStyle3
      ? blendLogo
        ? "#ffffff"
        : "#141412"
      : "var(--foreground)";
  const panelBg = isStyle2
    ? "rgba(16, 17, 16, 0.95)"
    : isStyle3
      ? "rgba(244, 242, 237, 0.97)"
      : "var(--card-bg)";
  const panelBorder = isStyle2
    ? "rgba(200, 245, 66, 0.35)"
    : isStyle3
      ? "rgba(20, 20, 18, 0.18)"
      : "var(--border-color)";
  const panelText = isStyle2
    ? "#f0ede8"
    : isStyle3
      ? "#141412"
      : "var(--foreground)";
  const activeBg = isStyle2
    ? "rgba(200, 245, 66, 0.14)"
    : isStyle3
      ? "rgba(164, 80, 44, 0.12)"
      : "rgba(99, 102, 241, 0.14)";
  const hoverBg = isStyle2
    ? "rgba(255, 255, 255, 0.06)"
    : isStyle3
      ? "rgba(20, 20, 18, 0.06)"
      : "rgba(0, 0, 0, 0.05)";

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
            minWidth: 172,
            padding: 6,
            position: "absolute",
            top: "calc(100% + 10px)",
          }}
        >
          <div
            style={{
              color: isStyle2
                ? "#96928b"
                : isStyle3
                  ? "#6c685f"
                  : "var(--subtle-foreground)",
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
            <span style={{ flex: 1 }}>Play Sand Drop</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
