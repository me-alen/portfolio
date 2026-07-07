"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

export const EASE = [0.16, 1, 0.3, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  duration?: number;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.25,
  duration = 0.9,
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

type MaskedWordsProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
};

/**
 * Splits text into words and reveals each from behind a clipping mask.
 * A visually-hidden copy keeps the full text available to screen readers.
 */
export function MaskedWords({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  duration = 1,
}: MaskedWordsProps) {
  const reduce = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean);

  if (reduce) {
    return <span className={className}>{text}</span>;
  }

  // The in-view trigger lives on the (unclipped) container: the words start
  // translated outside their overflow-hidden masks, so an observer on the
  // words themselves would never see them intersect.
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <span className="s3-sr-only">{text}</span>
      <span aria-hidden="true" style={{ display: "contents" }}>
        {words.map((word, index) => (
          <span className="s3-mask" key={`${word}-${index}`}>
            <motion.span
              className="s3-mask-word"
              variants={{
                hidden: { y: "115%" },
                visible: {
                  y: "0%",
                  transition: {
                    duration,
                    delay: delay + index * stagger,
                    ease: EASE,
                  },
                },
              }}
            >
              {word}
              {index < words.length - 1 ? " " : null}
            </motion.span>
          </span>
        ))}
      </span>
    </motion.span>
  );
}

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

/** Pulls its child toward the cursor. Mouse pointers only — inert on touch. */
export function Magnetic({ children, className, strength = 0.22 }: MagneticProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 240, damping: 22, mass: 0.6 });

  const handleMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || event.pointerType !== "mouse" || !ref.current) {
      return;
    }
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-block" }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}
