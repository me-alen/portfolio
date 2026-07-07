"use client";

import { useEffect, useRef, useState } from "react";

import { syne } from "../fonts";

type GameOverlayProps = {
  title: string;
  url: string;
  onClose: () => void;
};

const OVERLAY_FADE_MS = 280;

export default function GameOverlay({ title, url, onClose }: GameOverlayProps) {
  const [shown, setShown] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setShown(false);
    window.setTimeout(onClose, OVERLAY_FADE_MS);
  };

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const enterFrame = requestAnimationFrame(() => setShown(true));
    closeRef.current?.focus();

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      cancelAnimationFrame(enterFrame);
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", handleKey);
    };
    // Runs once on mount; handleClose only touches stable setters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} — interactive game`}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
      style={{
        background: `rgba(8, 8, 8, ${shown ? 0.92 : 0})`,
        backdropFilter: `blur(${shown ? 10 : 0}px)`,
        WebkitBackdropFilter: `blur(${shown ? 10 : 0}px)`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        inset: 0,
        opacity: shown ? 1 : 0,
        padding:
          "calc(14px + env(safe-area-inset-top)) calc(14px + env(safe-area-inset-right)) calc(14px + env(safe-area-inset-bottom)) calc(14px + env(safe-area-inset-left))",
        position: "fixed",
        transition: `opacity ${OVERLAY_FADE_MS}ms ease, background ${OVERLAY_FADE_MS}ms ease, backdrop-filter ${OVERLAY_FADE_MS}ms ease, -webkit-backdrop-filter ${OVERLAY_FADE_MS}ms ease`,
        zIndex: 2400,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          height: "100%",
          margin: "0 auto",
          maxWidth: 1100,
          opacity: shown ? 1 : 0,
          transform: shown ? "translateY(0)" : "translateY(10px)",
          transition: `opacity ${OVERLAY_FADE_MS}ms ease, transform ${OVERLAY_FADE_MS}ms ease`,
          width: "100%",
        }}
      >
        <header
          style={{
            alignItems: "center",
            color: "#f0ede8",
            display: "flex",
            gap: 16,
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: syne.style.fontFamily,
              fontSize: 18,
              fontWeight: 800,
              letterSpacing: "0.02em",
              textTransform: "uppercase",
            }}
          >
            {title}
          </span>
          <span style={{ alignItems: "center", display: "flex", gap: 18 }}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "rgba(240, 237, 232, 0.7)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.14em",
                textDecoration: "none",
                textTransform: "uppercase",
              }}
            >
              Fullscreen ↗
            </a>
            <button
              ref={closeRef}
              type="button"
              onClick={handleClose}
              aria-label="Close game"
              style={{
                alignItems: "center",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                borderRadius: 999,
                color: "#f0ede8",
                cursor: "pointer",
                display: "inline-flex",
                fontSize: 14,
                height: 36,
                justifyContent: "center",
                lineHeight: 1,
                padding: 0,
                width: 36,
              }}
            >
              ✕
            </button>
          </span>
        </header>

        <div
          style={{
            background: "#000",
            border: "1px solid rgba(255, 255, 255, 0.16)",
            borderRadius: 14,
            flex: 1,
            overflow: "hidden",
            position: "relative",
          }}
        >
          {!loaded ? (
            <span
              style={{
                color: "rgba(240, 237, 232, 0.55)",
                fontSize: 11,
                fontWeight: 600,
                left: "50%",
                letterSpacing: "0.16em",
                position: "absolute",
                textTransform: "uppercase",
                top: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              Loading game…
            </span>
          ) : null}
          <iframe
            src={url}
            title={title}
            onLoad={() => setLoaded(true)}
            allow="fullscreen"
            style={{
              border: 0,
              display: "block",
              height: "100%",
              opacity: loaded ? 1 : 0,
              transition: "opacity 300ms ease",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
