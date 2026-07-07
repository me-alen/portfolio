"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef } from "react";

import type { EducationItem } from "../../data/portfolio";
import { Reveal } from "./motion";

type Style3AboutProps = {
  paragraphs: string[];
  languages: string[];
  education: EducationItem[];
  location: string;
};

function FadeWord({
  progress,
  range,
  word,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  word: string;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);

  return (
    <motion.span className="s3-lead-word" style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

export default function Style3About({
  paragraphs,
  languages,
  education,
  location,
}: Style3AboutProps) {
  const leadRef = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: leadRef,
    offset: ["start 0.85", "end 0.4"],
  });

  const [lead, ...rest] = paragraphs;
  const words = lead ? lead.split(/\s+/).filter(Boolean) : [];

  return (
    <section className="s3-section" id="about">
      <Reveal>
        <p className="s3-kicker">About</p>
      </Reveal>

      {lead ? (
        <p className="s3-lead" ref={leadRef}>
          {reduce
            ? lead
            : words.map((word, index) => (
                <FadeWord
                  key={`${word}-${index}`}
                  progress={scrollYProgress}
                  range={[
                    index / words.length,
                    Math.min(1, (index + 1) / words.length + 0.04),
                  ]}
                  word={word}
                />
              ))}
        </p>
      ) : null}

      <div className="s3-about-grid">
        <aside className="s3-about-rail">
          <Reveal className="s3-rail-block">
            <span className="s3-meta-label">Based in</span>
            <span className="s3-rail-value">{location}</span>
          </Reveal>
          <Reveal className="s3-rail-block" delay={0.08}>
            <span className="s3-meta-label">Languages</span>
            <span className="s3-rail-value">{languages.join(" · ")}</span>
          </Reveal>
          <Reveal className="s3-rail-block" delay={0.16}>
            <span className="s3-meta-label">Education</span>
            {education.map((item) => (
              <span className="s3-rail-value" key={item.degree}>
                {item.degree}
                <br />
                {item.institution}, {item.period}
              </span>
            ))}
          </Reveal>
        </aside>

        <div className="s3-about-body">
          {rest.map((paragraph, index) => (
            <Reveal key={index} delay={index * 0.06}>
              <p>{paragraph}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
