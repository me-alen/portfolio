import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import ExperienceSection from "./components/ExperienceSection";
import HeroSection from "./components/HeroSection";
import ProjectsSection from "./components/ProjectsSection";
import SiteFooter from "./components/SiteFooter";
import SkillsSection from "./components/SkillsSection";
import ThemeToggle from "./components/ThemeToggle";
import { contact, experience, profile, projects, skills } from "./data/portfolio";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
      <div className="mb-10 flex justify-end">
        <ThemeToggle />
      </div>
      <HeroSection name={profile.name} intro={profile.intro} />
      <AboutSection about={profile.about} />
      <SkillsSection skills={skills} />
      <ExperienceSection experience={experience} />
      <ProjectsSection projects={projects} />
      <ContactSection
        email={contact.email}
        phone={contact.phone}
        location={contact.location}
      />
      <SiteFooter name={profile.name} />
    </main>
  );
}
