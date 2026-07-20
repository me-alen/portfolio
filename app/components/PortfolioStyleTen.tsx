import "./style-ten/style10.css";

import { saira } from "../fonts";
import {
  cleanExternalLabel,
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  type StylePageProps,
} from "./style-two/helpers";

function Sheet({
  fig,
  title,
  children,
  id,
}: {
  fig: string;
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="s10-sheet" id={id}>
      <p className="s10-fig">
        FIG. {fig} — {title}
      </p>
      {children}
    </section>
  );
}

export default function PortfolioStyleTen({
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
    <div className={`portfolio-style-10 ${saira.variable}`}>
      <main>
        <Sheet fig="01" title="Engineer">
          <h1 className="s10-name">{profile.name}</h1>
          <div className="s10-dim" aria-hidden="true">
            <span className="s10-dim-line" />
            <span className="s10-dim-label">{years} years in service</span>
            <span className="s10-dim-line" />
          </div>
          <p className="s10-role">{profile.role}</p>
          <p className="s10-intro">{profile.intro}</p>
          <div className="s10-hero-cta">
            <a className="s10-btn" href="#s10-parts">
              View assembly details
            </a>
            <a className="s10-btn s10-btn-amber" href="#s10-title-block">
              Request quotation
            </a>
          </div>
        </Sheet>

        <Sheet fig="02" title="Specification">
          <div className="s10-spec">
            {aboutParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="s10-notes">
            <p className="s10-notes-head">General notes</p>
            <ol>
              <li>Base of operations: {contact.location}.</li>
              <li>Operating languages: {languages.join(", ")}.</li>
              {education.map((item) => (
                <li key={item.degree}>
                  Certified: {item.degree}, {item.institution} ({item.period}).
                </li>
              ))}
            </ol>
          </div>
        </Sheet>

        <Sheet fig="03" title="Bill of materials">
          <div className="s10-bom">
            {skillGroups.map((group, groupIndex) => (
              <div className="s10-bom-row" key={group.title}>
                <p className="s10-bom-cat">
                  {String(groupIndex + 1).padStart(2, "0")} ·{" "}
                  {group.title}
                </p>
                <ul className="s10-bom-parts">
                  {group.skills.map((skill) => (
                    <li key={skill}>[ {skill} ]</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Sheet>

        <Sheet fig="04" title="Revision history">
          <div className="s10-revs">
            {experience.map((job, index) => (
              <article className="s10-rev" key={job.company}>
                <div className="s10-rev-head">
                  <span className="s10-rev-no">
                    REV {String(experience.length - index).padStart(2, "0")}
                  </span>
                  <span className="s10-rev-date">{job.period}</span>
                </div>
                <h3 className="s10-rev-company">{job.company}</h3>
                <p className="s10-rev-role">
                  {job.role} · {job.location}
                </p>
                <p className="s10-rev-summary">{job.summary}</p>
                <ul className="s10-rev-bullets">
                  {job.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex}>{bullet}</li>
                  ))}
                </ul>
                <p className="s10-rev-stack">
                  Materials: {job.stack.join(" · ")}
                </p>
              </article>
            ))}
          </div>
        </Sheet>

        <Sheet fig="05" title="Assembly details" id="s10-parts">
          <div className="s10-parts">
            {projects.map((project, index) => (
              <article className="s10-part" key={project.title}>
                <p className="s10-part-no">
                  PART {String(index + 1).padStart(2, "0")} ·{" "}
                  {project.category}
                  {project.period !== project.category
                    ? ` · ${project.period}`
                    : ""}
                </p>
                <h3>{project.title}</h3>
                <p className="s10-part-desc">{project.description}</p>
                <p className="s10-part-stack">
                  Materials: {project.stack.join(" · ")}
                </p>
                {project.liveUrl || project.githubUrl ? (
                  <p className="s10-part-links">
                    {project.liveUrl ? (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Working model ↗
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source drawing ↗
                      </a>
                    ) : null}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </Sheet>

        <Sheet fig="06" title="Title block" id="s10-title-block">
          <h2 className="s10-contact-title">Commission the next build</h2>
          <a className="s10-btn s10-btn-amber s10-email" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <dl className="s10-title-block">
            <div>
              <dt>Drawn by</dt>
              <dd>{profile.name}</dd>
            </div>
            <div>
              <dt>Discipline</dt>
              <dd>{profile.role}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{contact.location}</dd>
            </div>
            <div>
              <dt>Phone</dt>
              <dd>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  {contact.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt>GitHub</dt>
              <dd>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cleanExternalLabel(contact.github)}
                </a>
              </dd>
            </div>
            <div>
              <dt>LinkedIn</dt>
              <dd>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cleanExternalLabel(contact.linkedin)}
                </a>
              </dd>
            </div>
            <div>
              <dt>Sheet</dt>
              <dd>1 of 1 · scale 1:1</dd>
            </div>
            <div>
              <dt>Date</dt>
              <dd>© {year}</dd>
            </div>
          </dl>
        </Sheet>
      </main>

      <footer className="s10-footer">
        <span>
          © {year} {profile.name}
        </span>
        <span>Drawn to scale. Built to last.</span>
      </footer>
    </div>
  );
}
