"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

type ResumeDownloadButtonProps = {
  href?: string;
  text?: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
};

const BUTTON_SIZE = 100;

export default function ResumeDownloadButton({
  href = "/Alen.Francis.pdf",
  text = "DOWNLOAD * RESUME * ",
  spinDuration = 12,
  onHover = "speedUp",
}: ResumeDownloadButtonProps) {
  const letters = Array.from(text);
  const rotation = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  // Overlap with the nearest [data-resume-dark-zone] section:
  // null → fully over a light background; 0 → fully inside a dark zone;
  // >0 → the zone's top edge in the button's local coordinates (split point).
  const [darkSplit, setDarkSplit] = useState<number | null>(null);

  const startSpin = (duration: number) => {
    animationRef.current?.stop();

    const start = rotation.get();
    animationRef.current = animate(rotation, start + 360, {
      duration,
      ease: "linear",
      repeat: Infinity,
    });
  };

  useEffect(() => {
    startSpin(spinDuration);

    return () => {
      animationRef.current?.stop();
    };
    // startSpin intentionally reads the latest motion value.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinDuration, text]);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);

    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = wrapperRef.current;
      if (!el) {
        return;
      }

      const rect = el.getBoundingClientRect();
      // The wrapper is scaled down on mobile; convert viewport px to the
      // button's local coordinates so clip-path offsets line up.
      const scale = rect.height ? rect.height / BUTTON_SIZE : 1;
      let next: number | null = null;

      for (const zone of document.querySelectorAll("[data-resume-dark-zone]")) {
        const zoneRect = zone.getBoundingClientRect();
        if (zoneRect.top < rect.bottom && zoneRect.bottom > rect.top) {
          next = Math.max((zoneRect.top - rect.top) / scale, 0);
          break;
        }
      }

      setDarkSplit((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!frame) {
        frame = requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Re-measure when the active portfolio style (and its sections) changes.
    const observer = new MutationObserver(schedule);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-portfolio-style"],
    });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
    };
  }, []);

  const handleHoverStart = () => {
    switch (onHover) {
      case "slowDown":
        startSpin(spinDuration * 2);
        break;
      case "pause":
        animationRef.current?.stop();
        break;
      case "goBonkers":
        startSpin(spinDuration / 20);
        break;
      case "speedUp":
      default:
        startSpin(spinDuration / 4);
        break;
    }
  };

  const handleHoverEnd = () => {
    startSpin(spinDuration);
  };

  // One visual copy of the button in a single color. While the button
  // straddles a dark-zone edge, both copies render, each clipped to its own
  // side of the boundary so the color splits exactly at the section line.
  const renderFace = (variant: "light" | "dark") => {
    let clipPath: string | undefined;
    if (darkSplit !== null && darkSplit > 0) {
      clipPath =
        variant === "light"
          ? `inset(0 0 calc(100% - ${darkSplit}px) 0)`
          : `inset(${darkSplit}px 0 0 0)`;
    }

    const faceStyle: CSSProperties = {
      clipPath,
      color:
        variant === "light"
          ? "var(--resume-btn-color, var(--foreground))"
          : "var(--resume-btn-dark-color, var(--resume-btn-color, var(--foreground)))",
      display: "block",
      inset: 0,
      position: "absolute",
    };

    return (
      <span aria-hidden="true" style={faceStyle}>
        <motion.span
          style={{
            display: "block",
            height: "100%",
            left: 0,
            pointerEvents: "none",
            position: "absolute",
            rotate: rotation,
            top: 0,
            width: "100%",
          }}
        >
          {letters.map((letter, index) => {
            const rotationDeg = (360 / letters.length) * index - 44;

            return (
              <span
                key={`${letter}-${index}`}
                style={{
                  alignItems: "center",
                  display: "inline-flex",
                  fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
                  fontSize: 10,
                  fontWeight: 900,
                  height: 30,
                  justifyContent: "center",
                  left: "50%",
                  lineHeight: 1,
                  marginLeft: -15,
                  marginTop: -15,
                  position: "absolute",
                  textAlign: "center",
                  textTransform: "uppercase",
                  top: "50%",
                  transform: `rotate(${rotationDeg}deg) translateY(-32px)`,
                  transformOrigin: "center",
                  width: 30,
                }}
              >
                {letter}
              </span>
            );
          })}
        </motion.span>
        <span
          style={{
            alignItems: "center",
            display: "flex",
            height: 46,
            justifyContent: "center",
            left: "50%",
            pointerEvents: "none",
            position: "absolute",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 46,
          }}
        >
          <svg
            viewBox="0 0 496.38 496.38"
            width={30}
            height={30}
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={16.380705}
            style={{ display: "block" }}
          >
            <path d="M354.688,266.832V0h-212.99v266.832H18.639l229.548,229.553l229.558-229.553H354.688z M66.178,286.524h95.212V19.692h173.606v266.832h95.212L248.188,468.539L66.178,286.524z" />
          </svg>
        </span>
      </span>
    );
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        bottom: isMobile ? 10 : 16,
        height: BUTTON_SIZE,
        position: "fixed",
        right: isMobile ? 10 : 16,
        transform: isMobile ? "scale(0.68)" : "none",
        transformOrigin: "bottom right",
        width: BUTTON_SIZE,
        zIndex: 1200,
      }}
    >
      <motion.a
        aria-label="Download resume"
        download
        href={href}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
        style={{
          borderRadius: "50%",
          cursor: "pointer",
          display: "block",
          filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))",
          height: "100%",
          position: "relative",
          textDecoration: "none",
          width: "100%",
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        whileHover={onHover === "goBonkers" ? { scale: 0.86 } : { scale: 1.04 }}
      >
        {darkSplit === null || darkSplit > 0 ? renderFace("light") : null}
        {darkSplit !== null ? renderFace("dark") : null}
      </motion.a>
    </div>
  );
}
