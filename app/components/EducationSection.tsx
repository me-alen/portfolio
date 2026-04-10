import type { EducationItem } from "../data/portfolio";

type EducationSectionProps = {
  education: EducationItem[];
};

export default function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education" className="mb-14 sm:mb-20">
      <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">
        Education
      </h2>
      <div className="grid gap-4 sm:gap-5">
        {education.map((item) => (
          <article
            key={`${item.degree}-${item.institution}`}
            className="rounded-2xl border border-[var(--border-color)] bg-[var(--card-bg)] p-4 sm:p-6"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-base font-semibold sm:text-lg">{item.degree}</h3>
              <p className="text-sm text-[var(--subtle-foreground)]">
                {item.period}
              </p>
            </div>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
              {item.institution}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
