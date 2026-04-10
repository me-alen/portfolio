type SkillsSectionProps = {
  skills: string[];
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="mb-14 sm:mb-20">
      <h2 className="mb-5 text-xl font-semibold sm:mb-6 sm:text-2xl">Skills</h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-[var(--border-color)] px-3 py-1.5 text-xs text-[var(--soft-foreground)] sm:px-4 sm:py-2 sm:text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
