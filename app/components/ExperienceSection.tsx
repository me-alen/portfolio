import type { ExperienceItem } from "../data/portfolio";

type ExperienceSectionProps = {
  experience: ExperienceItem[];
};

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="mb-20">
      <h2 className="mb-6 text-2xl font-semibold">Experience</h2>
      <div className="grid gap-5">
        {experience.map((role) => (
          <article
            key={role.company}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-semibold">{role.company}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">{role.period}</p>
            </div>
            <p className="mt-1 text-sm text-[var(--subtle-foreground)]">{role.location}</p>
            <p className="mt-4 text-[var(--muted-foreground)]">{role.summary}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
