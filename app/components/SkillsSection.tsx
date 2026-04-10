type SkillsSectionProps = {
  skills: string[];
};

export default function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="mb-20">
      <h2 className="mb-6 text-2xl font-semibold">Skills</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
