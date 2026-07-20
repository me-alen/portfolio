import "./style-seven/style7.css";

import { manrope, sora } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getInitials,
  getParagraphs,
  groupSkills,
  type StylePageProps,
} from "./style-two/helpers";

function RowLabel({ children }: { children: string }) {
  return <p className="s7b-row-label">{children}</p>;
}

export default function PortfolioStyleSeven({
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
    <div className={`portfolio-style-7 ${sora.variable} ${manrope.variable}`}>
      <main className="s7b-grid">
        <section className="s7b-tile s7b-tile-ink s7b-hero">
          <p className="s7b-eyebrow">Hello, I’m</p>
          <h1>{profile.name}</h1>
          <p className="s7b-hero-role">{profile.role}</p>
          <p className="s7b-hero-intro">{profile.intro}</p>
          <div className="s7b-hero-cta">
            <a className="s7b-btn s7b-btn-accent" href="#s7b-contact">
              Get in touch
            </a>
            <a className="s7b-btn s7b-btn-light" href="#s7b-work">
              See the work
            </a>
          </div>
        </section>

        <section className="s7b-tile s7b-side">
          <p className="s7b-monogram" aria-hidden="true">
            {getInitials(profile.name)}
            <span>.</span>
          </p>
          <p className="s7b-avail">
            <span className="s7b-avail-dot" aria-hidden="true" />
            Available for frontend &amp; fullstack roles
          </p>
          <p className="s7b-side-loc">{contact.location}</p>
        </section>

        <section className="s7b-tile s7b-stat">
          <strong>{years}</strong>
          <span>years of experience</span>
        </section>
        <section className="s7b-tile s7b-stat">
          <strong>{projects.length}</strong>
          <span>projects shipped</span>
        </section>
        <section className="s7b-tile s7b-stat">
          <strong>{experience.length}</strong>
          <span>companies served</span>
        </section>

        <RowLabel>About</RowLabel>

        <section className="s7b-tile s7b-about">
          {aboutParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </section>

        <section className="s7b-tile s7b-facts">
          <div className="s7b-fact">
            <h3>Based in</h3>
            <p>{contact.location}</p>
          </div>
          <div className="s7b-fact">
            <h3>Languages</h3>
            <p>{languages.join(" · ")}</p>
          </div>
          {education.map((item) => (
            <div className="s7b-fact" key={item.degree}>
              <h3>Education</h3>
              <p>
                {item.degree} — {item.institution}, {item.period}
              </p>
            </div>
          ))}
        </section>

        <RowLabel>Capabilities</RowLabel>

        {skillGroups.map((group) => (
          <section className="s7b-tile s7b-skill" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="s7b-chips">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </section>
        ))}

        <RowLabel>Selected work</RowLabel>

        {projects.map((project, index) => (
          <section className="s7b-tile s7b-proj" key={project.title} id={index === 0 ? "s7b-work" : undefined}>
            <p className="s7b-proj-meta">
              {String(index + 1).padStart(2, "0")} · {project.category}
              {project.period !== project.category ? ` · ${project.period}` : ""}
            </p>
            <h3>{project.title}</h3>
            <p className="s7b-proj-desc">{project.description}</p>
            <ul className="s7b-chips">
              {project.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            {project.liveUrl || project.githubUrl ? (
              <p className="s7b-proj-links">
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
              </p>
            ) : null}
          </section>
        ))}

        <RowLabel>Experience</RowLabel>

        {experience.map((job) => (
          <section className="s7b-tile s7b-job" key={job.company}>
            <div className="s7b-job-head">
              <div>
                <h3>{job.company}</h3>
                <p className="s7b-job-role">
                  {job.role} · {job.location}
                </p>
              </div>
              <p className="s7b-job-period">{job.period}</p>
            </div>
            <p className="s7b-job-summary">{job.summary}</p>
            <ul className="s7b-job-bullets">
              {job.bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
            <ul className="s7b-chips">
              {job.stack.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </section>
        ))}

        <section className="s7b-tile s7b-tile-accent s7b-contact" id="s7b-contact">
          <h2>Let’s build the next one together.</h2>
          <p>
            Open to frontend and full-stack opportunities, collaborations,
            product roles, and freelance work.
          </p>
          <a className="s7b-btn s7b-btn-light s7b-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <div className="s7b-contact-links">
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

      <footer className="s7b-footer">
        <span>
          © {year} {profile.name}
        </span>
        <span>{contact.location}</span>
      </footer>
    </div>
  );
}
