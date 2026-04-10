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
            className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{project.title}</h3>
              <p className="text-sm text-zinc-400">{project.period}</p>
            </div>
            <p className="mt-3 text-zinc-300">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200"
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
