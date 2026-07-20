import "./style-eight/style8.css";

import { baloo } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  splitName,
  type StylePageProps,
} from "./style-two/helpers";

const CARD_TONES = ["s8-tone-pink", "s8-tone-lav", "s8-tone-mint", "s8-tone-sun"];

export default function PortfolioStyleEight({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: StylePageProps) {
  const { firstName } = splitName(profile.name);
  const aboutParagraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const projects = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);
  const year = new Date().getFullYear();

  return (
    <div className={`portfolio-style-8 ${baloo.variable}`}>
      <div className="s8-blob s8-blob-a" aria-hidden="true" />
      <div className="s8-blob s8-blob-b" aria-hidden="true" />

      <main>
        <section className="s8-hero">
          <p className="s8-chip">Hi there, I’m {firstName} 👋</p>
          <h1 className="s8-name">{profile.name}</h1>
          <p className="s8-role">{profile.role}</p>
          <p className="s8-intro">{profile.intro}</p>
          <div className="s8-hero-cta">
            <a className="s8-btn s8-btn-pink" href="#s8-contact">
              Say hello
            </a>
            <a className="s8-btn s8-btn-lav" href="#s8-projects">
              See my toys
            </a>
          </div>
          <ul className="s8-stats">
            <li>
              <strong>{years}</strong> years of fun
            </li>
            <li>
              <strong>{projects.length}</strong> projects shipped
            </li>
            <li>
              <strong>{experience.length}</strong> teams joined
            </li>
          </ul>
        </section>

        <section className="s8-section">
          <h2 className="s8-h2">A little about me</h2>
          <div className="s8-about">
            {aboutParagraphs.map((paragraph, index) => (
              <div
                className={`s8-card ${CARD_TONES[index % CARD_TONES.length]}`}
                key={index}
              >
                <p>{paragraph}</p>
              </div>
            ))}
          </div>
          <div className="s8-fact-row">
            <div className="s8-card s8-tone-mint">
              <h3>Where I live</h3>
              <p>{contact.location}</p>
            </div>
            <div className="s8-card s8-tone-sun">
              <h3>Words I speak</h3>
              <p>{languages.join(" · ")}</p>
            </div>
            {education.map((item) => (
              <div className="s8-card s8-tone-pink" key={item.degree}>
                <h3>Where I learned</h3>
                <p>
                  {item.degree}, {item.institution} ({item.period})
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="s8-section">
          <h2 className="s8-h2">Things I’m good at</h2>
          <div className="s8-skill-grid">
            {skillGroups.map((group, index) => (
              <div
                className={`s8-card ${CARD_TONES[index % CARD_TONES.length]}`}
                key={group.title}
              >
                <h3>{group.title}</h3>
                <ul className="s8-pills">
                  {group.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="s8-section">
          <h2 className="s8-h2">Places I’ve played</h2>
          <div className="s8-timeline">
            {experience.map((job, index) => (
              <article
                className={`s8-card s8-job ${CARD_TONES[index % CARD_TONES.length]}`}
                key={job.company}
              >
                <p className="s8-job-period">{job.period}</p>
                <h3>{job.company}</h3>
                <p className="s8-job-role">
                  {job.role} · {job.location}
                </p>
                <p className="s8-job-summary">{job.summary}</p>
                <ul className="s8-dots">
                  {job.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
                <ul className="s8-pills">
                  {job.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="s8-section" id="s8-projects">
          <h2 className="s8-h2">Stuff I’ve built</h2>
          <div className="s8-project-grid">
            {projects.map((project, index) => (
              <article
                className={`s8-card s8-project ${CARD_TONES[index % CARD_TONES.length]}`}
                key={project.title}
              >
                <p className="s8-project-cat">{project.category}</p>
                <h3>{project.title}</h3>
                <p className="s8-project-desc">{project.description}</p>
                <ul className="s8-pills">
                  {project.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                {project.liveUrl || project.githubUrl ? (
                  <div className="s8-project-links">
                    {project.liveUrl ? (
                      <a
                        className="s8-btn s8-btn-pink"
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Try it
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        className="s8-btn s8-btn-lav"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Peek inside
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="s8-contact" id="s8-contact">
          <div className="s8-card s8-tone-lav s8-contact-card">
            <h2 className="s8-contact-title">Let’s be friends!</h2>
            <p>
              Open to frontend and full-stack opportunities, collaborations,
              product roles, and freelance work.
            </p>
            <a className="s8-btn s8-btn-pink s8-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <div className="s8-contact-links">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                {contact.phone}
              </a>
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

      <footer className="s8-footer">
        Made with sprinkles by {profile.name} · © {year}
      </footer>
    </div>
  );
}
