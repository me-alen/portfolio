import type { ExperienceItem } from "../data/portfolio";

type ExperienceSectionProps = {
  experience: ExperienceItem[];
};

export default function ExperienceSection({
  experience,
}: ExperienceSectionProps) {
  return (
    <section id="experience" className="mb-14 sm:mb-20">
      <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">
        Experience
      </h2>
      <div className="grid gap-4 sm:gap-5">
        {experience.map((role) => (
          <article
            key={role.company}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <h3 className="text-base font-semibold sm:text-lg">{role.company}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">{role.period}</p>
            </div>
            <p className="mt-1 text-sm text-[var(--subtle-foreground)]">{role.location}</p>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)] sm:mt-4 sm:text-base sm:leading-8">
              {role.summary}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
