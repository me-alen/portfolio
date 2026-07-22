"use client";

import { useEffect, useRef, useState } from "react";

import { syne } from "../fonts";
import { STYLE_OPTIONS } from "../styleConfig";
import type { PortfolioStyle } from "../styleConfig";

type StyleIntroOverlayProps = {
  onSelect: (style: PortfolioStyle) => void;
  onClose: () => void;
  onPlayGame: () => void;
};

const OVERLAY_FADE_MS = 340;
const STEP_FADE_MS = 220;

export default function StyleIntroOverlay({
  onSelect,
  onClose,
  onPlayGame,
}: StyleIntroOverlayProps) {
  const [hovered, setHovered] = useState<PortfolioStyle | "game" | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [doneHover, setDoneHover] = useState(false);
  const [shown, setShown] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const firstOptionRef = useRef<HTMLButtonElement>(null);
  const doneRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const enterFrame = requestAnimationFrame(() => setShown(true));

    return () => {
      cancelAnimationFrame(enterFrame);
      document.body.style.overflow = overflow;
    };
  }, []);

  useEffect(() => {
    if (!contentVisible) {
      return;
    }
    if (confirmed) {
      doneRef.current?.focus();
    } else {
      firstOptionRef.current?.focus();
    }
  }, [confirmed, contentVisible]);

  const handleSelect = (style: PortfolioStyle) => {
    onSelect(style);
    setContentVisible(false);
    window.setTimeout(() => {
      setConfirmed(true);
      setContentVisible(true);
    }, STEP_FADE_MS);
  };

  const handleClose = () => {
    setShown(false);
    window.setTimeout(onClose, OVERLAY_FADE_MS);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="style-intro-heading"
      style={{
        alignItems: "center",
        backdropFilter: `blur(${shown ? 14 : 0}px)`,
        WebkitBackdropFilter: `blur(${shown ? 14 : 0}px)`,
        background: `rgba(10, 11, 10, ${shown ? 0.72 : 0})`,
        boxSizing: "border-box",
        display: "flex",
        inset: 0,
        justifyContent: "center",
        opacity: shown ? 1 : 0,
        padding: 24,
        position: "fixed",
        transition: `opacity ${OVERLAY_FADE_MS}ms ease, background ${OVERLAY_FADE_MS}ms ease, backdrop-filter ${OVERLAY_FADE_MS}ms ease, -webkit-backdrop-filter ${OVERLAY_FADE_MS}ms ease`,
        zIndex: 2000,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          color: "#f0ede8",
          maxHeight: "100%",
          maxWidth: 520,
          opacity: contentVisible ? 1 : 0,
          overflowY: "auto",
          padding: "4px 2px",
          textAlign: "center",
          transform: contentVisible ? "translateY(0)" : "translateY(8px)",
          transition: `opacity ${STEP_FADE_MS}ms ease, transform ${STEP_FADE_MS}ms ease`,
          width: "100%",
        }}
      >
        {confirmed ? (
          <>
            <h2
              id="style-intro-heading"
              style={{
                fontFamily: syne.style.fontFamily,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              You&apos;re all set
            </h2>
            <p
              style={{
                color: "rgba(240, 237, 232, 0.72)",
                fontSize: 14,
                lineHeight: 1.5,
                margin: "12px auto 28px",
                maxWidth: 340,
              }}
            >
              Want to change the style later? Just click the initials in the
              top-left corner anytime.
            </p>
            <button
              ref={doneRef}
              type="button"
              onClick={handleClose}
              onMouseEnter={() => setDoneHover(true)}
              onMouseLeave={() => setDoneHover(false)}
              style={{
                background: doneHover ? "#d6ff5c" : "#c8f542",
                border: "none",
                borderRadius: 999,
                color: "#101110",
                cursor: "pointer",
                fontSize: 15,
                fontWeight: 700,
                padding: "12px 32px",
                transition: "background 0.15s ease",
              }}
            >
              Got it
            </button>
          </>
        ) : (
          <>
            <h2
              id="style-intro-heading"
              style={{
                fontFamily: syne.style.fontFamily,
                fontSize: 30,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Choose your style
            </h2>
            <p
              style={{
                color: "rgba(240, 237, 232, 0.72)",
                fontSize: 14,
                lineHeight: 1.5,
                margin: "12px auto 28px",
                maxWidth: 340,
              }}
            >
              This portfolio comes in more than one look. Pick the one you like
              to get started.
            </p>

            <div
              style={{
                display: "grid",
                gap: 10,
                gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              }}
            >
              {STYLE_OPTIONS.map((option, index) => {
                const isHover = hovered === option.id;

                return (
                  <button
                    key={option.id}
                    ref={index === 0 ? firstOptionRef : undefined}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    onMouseEnter={() => setHovered(option.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      alignItems: "center",
                      background: isHover
                        ? "rgba(255, 255, 255, 0.12)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      borderRadius: 10,
                      color: "#f0ede8",
                      cursor: "pointer",
                      display: "flex",
                      fontSize: 14,
                      fontWeight: 600,
                      gap: 11,
                      padding: "11px 13px",
                      textAlign: "left",
                      transition: "background 0.15s ease",
                      width: "100%",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        background: option.tileBg,
                        border: "1px solid rgba(255, 255, 255, 0.28)",
                        borderRadius: 6,
                        flex: "0 0 auto",
                        height: 24,
                        overflow: "hidden",
                        position: "relative",
                        width: 36,
                      }}
                    >
                      <span
                        style={{
                          background: option.swatch,
                          bottom: 0,
                          position: "absolute",
                          right: 0,
                          top: 0,
                          width: 12,
                        }}
                      />
                    </span>
                    <span style={{ flex: 1 }}>{option.label}</span>
                  </button>
                );
              })}
            </div>

            <div
              aria-hidden="true"
              style={{
                alignItems: "center",
                color: "rgba(240, 237, 232, 0.45)",
                display: "flex",
                fontSize: 11,
                gap: 12,
                letterSpacing: "0.14em",
                margin: "18px 0",
                textTransform: "uppercase",
              }}
            >
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.16)",
                  flex: 1,
                  height: 1,
                }}
              />
              or
              <span
                style={{
                  background: "rgba(255, 255, 255, 0.16)",
                  flex: 1,
                  height: 1,
                }}
              />
            </div>

            <button
              type="button"
              onClick={onPlayGame}
              onMouseEnter={() => setHovered("game")}
              onMouseLeave={() => setHovered(null)}
              style={{
                alignItems: "center",
                background:
                  hovered === "game"
                    ? "rgba(255, 255, 255, 0.12)"
                    : "transparent",
                border: "1px dashed rgba(255, 255, 255, 0.3)",
                borderRadius: 10,
                color: "#f0ede8",
                cursor: "pointer",
                display: "flex",
                fontSize: 15,
                fontWeight: 600,
                gap: 12,
                justifyContent: "center",
                padding: "14px 16px",
                textAlign: "center",
                transition: "background 0.15s ease",
                width: "100%",
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 11 }}>
                ▶
              </span>
              Play Pour an Ocean — a game I built
            </button>
          </>
        )}
      </div>
    </div>
  );
}
