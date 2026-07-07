"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { EASE, MaskedWords } from "./motion";

type Style3HeroProps = {
  firstName: string;
  lastName: string;
  role: string;
  intro: string;
  years: string;
  location: string;
};

export default function Style3Hero({
  firstName,
  lastName,
  role,
  intro,
  years,
  location,
}: Style3HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const nameY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  // Fade the name as the hero exits so its parallax drift never overlaps
  // the meta row or the section below.
  const nameOpacity = useTransform(scrollYProgress, [0.45, 0.85], [1, 0]);
  const metaOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Kolkata",
    });
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);

    return () => window.clearInterval(id);
  }, []);

  const enter = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay, ease: EASE },
        };

  return (
    <section className="s3-hero" ref={ref}>
      <motion.p className="s3-avail" {...enter(0.1)}>
        Available for frontend & fullstack roles — Kochi / Remote
      </motion.p>

      <div className="s3-hero-middle">
        <motion.p className="s3-hero-role" {...enter(0.5)}>
          {role}
        </motion.p>
        <motion.p className="s3-hero-intro" {...enter(0.62)}>
          {intro}
        </motion.p>
      </div>

      <motion.h1
        className="s3-hero-name"
        style={reduce ? undefined : { y: nameY, opacity: nameOpacity }}
      >
        <MaskedWords className="s3-hero-first" text={firstName} delay={0.2} />
        <MaskedWords className="s3-hero-last" text={lastName} delay={0.34} />
      </motion.h1>

      <motion.div style={reduce ? undefined : { opacity: metaOpacity }}>
        <motion.div className="s3-hero-meta" {...enter(0.85)}>
          <div>
            <span className="s3-meta-label">Based in</span>
            <span>
              {location}
              {time ? ` — ${time} IST` : ""}
            </span>
          </div>
          <div>
            <span className="s3-meta-label">Experience</span>
            <span>{years} years</span>
          </div>
          <div className="s3-hero-scroll">
            <span className="s3-meta-label">Scroll</span>
            <span className="s3-scroll-cue" aria-hidden="true" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
