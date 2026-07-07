import "./style-three/style3.css";

import { instrumentSerif } from "../fonts";
import type { EducationItem, ExperienceItem } from "../data/portfolio";
import Style3About from "./style-three/Style3About";
import Style3Capabilities from "./style-three/Style3Capabilities";
import Style3Contact from "./style-three/Style3Contact";
import Style3Experience from "./style-three/Style3Experience";
import Style3Hero from "./style-three/Style3Hero";
import Style3Nav from "./style-three/Style3Nav";
import Style3Works from "./style-three/Style3Works";
import {
  extractYears,
  flattenProjects,
  getParagraphs,
  groupSkills,
  splitName,
  type Contact,
  type Profile,
  type ProjectGroup,
} from "./style-two/helpers";

type PortfolioStyleThreeProps = {
  profile: Profile;
  skills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projectGroups: ProjectGroup[];
  contact: Contact;
};

export default function PortfolioStyleThree({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: PortfolioStyleThreeProps) {
  const { firstName, lastName } = splitName(profile.name);
  const aboutParagraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const works = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);

  return (
    <div className={`portfolio-style-3 ${instrumentSerif.variable}`}>
      <Style3Nav />

      <main>
        <Style3Hero
          firstName={firstName}
          lastName={lastName}
          role={profile.role}
          intro={profile.intro}
          years={years}
          location={contact.location}
        />

        <Style3Works works={works} />

        <Style3About
          paragraphs={aboutParagraphs}
          languages={languages}
          education={education}
          location={contact.location}
        />

        <Style3Experience experience={experience} />

        <Style3Capabilities skillGroups={skillGroups} />

        <Style3Contact contact={contact} name={profile.name} />
      </main>
    </div>
  );
}
