import { SectionHeading, type SkillGroup } from "./helpers";

export default function Style2Skills({
  skillGroups,
}: {
  skillGroups: SkillGroup[];
}) {
  return (
    <section className="style2-section" id="skills">
      <SectionHeading
        label="Technical skills"
        title={
          <>
            Product polish,
            <br />
            system depth.
          </>
        }
      />
      <div className="style2-skills-grid">
        {skillGroups.map((group, index) => {
          const shouldSpanFullRow =
            skillGroups.length % 2 === 1 && index === skillGroups.length - 1;

          return (
            <article
              className={`style2-skill-group ${
                shouldSpanFullRow ? "style2-skill-group-wide" : ""
              }`}
              key={group.title}
            >
              <h3 className="style2-skill-title">{group.title}</h3>
              <div className="style2-skill-tags">
                {group.skills.map((skill) => (
                  <span className="style2-skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
