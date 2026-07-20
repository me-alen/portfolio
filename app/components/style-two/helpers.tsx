import type { ReactNode } from "react";

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../../data/portfolio";

export type Profile = {
  name: string;
  role: string;
  intro: string;
  about: string;
};

export type Contact = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

export type ProjectGroup = {
  label: string;
  projects: ProjectItem[];
};

/** Common prop shape shared by every full-page style root (style-2 onward). */
export type StylePageProps = {
  profile: Profile;
  skills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projectGroups: ProjectGroup[];
  contact: Contact;
};

export type DecoratedProject = ProjectItem & {
  category: string;
};

export type SkillGroup = {
  title: string;
  skills: string[];
};

const frontendSkills = new Set([
  "React",
  "Angular",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Redux Toolkit",
  "React Query",
  "GraphQL",
  "Performance Optimization",
  "HTML5",
  "CSS3",
  "Tailwind CSS",
]);

const mobileSkills = new Set(["React Native", "Expo", "IOS", "Android"]);

const backendSkills = new Set([
  "Node.js",
  "NestJS",
  "REST APIs",
  "JWT",
  "OAuth 2.0",
  "Express",
  "PrismaORM",
  "TypeORM",
]);

const toolSkills = new Set([
  "Git",
  "GitHub",
  "GitHub Actions",
  "AWS (EC2, S3, Lambda)",
  "Docker",
  "Linux",
  "CI/CD",
]);

const projectManagementSkills = new Set(["Jira", "Azure DevOps", "Agile/Scrum"]);

const aiSkills = new Set([
  "ChatGPT",
  "Claude",
  "Cursor AI",
  "Copilot",
  "Prompt Engineering",
  "LLM API Integration",
  "OpenSpec",
  "Technical Specification Writing",
  "Documentation Generation",
  "Requirements Analysis",
]);

export function groupSkills(skills: string[]): SkillGroup[] {
  const groups = [
    {
      title: "Frontend Systems",
      skills: skills.filter((skill) => frontendSkills.has(skill)),
    },
    {
      title: "Backend & APIs",
      skills: skills.filter((skill) => backendSkills.has(skill)),
    },
    {
      title: "Mobile Apps",
      skills: skills.filter((skill) => mobileSkills.has(skill)),
    },
    {
      title: "Project Management",
      skills: skills.filter((skill) => projectManagementSkills.has(skill)),
    },
    {
      title: "DevOps & Tools",
      skills: skills.filter((skill) => toolSkills.has(skill)),
    },
    {
      title: "AI & Productivity",
      skills: skills.filter((skill) => aiSkills.has(skill)),
    },
  ];

  return groups.filter((group) => group.skills.length > 0);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function splitName(name: string) {
  const [firstName, ...rest] = name.split(" ");

  return {
    firstName,
    lastName: rest.join(" ") || firstName,
  };
}

export function extractYears(intro: string) {
  return intro.match(/\d+(?:\.\d+)?\+/)?.[0] ?? "6.5+";
}

export function cleanExternalLabel(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

export function flattenProjects(
  projectGroups: ProjectGroup[],
): DecoratedProject[] {
  return projectGroups.flatMap((group) =>
    group.projects.map((project) => ({
      ...project,
      category: group.label,
    })),
  );
}

export function getParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export function SectionHeading({
  label,
  title,
}: {
  label: string;
  title: ReactNode;
}) {
  return (
    <>
      <div className="style2-section-label">{label}</div>
      <h2 className="style2-section-title">{title}</h2>
    </>
  );
}
