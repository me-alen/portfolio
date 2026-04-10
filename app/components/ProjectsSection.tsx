import type { ProjectItem } from "../data/portfolio";

type ProjectsSectionProps = {
  projects: ProjectItem[];
};

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="mb-14 sm:mb-20">
      <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">
        Projects
      </h2>
      <div className="grid gap-4 sm:gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <h3 className="text-lg font-semibold sm:text-xl">{project.title}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">{project.period}</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
              {project.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-[var(--chip-bg)] px-2.5 py-1 text-[11px] text-[var(--soft-foreground)] sm:px-3 sm:text-xs"
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
