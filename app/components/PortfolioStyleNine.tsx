import "./style-nine/style9.css";

import { pressStart, vt323 } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  type StylePageProps,
} from "./style-two/helpers";

export default function PortfolioStyleNine({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: StylePageProps) {
  const aboutParagraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const projects = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);
  const year = new Date().getFullYear();

  return (
    <div className={`portfolio-style-9 ${pressStart.variable} ${vt323.variable}`}>
      <div className="s9-scanlines" aria-hidden="true" />

      <main>
        <section className="s9-hero">
          <p className="s9-pixel s9-blink">Player 1 · Ready</p>
          <h1 className="s9-name">{profile.name}</h1>
          <p className="s9-class">
            Class: {profile.role} · LV {years}
          </p>
          <div className="s9-frame s9-hero-frame">
            <p>{profile.intro}</p>
          </div>
          <div className="s9-hero-cta">
            <a className="s9-btn" href="#s9-scores">
              ▶ High scores
            </a>
            <a className="s9-btn s9-btn-magenta" href="#s9-contact">
              ▶ 2-player mode
            </a>
          </div>
        </section>

        <section className="s9-section">
          <h2 className="s9-h2">
            <span className="s9-pixel">Level 1</span> Character bio
          </h2>
          <div className="s9-frame">
            {aboutParagraphs.map((paragraph, index) => (
              <p className="s9-bio" key={index}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="s9-hud">
            <div className="s9-frame s9-hud-item">
              <p className="s9-pixel s9-hud-label">Spawn point</p>
              <p>{contact.location}</p>
            </div>
            <div className="s9-frame s9-hud-item">
              <p className="s9-pixel s9-hud-label">Dialogue options</p>
              <p>{languages.join(" · ")}</p>
            </div>
            {education.map((item) => (
              <div className="s9-frame s9-hud-item" key={item.degree}>
                <p className="s9-pixel s9-hud-label">Tutorial completed</p>
                <p>
                  {item.degree} — {item.institution} ({item.period})
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="s9-section">
          <h2 className="s9-h2">
            <span className="s9-pixel">Level 2</span> Inventory
          </h2>
          <div className="s9-inv-grid">
            {skillGroups.map((group) => (
              <div className="s9-frame s9-inv" key={group.title}>
                <h3 className="s9-pixel s9-inv-title">{group.title}</h3>
                <ul className="s9-chips">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="s9-section">
          <h2 className="s9-h2">
            <span className="s9-pixel">Level 3</span> Quest log
          </h2>
          <div className="s9-quests">
            {experience.map((job) => (
              <article className="s9-frame s9-quest" key={job.company}>
                <p className="s9-pixel s9-quest-period">{job.period}</p>
                <h3 className="s9-quest-title">{job.company}</h3>
                <p className="s9-quest-role">
                  {job.role} — {job.location}
                </p>
                <p className="s9-quest-summary">{job.summary}</p>
                <ul className="s9-log">
                  {job.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
                <ul className="s9-chips">
                  {job.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="s9-section" id="s9-scores">
          <h2 className="s9-h2">
            <span className="s9-pixel">Level 4</span> High scores
          </h2>
          <div className="s9-scores">
            {projects.map((project, index) => (
              <article className="s9-frame s9-score" key={project.title}>
                <p className="s9-pixel s9-score-rank">
                  #{String(index + 1).padStart(2, "0")} · {project.category}
                </p>
                <h3 className="s9-score-title">{project.title}</h3>
                <p className="s9-score-desc">{project.description}</p>
                <p className="s9-score-stack">{project.stack.join(" · ")}</p>
                {project.liveUrl || project.githubUrl ? (
                  <div className="s9-score-links">
                    {project.liveUrl ? (
                      <a
                        className="s9-btn"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ▶ Insert coin
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        className="s9-btn s9-btn-magenta"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ▶ Source
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="s9-contact" id="s9-contact">
          <p className="s9-pixel s9-blink">Continue?</p>
          <h2 className="s9-contact-title">Press start to collaborate</h2>
          <a className="s9-email" href={`mailto:${contact.email}`}>
            {contact.email}<span className="s9-cursor" aria-hidden="true">_</span>
          </a>
          <div className="s9-contact-links">
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              {contact.phone}
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              {cleanExternalLabel(contact.github)}
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              {cleanExternalLabel(contact.linkedin)}
            </a>
          </div>
        </section>
      </main>

      <footer className="s9-footer">
        <span>
          © {year} {profile.name}
        </span>
        <span className="s9-pixel">Game over? Never.</span>
      </footer>
    </div>
  );
}
