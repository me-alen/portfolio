import type { DecoratedProject } from "../style-two/helpers";
import { MaskedWords, Reveal } from "./motion";

function WorkEntry({
  project,
  index,
}: {
  project: DecoratedProject;
  index: number;
}) {
  const hasLinks = Boolean(project.githubUrl || project.liveUrl);
  // Some groups reuse their label as the project period ("Client Projects",
  // "Fun Project") — skip the period then so the meta row doesn't repeat.
  const normalize = (value: string) => value.toLowerCase().replace(/s$/, "");
  const showPeriod =
    normalize(project.period) !== normalize(project.category);

  return (
    <article className="s3-work">
      <div className="s3-work-inner">
        <Reveal>
          <div className="s3-work-meta">
            <span className="s3-work-index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{project.category}</span>
            {showPeriod ? <span>{project.period}</span> : null}
          </div>
          <h3 className="s3-work-title">{project.title}</h3>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="s3-work-desc">{project.description}</p>
          <ul className="s3-tagline">
            {project.stack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
          {hasLinks ? (
            <div className="s3-work-links">
              {project.liveUrl ? (
                <a
                  className="s3-link"
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live site ↗
                </a>
              ) : null}
              {project.githubUrl ? (
                <a
                  className="s3-link"
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub ↗
                </a>
              ) : null}
            </div>
          ) : null}
        </Reveal>
      </div>
    </article>
  );
}

export default function Style3Works({ works }: { works: DecoratedProject[] }) {
  return (
    <section className="s3-section" id="work">
      <header className="s3-head">
        <Reveal>
          <p className="s3-kicker">Selected work · {works.length} projects</p>
        </Reveal>
        <h2 className="s3-title">
          <MaskedWords className="s3-title-line" text="Selected" />
          <MaskedWords
            className="s3-title-line s3-title-italic"
            text="works"
            delay={0.12}
          />
        </h2>
      </header>

      <div>
        {works.map((project, index) => (
          <WorkEntry
            key={`${project.title}-${project.category}`}
            project={project}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
