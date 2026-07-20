import "./style-four/style4.css";

import { bangers, comicNeue } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  splitName,
  type StylePageProps,
} from "./style-two/helpers";

const BADGE_TONES = ["s4-badge-red", "s4-badge-blue", "s4-badge-yellow"];

export default function PortfolioStyleFour({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: StylePageProps) {
  const { firstName, lastName } = splitName(profile.name);
  const aboutParagraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const projects = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);
  const year = new Date().getFullYear();

  return (
    <div className={`portfolio-style-4 ${bangers.variable} ${comicNeue.variable}`}>
      <main>
        <section className="s4-hero">
          <div className="s4-hero-panel">
            <span className="s4-sticker s4-sticker-role">{profile.role}</span>
            <p className="s4-issue">
              The amazing adventures of… · Vol. {years} yrs
            </p>
            <h1 className="s4-name">
              <span>{firstName}</span>
              <span className="s4-name-last">{lastName}!</span>
            </h1>
            <div className="s4-bubble">
              <p>{profile.intro}</p>
            </div>
            <div className="s4-hero-cta">
              <a className="s4-btn s4-btn-red" href="#s4-projects">
                See the action!
              </a>
              <a className="s4-btn s4-btn-blue" href="#s4-contact">
                Call the hero
              </a>
            </div>
          </div>
        </section>

        <section className="s4-section" id="s4-about">
          <h2 className="s4-heading">
            <span className="s4-heading-burst">#1</span> Origin story
          </h2>
          <div className="s4-caption-stack">
            {aboutParagraphs.map((paragraph, index) => (
              <p className="s4-caption" key={index}>
                {paragraph}
              </p>
            ))}
          </div>
          <div className="s4-meta-row">
            <div className="s4-meta-card">
              <h3>Base of operations</h3>
              <p>{contact.location}</p>
            </div>
            <div className="s4-meta-card">
              <h3>Languages spoken</h3>
              <p>{languages.join(", ")}</p>
            </div>
            {education.map((item) => (
              <div className="s4-meta-card" key={item.degree}>
                <h3>Hero training</h3>
                <p>
                  {item.degree} — {item.institution}, {item.period}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="s4-section" id="s4-skills">
          <h2 className="s4-heading">
            <span className="s4-heading-burst">#2</span> Super powers
          </h2>
          <div className="s4-skill-grid">
            {skillGroups.map((group) => (
              <div className="s4-panel" key={group.title}>
                <h3 className="s4-panel-title">{group.title}</h3>
                <ul className="s4-badges">
                  {group.skills.map((skill, index) => (
                    <li
                      className={`s4-badge ${BADGE_TONES[index % BADGE_TONES.length]}`}
                      key={skill}
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="s4-section" id="s4-experience">
          <h2 className="s4-heading">
            <span className="s4-heading-burst">#3</span> Epic battles
          </h2>
          <div className="s4-strip">
            {experience.map((job) => (
              <article className="s4-panel s4-exp" key={job.company}>
                <span className="s4-sticker s4-sticker-period">{job.period}</span>
                <h3 className="s4-panel-title">{job.company}</h3>
                <p className="s4-exp-role">
                  {job.role} · {job.location}
                </p>
                <p className="s4-exp-summary">{job.summary}</p>
                <ul className="s4-exp-bullets">
                  {job.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
                <ul className="s4-badges">
                  {job.stack.map((tech) => (
                    <li className="s4-badge s4-badge-yellow" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="s4-section" id="s4-projects">
          <h2 className="s4-heading">
            <span className="s4-heading-burst">#4</span> Greatest hits
          </h2>
          <div className="s4-project-grid">
            {projects.map((project, index) => (
              <article className="s4-panel s4-project" key={project.title}>
                <p className="s4-project-meta">
                  Issue #{index + 1} · {project.category}
                </p>
                <h3 className="s4-panel-title">{project.title}</h3>
                <p className="s4-project-desc">{project.description}</p>
                <ul className="s4-badges">
                  {project.stack.map((tech) => (
                    <li className="s4-badge s4-badge-blue" key={tech}>
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.liveUrl || project.githubUrl ? (
                  <div className="s4-project-links">
                    {project.liveUrl ? (
                      <a
                        className="s4-btn s4-btn-red"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Play it!
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        className="s4-btn s4-btn-blue"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="s4-contact" id="s4-contact">
          <div className="s4-hero-panel s4-contact-panel">
            <h2 className="s4-contact-title">Let’s team up!</h2>
            <p className="s4-contact-note">
              Open to frontend and full-stack opportunities, collaborations,
              product roles, and freelance work.
            </p>
            <div className="s4-hero-cta">
              <a className="s4-btn s4-btn-red" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              <a
                className="s4-btn s4-btn-blue"
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
              >
                {contact.phone}
              </a>
            </div>
            <div className="s4-contact-links">
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                {cleanExternalLabel(contact.github)}
              </a>
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cleanExternalLabel(contact.linkedin)}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="s4-footer">
        © {year} {profile.name} · Drawn with code in {contact.location}
      </footer>
    </div>
  );
}
