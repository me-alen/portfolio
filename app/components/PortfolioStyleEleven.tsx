"use client";

import "./style-eleven/style11.css";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { bebasNeue, caveat, plusJakarta } from "../fonts";
import HighlightedAboutText from "./HighlightedAboutText";
import Style11Tour from "./style-eleven/Style11Tour";
import { SkillMark } from "./style-three/skillIcons";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getInitials,
  getParagraphs,
  groupSkills,
  splitName,
  type StylePageProps,
} from "./style-two/helpers";

const SECTIONS = [
  { id: "s11-about", label: "About" },
  { id: "s11-experience", label: "Experience" },
  { id: "s11-projects", label: "Projects" },
  { id: "s11-stack", label: "Stack" },
  { id: "s11-contact", label: "Contact" },
];

// Hero cards show these experience bullets verbatim, found by keyword.
const HIGHLIGHTS = [
  { keyword: "WebSocket", tag: "Real-time" },
  { keyword: "CI/CD", tag: "Delivery" },
  { keyword: "Chrome Extension", tag: "Product" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const shortCompany = (company: string) => company.split(" — ")[0];

function Marker({ index, name }: { index: number; name: string }) {
  return (
    <div className="s11-marker" aria-hidden="true" data-l>
      <span>{`// ${pad(index)}.00 SEC_${name}`}</span>
      <span className="s11-marker-line" />
      <span>{`INDEX [${pad(index)} / ${pad(SECTIONS.length)}]`}</span>
    </div>
  );
}

function Heading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: string;
  sub?: string;
}) {
  return (
    <header className="s11-head">
      <p className="s11-eyebrow">{eyebrow}</p>
      <h2 className="s11-h2">{title}</h2>
      {sub ? <p className="s11-sub">{sub}</p> : null}
    </header>
  );
}

