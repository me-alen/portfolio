import type { EducationItem } from "../../data/portfolio";
import HighlightedAboutText from "../HighlightedAboutText";
import { SectionHeading } from "./helpers";

type Style2AboutProps = {
  aboutParagraphs: string[];
  location: string;
  role: string;
  languages: string[];
  email: string;
  education: EducationItem[];
};

export default function Style2About({
  aboutParagraphs,
  location,
  role,
  languages,
  email,
  education,
}: Style2AboutProps) {
  return (
    <section className="style2-section style2-surface" id="about">
      <SectionHeading
        label="About me"
        title={
          <>
            Crafting interfaces
            <br />
            that feel sharp.
          </>
        }
      />
      <div className="style2-about-grid">
        <div className="style2-about-text">
          {aboutParagraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>
              <HighlightedAboutText text={paragraph} />
            </p>
          ))}
          <div className="style2-about-meta">
            <div>{location}</div>
            <div>{role}</div>
            <div>{languages.join(" · ")}</div>
          </div>
        </div>
        <div className="style2-about-side">
          <article className="style2-info-block">
            <div className="style2-info-label">Current focus</div>
            <div className="style2-info-value">
              Frontend architecture and product UI
            </div>
          </article>
          <article className="style2-info-block">
            <div className="style2-info-label">Core stack</div>
            <div className="style2-info-value">
              Angular - React - React Native - Next.js
            </div>
          </article>
          <article className="style2-info-block">
            <div className="style2-info-label">Education</div>
            <div className="style2-info-value">
              {education[0]
                ? `${education[0].degree} - ${education[0].institution}`
                : "Education details available on request"}
            </div>
          </article>
          <article className="style2-info-block">
            <div className="style2-info-label">Email</div>
            <a className="style2-info-value" href={`mailto:${email}`}>
              {email}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
