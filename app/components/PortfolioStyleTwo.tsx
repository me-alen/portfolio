import { dmMono, fraunces, syne } from "../fonts";
import type {
  EducationItem,
  ExperienceItem,
} from "../data/portfolio";
import Style2About from "./style-two/Style2About";
import Style2Contact from "./style-two/Style2Contact";
import Style2Education from "./style-two/Style2Education";
import Style2Experience from "./style-two/Style2Experience";
import Style2Footer from "./style-two/Style2Footer";
import Style2Hero from "./style-two/Style2Hero";
import Style2Marquee from "./style-two/Style2Marquee";
import Style2Nav from "./style-two/Style2Nav";
import Style2Projects from "./style-two/Style2Projects";
import Style2Skills from "./style-two/Style2Skills";
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

type PortfolioStyleTwoProps = {
  profile: Profile;
  skills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projectGroups: ProjectGroup[];
  contact: Contact;
};

export default function PortfolioStyleTwo({
  profile,
  skills,
  languages,
  education,
  experience,
  projectGroups,
  contact,
}: PortfolioStyleTwoProps) {
  const { firstName, lastName } = splitName(profile.name);
  const aboutParagraphs = getParagraphs(profile.about);
  const skillGroups = groupSkills(skills);
  const allProjects = flattenProjects(projectGroups);
  const years = extractYears(profile.intro);
  const stats = [
    { value: years, label: "Years of experience" },
    { value: `${allProjects.length}+`, label: "Projects shipped" },
    { value: `${skills.length}+`, label: "Tools in stack" },
    { value: `${experience.length}`, label: "Companies served" },
  ];

  return (
    <div
      className={`portfolio-style-2 ${syne.variable} ${dmMono.variable} ${fraunces.variable}`}
    >
      <Style2Nav />

      <main>
        <Style2Hero
          firstName={firstName}
          lastName={lastName}
          role={profile.role}
          intro={profile.intro}
          stats={stats}
        />

        <Style2Marquee skills={skills} />

        <Style2About
          aboutParagraphs={aboutParagraphs}
          location={contact.location}
          role={profile.role}
          languages={languages}
          email={contact.email}
          education={education}
        />

        <Style2Skills skillGroups={skillGroups} />

        <Style2Experience experience={experience} />

        <Style2Projects projects={allProjects} />

        <Style2Education education={education} />

        <Style2Contact contact={contact} />
      </main>

      <Style2Footer name={profile.name} role={profile.role} />
    </div>
  );
}
