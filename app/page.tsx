import AboutSection from "./components/AboutSection";
import BackToTopButton from "./components/BackToTopButton";
import ContactSection from "./components/ContactSection";
import EducationSection from "./components/EducationSection";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import ScrollProgress from "./components/ScrollProgress";
import SiteFooter from "./components/SiteFooter";
import SkillsSection from "./components/SkillsSection";
import ThemeToggle from "./components/ThemeToggle";
import {
  companyProjects,
  contact,
  clientProjects,
  education,
  experience,
  funProjects,
  personalProjects,
  profile,
  skills,
} from "./data/portfolio";

export default function Home() {
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
