import type { ExperienceItem } from "../../data/portfolio";
import { MaskedWords, Reveal } from "./motion";

export default function Style3Experience({
  experience,
}: {
  experience: ExperienceItem[];
}) {
  return (
    <section className="s3-section" id="experience">
      <header className="s3-head">
        <Reveal>
          <p className="s3-kicker">
            Experience · {experience.length} companies
          </p>
        </Reveal>
        <h2 className="s3-title">
          <MaskedWords className="s3-title-line" text="Where I’ve" />
          <MaskedWords
            className="s3-title-line s3-title-italic"
            text="worked"
            delay={0.12}
          />
        </h2>
      </header>

      <div>
        {experience.map((job) => (
          <article className="s3-exp-item" key={job.company}>
            <div className="s3-exp-rail">
              <Reveal>
                <p className="s3-exp-period">{job.period}</p>
                <h3 className="s3-exp-company">{job.company}</h3>
                <p className="s3-exp-location">{job.location}</p>
              </Reveal>
            </div>

            <div className="s3-exp-body">
              <Reveal>
                <p className="s3-exp-role">{job.role}</p>
                <p className="s3-exp-summary">{job.summary}</p>
              </Reveal>
              <ul className="s3-exp-bullets">
                {job.bullets.map((bullet, index) => (
                  <li key={index}>
                    <Reveal delay={0.06 + index * 0.05} y={18}>
                      {bullet}
                    </Reveal>
                  </li>
                ))}
              </ul>
              <Reveal delay={0.1}>
                <ul className="s3-tagline">
                  {job.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
