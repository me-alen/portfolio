import AboutSection from "./AboutSection";
import BackToTopButton from "./BackToTopButton";
import ContactSection from "./ContactSection";
import EducationSection from "./EducationSection";
import ExperienceSection from "./ExperienceSection";
import HeroSection from "./HeroSection";
import ProjectsSection from "./ProjectsSection";
import ScrollProgress from "./ScrollProgress";
import SiteFooter from "./SiteFooter";
import SkillsSection from "./SkillsSection";
import ThemeToggle from "./ThemeToggle";
import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../data/portfolio";

type PortfolioStyleOneProps = {
  profile: {
    name: string;
    intro: string;
    about: string;
  };
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  companyProjects: ProjectItem[];
  personalProjects: ProjectItem[];
  clientProjects: ProjectItem[];
  funProjects: ProjectItem[];
  contact: {
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
  };
};

export default function PortfolioStyleOne({
  profile,
  skills,
  education,
  experience,
  companyProjects,
  personalProjects,
  clientProjects,
  funProjects,
  contact,
}: PortfolioStyleOneProps) {
  return (
    <>
      <ScrollProgress />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-16">
        <div className="mb-8 flex justify-end sm:mb-10">
          <ThemeToggle />
        </div>
        <HeroSection name={profile.name} intro={profile.intro} />
        <AboutSection about={profile.about} />
        <SkillsSection skills={skills} />
        <EducationSection education={education} />
        <ExperienceSection experience={experience} />
        <ProjectsSection
          companyProjects={companyProjects}
          personalProjects={personalProjects}
          clientProjects={clientProjects}
          funProjects={funProjects}
        />
        <ContactSection
          email={contact.email}
          phone={contact.phone}
          location={contact.location}
          github={contact.github}
          linkedin={contact.linkedin}
        />
        <SiteFooter name={profile.name} />
      </main>
      <BackToTopButton />
    </>
  );
}
