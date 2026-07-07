import type { SkillGroup } from "../style-two/helpers";
import { MaskedWords, Reveal } from "./motion";
import { SkillMark } from "./skillIcons";

export default function Style3Capabilities({
  skillGroups,
}: {
  skillGroups: SkillGroup[];
}) {
  return (
    <section className="s3-section" id="capabilities">
      <header className="s3-head">
        <Reveal>
          <p className="s3-kicker">Capabilities</p>
        </Reveal>
        <h2 className="s3-title">
          <MaskedWords className="s3-title-line" text="Skills &" />
          <MaskedWords
            className="s3-title-line s3-title-italic"
            text="capabilities"
            delay={0.12}
          />
        </h2>
      </header>

      <div>
        {skillGroups.map((group, index) => (
          <div className="s3-cap-row" key={group.title}>
            <Reveal delay={index * 0.03}>
              <h3 className="s3-cap-title">{group.title}</h3>
            </Reveal>
            <Reveal delay={index * 0.03 + 0.08}>
              <ul className="s3-cap-list">
                {group.skills.map((skill) => (
                  <li className="s3-cap-item" key={skill}>
                    <SkillMark skill={skill} />
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
