import "./style-five/style5.css";

import { cormorant, dmMono } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  splitName,
  type StylePageProps,
} from "./style-two/helpers";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

function SectionLabel({ index, children }: { index: number; children: string }) {
  return (
    <p className="s5-label">
      <span aria-hidden="true">{ROMAN[index]}.</span> {children}
    </p>
  );
}

export default function PortfolioStyleFive({
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
    <div className={`portfolio-style-5 ${cormorant.variable} ${dmMono.variable}`}>
      <main>
        <section className="s5-hero">
          <p className="s5-eyebrow">Portfolio of a {profile.role}</p>
          <h1 className="s5-name">
            <span>{firstName}</span>
            <em>{lastName}</em>
          </h1>
          <div className="s5-rule" aria-hidden="true" />
          <p className="s5-hero-intro">{profile.intro}</p>
          <p className="s5-hero-meta">
            {contact.location} · {years} years of craft
          </p>
        </section>

        <section className="s5-section">
          <SectionLabel index={0}>About</SectionLabel>
          <div className="s5-prose">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <dl className="s5-facts">
            <div>
              <dt>Residence</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{languages.join(" · ")}</dd>
            </div>
            {education.map((item) => (
              <div key={item.degree}>
                <dt>Education</dt>
                <dd>
                  {item.degree}
                  <br />
                  {item.institution}, {item.period}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="s5-section">
          <SectionLabel index={1}>Selected works</SectionLabel>
          <div className="s5-works">
            {projects.map((project, index) => (
              <article className="s5-work" key={project.title}>
                <p className="s5-work-no">
                  {String(index + 1).padStart(2, "0")} — {project.category}
                </p>
                <h3 className="s5-work-title">{project.title}</h3>
                <p className="s5-work-desc">{project.description}</p>
                <p className="s5-mono">{project.stack.join(" / ")}</p>
                {project.liveUrl || project.githubUrl ? (
                  <p className="s5-work-links">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        GitHub
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="s5-section">
          <SectionLabel index={2}>Experience</SectionLabel>
          <div className="s5-exp-list">
            {experience.map((job) => (
              <article className="s5-exp" key={job.company}>
                <p className="s5-mono">{job.period}</p>
                <h3 className="s5-exp-company">{job.company}</h3>
                <p className="s5-exp-role">
                  {job.role} — {job.location}
                </p>
                <p className="s5-exp-summary">{job.summary}</p>
                <ul className="s5-exp-bullets">
                  {job.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))}
                </ul>
                <p className="s5-mono s5-exp-stack">{job.stack.join(" · ")}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="s5-section">
          <SectionLabel index={3}>Capabilities</SectionLabel>
          <div className="s5-cap-list">
            {skillGroups.map((group) => (
              <div className="s5-cap" key={group.title}>
                <h3>{group.title}</h3>
                <p>{group.skills.join(" · ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="s5-section s5-contact">
          <SectionLabel index={4}>Correspondence</SectionLabel>
          <h2 className="s5-contact-title">
            Shall we make <em>something exquisite?</em>
          </h2>
          <a className="s5-contact-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <p className="s5-contact-links">
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              {contact.phone}
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              {cleanExternalLabel(contact.github)}
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
              {cleanExternalLabel(contact.linkedin)}
            </a>
          </p>
        </section>
      </main>

      <footer className="s5-footer">
        <span>
          © {year} {profile.name}
        </span>
        <span>{contact.location}</span>
      </footer>
    </div>
  );
}
