"use client";

import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";

type ResumeDownloadButtonProps = {
  href?: string;
  text?: string;
  spinDuration?: number;
  onHover?: "slowDown" | "speedUp" | "pause" | "goBonkers";
};

export default function ResumeDownloadButton({
  href = "/Alen.Francis.pdf",
  text = "DOWNLOAD * RESUME * ",
  spinDuration = 12,
  onHover = "speedUp",
}: ResumeDownloadButtonProps) {
  const letters = Array.from(text);
  const rotation = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const [isMobile, setIsMobile] = useState(false);

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

  return (
    <div
      style={{
        bottom: isMobile ? 10 : 16,
        position: "fixed",
        right: isMobile ? 10 : 16,
        transform: isMobile ? "scale(0.68)" : "none",
        transformOrigin: "bottom right",
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
          color: "var(--foreground)",
          borderRadius: "50%",
          cursor: "pointer",
          display: "block",
          filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))",
          height: 100,
          position: "relative",
          textDecoration: "none",
          width: 100,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        whileHover={onHover === "goBonkers" ? { scale: 0.86 } : { scale: 1.04 }}
      >
        <motion.span
          aria-hidden="true"
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
          aria-hidden="true"
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
            aria-hidden="true"
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
      </motion.a>
    </div>
  );
}
