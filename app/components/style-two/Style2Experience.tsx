import type { ExperienceItem } from "../../data/portfolio";
import { SectionHeading } from "./helpers";

export default function Style2Experience({
  experience,
}: {
  experience: ExperienceItem[];
}) {
  return (
    <section className="style2-section style2-surface" id="experience">
      <SectionHeading
        label="Work experience"
        title={
          <>
            Built across
            <br />
            real teams.
          </>
        }
      />
      <div className="style2-exp-timeline">
        {experience.map((role) => (
          <article className="style2-exp-item" key={role.company}>
            <div className="style2-exp-left">
              <div className="style2-exp-date">{role.period}</div>
              <div className="style2-exp-company">{role.location}</div>
            </div>
            <div className="style2-exp-right">
              <h3 className="style2-exp-title">{role.company}</h3>
              <p className="style2-exp-project">{role.role}</p>
              <p className="style2-exp-summary">{role.summary}</p>
              <ul className="style2-exp-bullets">
                {role.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
              <div className="style2-exp-stack">
                {role.stack.map((item) => (
                  <span className="style2-exp-tag" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
