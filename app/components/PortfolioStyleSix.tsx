import "./style-six/style6.css";

import { archivo } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  type StylePageProps,
} from "./style-two/helpers";

function SectionHead({ no, title }: { no: string; title: string }) {
  return (
    <header className="s6-head">
      <span className="s6-no">{no}</span>
      <h2>{title}</h2>
    </header>
  );
}

export default function PortfolioStyleSix({
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
    <div className={`portfolio-style-6 ${archivo.variable}`}>
      <div className="s6-topbar" aria-hidden="true" />
      <header className="s6-masthead">
        <div>
          <p className="s6-cap">Name</p>
          <p className="s6-val">{profile.name}</p>
        </div>
        <div>
          <p className="s6-cap">Role</p>
          <p className="s6-val">{profile.role}</p>
        </div>
        <div>
          <p className="s6-cap">Location</p>
          <p className="s6-val">{contact.location}</p>
        </div>
        <div>
          <p className="s6-cap">Experience</p>
          <p className="s6-val">{years} years</p>
        </div>
      </header>

      <main>
        <section className="s6-hero">
          <h1>
            frontend &amp;<br />
            fullstack<br />
            engineering<span className="s6-red">.</span>
          </h1>
          <p className="s6-hero-intro">{profile.intro}</p>
        </section>

        <section className="s6-section">
          <SectionHead no="01" title="about" />
          <div className="s6-about-grid">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section className="s6-section">
          <SectionHead no="02" title="projects" />
          <div className="s6-table" role="list">
            {projects.map((project, index) => (
              <article className="s6-row" role="listitem" key={project.title}>
                <span className="s6-row-no">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="s6-row-main">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  {project.liveUrl || project.githubUrl ? (
                    <p className="s6-row-links">
                      {project.liveUrl ? (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          live ↗
                        </a>
                      ) : null}
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          github ↗
                        </a>
                      ) : null}
                    </p>
                  ) : null}
                </div>
                <div className="s6-row-side">
                  <p className="s6-cap">{project.category}</p>
                  <p className="s6-val-sm">{project.period}</p>
                  <p className="s6-stack">{project.stack.join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="s6-section">
          <SectionHead no="03" title="experience" />
          <div className="s6-table">
            {experience.map((job) => (
              <article className="s6-row" key={job.company}>
                <span className="s6-row-no s6-red">{job.period}</span>
                <div className="s6-row-main">
                  <h3>{job.company}</h3>
                  <p className="s6-val-sm">
                    {job.role} — {job.location}
                  </p>
                  <p>{job.summary}</p>
                  <ul className="s6-bullets">
                    {job.bullets.map((bullet, index) => (
                      <li key={index}>{bullet}</li>
                    ))}
                  </ul>
                </div>
                <div className="s6-row-side">
                  <p className="s6-stack">{job.stack.join(", ")}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="s6-section">
          <SectionHead no="04" title="skills" />
          <div className="s6-table">
            {skillGroups.map((group) => (
              <div className="s6-row s6-row-skill" key={group.title}>
                <span className="s6-row-no">{group.title}</span>
                <p className="s6-skill-list">{group.skills.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="s6-section">
          <SectionHead no="05" title="education" />
          <div className="s6-table">
            {education.map((item) => (
              <div className="s6-row s6-row-skill" key={item.degree}>
                <span className="s6-row-no">{item.period}</span>
                <p className="s6-skill-list">
                  {item.degree}, {item.institution}
                </p>
              </div>
            ))}
            <div className="s6-row s6-row-skill">
              <span className="s6-row-no">languages</span>
              <p className="s6-skill-list">{languages.join(", ")}</p>
            </div>
          </div>
        </section>

        <section className="s6-section s6-contact">
          <SectionHead no="06" title="contact" />
          <a className="s6-email" href={`mailto:${contact.email}`}>
            {contact.email}
            <span className="s6-red">→</span>
          </a>
          <div className="s6-contact-grid">
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

      <footer className="s6-footer">
        <span>
          © {year} {profile.name}
        </span>
        <span>set in archivo — grid 12/64</span>
      </footer>
    </div>
  );
}
