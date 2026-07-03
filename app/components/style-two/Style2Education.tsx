import type { EducationItem } from "../../data/portfolio";
import { SectionHeading } from "./helpers";

export default function Style2Education({
  education,
}: {
  education: EducationItem[];
}) {
  return (
    <section className="style2-section style2-surface" id="education">
      <SectionHeading
        label="Education"
        title={
          <>
            Always
            <br />
            learning.
          </>
        }
      />
      <div className="style2-edu-grid">
        {education.map((item) => (
          <article
            className="style2-edu-card"
            key={`${item.degree}-${item.institution}`}
          >
            <div className="style2-corner" aria-hidden="true" />
            <div className="style2-edu-icon" aria-hidden="true">
              EDU
            </div>
            <h3 className="style2-edu-title">{item.degree}</h3>
            <p className="style2-edu-sub">{item.institution}</p>
            <p className="style2-edu-year">{item.period}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
