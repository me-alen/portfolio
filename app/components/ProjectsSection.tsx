import type { ProjectItem } from "../data/portfolio";

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="mb-20">
      <h2 className="mb-6 text-2xl font-semibold">Projects</h2>
      <div className="grid gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">{project.period}</p>
            </div>
            <p className="mt-3 text-[var(--muted-foreground)]">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--chip-bg)] px-3 py-1 text-xs text-[var(--soft-foreground)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
