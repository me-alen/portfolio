"use client";

import { animate, motion, useMotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

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
    <motion.a
      aria-label="Download resume"
      download
      href={href}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
      style={{
        bottom: 16,
        color: "#ffffff",
        cursor: "pointer",
        display: "block",
        filter: "drop-shadow(0 14px 28px rgba(0, 0, 0, 0.35))",
        height: 100,
        position: "fixed",
        right: 16,
        textDecoration: "none",
        width: 100,
        zIndex: 1200,
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
        <Image
          alt=""
          height={34}
          src="/download.svg"
          width={34}
          style={{
            display: "block",
            height: 34,
            width: 34,
          }}
        />
      </span>
    </motion.a>
  );
}