export default function PortfolioStyleEleven({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: StylePageProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [touring, setTouring] = useState(true);
  const endTour = useCallback(() => setTouring(false), []);
  const [activeSection, setActiveSection] = useState("");
  const [tab, setTab] = useState(0);
  const [filter, setFilter] = useState("All");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const { firstName } = splitName(profile.name);
  const paragraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const projects = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);
  const [current, ...previous] = experience;
  const categories = projectGroups
    .filter((group) => group.projects.length > 0)
    .map((group) => group.label);
  const shown =
    filter === "All"
      ? projects
      : projects.filter((project) => project.category === filter);
  const highlights = HIGHLIGHTS.flatMap(({ keyword, tag }) => {
    const job = experience.find((item) =>
      item.bullets.some((bullet) => bullet.includes(keyword)),
    );
    const bullet = job?.bullets.find((item) => item.includes(keyword));
    return job && bullet
      ? [{ keyword, tag, company: shortCompany(job.company), bullet }]
      : [];
  });
  const year = new Date().getFullYear();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable; the mailto link next to the button still works.
    }
  };

  return (
    <>
      {/* First in tab order, so keyboard users reach the skip button first. */}
      {touring ? (
        <Style11Tour
          rootRef={rootRef}
          initials={getInitials(profile.name)}
          onDone={endTour}
        />
      ) : null}
      <div
        ref={rootRef}
        className={`portfolio-style-11 ${bebasNeue.variable} ${caveat.variable} ${plusJakarta.variable}`}
        data-tour={touring ? "on" : "off"}
      >
        <nav className="s11-nav" aria-label="Portfolio sections" data-l>
          <ul className="s11-nav-links">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className={
                    activeSection === section.id ? "is-active" : undefined
                  }
                  aria-current={
                    activeSection === section.id ? "true" : undefined
                  }
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="s11-nav-status">
            <span className="s11-avail" data-l>
              <span className="s11-dot" aria-hidden="true" />
              Available
            </span>
            <a className="s11-nav-cta" href="#s11-contact">
              Let’s talk →
            </a>
          </div>
        </nav>

        <main>
          <section className="s11-hero">
            <p className="s11-hero-word" aria-hidden="true">
              PORTFOLIO
            </p>

            <div className="s11-hero-grid">
              <div className="s11-hero-copy">
                <p className="s11-hello">Hello, I’m</p>
                <h1 className="s11-name">{firstName}.</h1>
                <p className="s11-role">
                  <span className="s11-dot" aria-hidden="true" />
                  {profile.role}
                </p>
                <p className="s11-intro">
                  <HighlightedAboutText text={profile.intro} />
                </p>
                <div className="s11-cta">
                  <a className="s11-btn s11-btn-red" href="#s11-contact">
                    Start a conversation →
                  </a>
                  <a className="s11-btn" href="#s11-projects">
                    Explore projects
                  </a>
                </div>
                <div className="s11-stats" data-l>
                  <div className="s11-stat">
                    <strong>{years}</strong>
                    <span>Years experience</span>
                  </div>
                  <div className="s11-stat">
                    <strong>{projects.length}</strong>
                    <span>Projects shipped</span>
                  </div>
                  <div className="s11-stat">
                    <strong>{experience.length}</strong>
                    <span>Companies</span>
                  </div>
                </div>
              </div>

              <div className="s11-photo" data-l>
                <div className="s11-photo-frame" aria-hidden="true" />
                <div className="s11-photo-panel">
                  <Image
                    className="s11-photo-img"
                    src="/alen-cutout.png"
                    alt={profile.name}
                    width={960}
                    height={960}
                    preload
                    sizes="(min-width: 1080px) 400px, (min-width: 720px) 45vw, 88vw"
                  />
                  <span className="s11-photo-fade" aria-hidden="true" />
                </div>
                <p className="s11-photo-badge">
                  <span className="s11-dot" aria-hidden="true" />
                  Open to new roles
                </p>
              </div>

              <div className="s11-hero-side">
                {highlights.map((item, index) => (
                  <article className="s11-card" key={item.keyword} data-l>
                    <div className="s11-card-top">
                      <span className="s11-num" data-l>{pad(index + 1)}.</span>
                      <span className="s11-tag" data-l>{item.tag}</span>
                    </div>
                    <h3>{item.company}</h3>
                    <p>{item.bullet}</p>
                  </article>
                ))}
                <ul className="s11-chips">
                  {skills.slice(0, 6).map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="s11-section" id="s11-about">
            <Marker index={1} name="ABOUT" />
            <Heading eyebrow="Engineer profile" title="Background & Craft" />
            <div className="s11-card s11-about" data-l>
              <div className="s11-about-copy">
                {paragraphs.map((paragraph, index) => (
                  <p key={index}>
                    <HighlightedAboutText text={paragraph} />
                  </p>
                ))}
              </div>
              <ol className="s11-facts">
                <li>
                  <span className="s11-num" data-l>01</span>
                  <div>
                    <h3>Based in</h3>
                    <p>{contact.location}</p>
                  </div>
                </li>
                <li>
                  <span className="s11-num" data-l>02</span>
                  <div>
                    <h3>Languages</h3>
                    <p>{languages.join(" · ")}</p>
                  </div>
                </li>
                {education.map((item, index) => (
                  <li key={item.degree}>
                    <span className="s11-num" data-l>{pad(index + 3)}</span>
                    <div>
                      <h3>Education</h3>
                      <p>
                        {item.degree}, {item.institution} · {item.period}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="s11-section" id="s11-experience">
            <Marker index={2} name="EXPERIENCE" />
            <Heading
              eyebrow="Career showcase"
              title="Flagship Roles"
              sub={`${experience.length} companies · ${years} years building web and mobile products.`}
            />

            {current ? (
              <article className="s11-card s11-featured" data-l>
                <div className="s11-featured-top">
                  <span className="s11-badge" data-l>
                    <span className="s11-dot" aria-hidden="true" />
                    Current role
                  </span>
                  <span className="s11-meta" data-l>
                    {current.role} · {current.period}
                  </span>
                </div>
                <h3 className="s11-featured-title">{current.company}</h3>
                <p className="s11-featured-summary">{current.summary}</p>

                <div className="s11-tiles">
                  <div className="s11-tile" data-l>
                    <strong data-l>{current.period.split(" - ")[0]}</strong>
                    <span data-l>Joined</span>
                  </div>
                  <div className="s11-tile" data-l>
                    <strong data-l>{current.bullets.length}</strong>
                    <span data-l>Key achievements</span>
                  </div>
                  <div className="s11-tile" data-l>
                    <strong data-l>{current.stack.length}</strong>
                    <span data-l>Technologies</span>
                  </div>
                  <div className="s11-tile" data-l>
                    <strong data-l>{current.location}</strong>
                    <span data-l>Location</span>
                  </div>
                </div>

                <p className="s11-label">Key achievements</p>
                <p className="s11-hint">Select an achievement to inspect it</p>
                <div className="s11-tabs">
                  {current.bullets.map((bullet, index) => (
                    <button
                      type="button"
                      key={index}
                      aria-pressed={tab === index}
                      onClick={() => setTab(index)}
                    >
                      {`A${index + 1}: ${bullet
                        .split(" ")
                        .slice(0, 3)
                        .join(" ")
                        .replace(/[,.:;]+$/, "")}`}
                    </button>
                  ))}
                </div>
                <div className="s11-tab-panel" aria-live="polite">
                  <p className="s11-panel-label">
                    {`Achievement ${pad(tab + 1)} // ${shortCompany(current.company)}`}
                  </p>
                  <p className="s11-panel-text">{current.bullets[tab]}</p>
                  <ul className="s11-chips">
                    {current.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ) : null}

            <div className="s11-grid">
              {previous.map((job) => (
                <article className="s11-card s11-job" key={job.company} data-l>
                  <span className="s11-tag s11-tag-red" data-l>{job.role}</span>
                  <h3>{job.company}</h3>
                  <p>{job.summary}</p>
                  <ul className="s11-dots">
                    {job.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                  <ul className="s11-chips">
                    {job.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                  <div className="s11-job-foot">
                    <span className="s11-chip" data-l>{job.period}</span>
                    <span className="s11-chip" data-l>{job.location}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="s11-section" id="s11-projects">
            <Marker index={3} name="PROJECTS" />
            <Heading
              eyebrow="Selected work"
              title="The Project Index"
              sub={`${projects.length} projects across company, client, personal and fun work.`}
            />
            <div className="s11-filters" role="group" aria-label="Filter projects">
              {["All", ...categories].map((category) => (
                <button
                  type="button"
                  key={category}
                  aria-pressed={filter === category}
                  onClick={() => setFilter(category)}
                >
                  {category === "All"
                    ? `All Projects (${projects.length})`
                    : category}
                </button>
              ))}
            </div>
            <div className="s11-grid">
              {shown.map((project) => {
                const number = projects.indexOf(project) + 1;
                const showPeriod =
                  project.period.toLowerCase().replace(/s$/, "") !==
                  project.category.toLowerCase().replace(/s$/, "");

                return (
                  <article
                    className="s11-card s11-project"
                    key={project.title}
                    data-l
                  >
                    <div className="s11-card-top">
                      <span className="s11-tag s11-tag-red" data-l>
                        {project.category.replace(" Projects", "")}
                      </span>
                      <span className="s11-id" data-l>#PRJ-{pad(number)}</span>
                    </div>
                    <h3>{project.title}</h3>
                    {showPeriod ? (
                      <p className="s11-meta">{project.period}</p>
                    ) : null}
                    <p>{project.description}</p>
                    <ul className="s11-chips">
                      {project.stack.map((tech) => (
                        <li key={tech}>{tech}</li>
                      ))}
                    </ul>
                    {project.liveUrl || project.githubUrl ? (
                      <div className="s11-project-links">
                        {project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Live ↗
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            GitHub ↗
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>

          <section className="s11-section" id="s11-stack">
            <Marker index={4} name="STACK" />
            <Heading eyebrow="Capabilities" title="The Toolkit" />
            <div className="s11-grid">
              {skillGroups.map((group, index) => (
                <article className="s11-card" key={group.title} data-l>
                  <div className="s11-card-top">
                    <span className="s11-num" data-l>{pad(index + 1)}</span>
                    <span className="s11-tag" data-l>{group.skills.length} tools</span>
                  </div>
                  <h3>{group.title}</h3>
                  <ul className="s11-chips s11-chips-icons">
                    {group.skills.map((skill) => (
                      <li key={skill}>
                        <SkillMark skill={skill} />
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section className="s11-contact-wrap" id="s11-contact">
            <Marker index={5} name="CONTACT" />
            <div className="s11-card s11-contact" data-l>
              <p className="s11-eyebrow">Get in touch</p>
              <h2 className="s11-contact-title">
                Let’s build something together.
              </h2>
              <p className="s11-contact-note">
                Open to frontend and full-stack opportunities, collaborations,
                product roles, and freelance work.
              </p>
              <div className="s11-email-row">
                <a className="s11-email" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
                <button
                  type="button"
                  className="s11-btn s11-btn-red"
                  onClick={copyEmail}
                >
                  {copied ? "Copied ✓" : "Copy email"}
                </button>
              </div>
              <span className="s11-sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
              <div className="s11-socials">
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cleanExternalLabel(contact.github)}
                </a>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cleanExternalLabel(contact.linkedin)}
                </a>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  {contact.phone}
                </a>
              </div>
              <p className="s11-contact-foot">
                © {year} {profile.name} · {contact.location}
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
