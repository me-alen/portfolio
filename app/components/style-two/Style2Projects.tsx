import { SectionHeading, type DecoratedProject } from "./helpers";

export default function Style2Projects({
  projects,
}: {
  projects: DecoratedProject[];
}) {
  return (
    <section className="style2-section" id="projects">
      <SectionHeading
        label="Selected projects"
        title={
          <>
            Built for
            <br />
            everyday users.
          </>
        }
      />
      <div className="style2-projects-grid">
        {projects.map((project, index) => (
          <article className="style2-project-card" key={project.title}>
            <div className="style2-project-num">
              {String(index + 1).padStart(2, "0")}
            </div>
            <div className="style2-project-icon" aria-hidden="true">
              {project.category.slice(0, 1)}
            </div>
            <h3 className="style2-project-title">{project.title}</h3>
            <div className="style2-project-company">
              {project.category} - {project.period}
            </div>
            <p className="style2-project-desc">{project.description}</p>
            <div className="style2-project-tags">
              {project.stack.map((item) => (
                <span className="style2-project-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>
            {project.githubUrl || project.liveUrl ? (
              <div className="style2-project-links">
                {project.liveUrl ? (
                  <a
                    href={project.liveUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Live
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a
                    href={project.githubUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Repo
                  </a>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
