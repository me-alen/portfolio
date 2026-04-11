export type ExperienceItem = {
  company: string;
  location: string;
  period: string;
  summary: string;
};

export type ProjectItem = {
  title: string;
  description: string;
  stack: string[];
  period: string;
  githubUrl?: string;
  liveUrl?: string;
};

export type EducationItem = {
  degree: string;
  institution: string;
  period: string;
};

export const profile = {
  name: "Alen Francis",
  role: "Frontend Developer",
  intro:
    "Frontend Developer with 6+ years of experience building responsive, user-focused web and mobile products using Angular, React, React Native, and Next.js.",
  about:
    "I focus on clean UI architecture, smooth product experiences, and fast iteration with modern workflows. I work confidently with Angular, React, React Native, and Next.js, and I use tools and practices like vibe coding, Jira, Azure, and Cursor to collaborate effectively and ship reliable features.",
};

export const skills = [
  "HTML5",
  "CSS3",
  "JavaScript",
  "TypeScript",
  "Angular",
  "React",
  "React Native",
  "Next.js",
  "NestJS",
  "Node.js",
  "Tailwind CSS",
  "MySQL",
  "Redux",
  "Expo",
  "Vibe Coding",
  "JIRA",
  "Azure",
  "Cursor",
  "Git",
];

export const experience: ExperienceItem[] = [
  {
    company: "Innovatise / myFitApp / ClubReady / Xplor Technologies",
    location: "Trivandrum",
    period: "Aug 2023 - Present",
    summary:
      "Building and maintaining Angular, React, and React Native applications with strong focus on performance, scalability, and clean API integration.",
  },
  {
    company: "Good Methods Global / CareStack",
    location: "Trivandrum & Kochi",
    period: "Jul 2022 - Jul 2023",
    summary:
      "Developed React and Angular frontends and NestJS backend services, with JWT/OAuth2 auth, testing, and agile feature delivery.",
  },
  {
    company: "Tenzymes Pvt. Ltd",
    location: "Trivandrum",
    period: "Nov 2020 - Jun 2022",
    summary:
      "Worked across Angular and React web apps with RESTful integrations and collaborated closely with cross-functional teams.",
  },
  {
    company: "Attinad Software",
    location: "Trivandrum",
    period: "Dec 2019 - Nov 2020",
    summary:
      "Delivered Angular-based client projects with responsive UI implementation and strong maintainability standards.",
  },
];

export const personalProjects: ProjectItem[] = [
  {
    title: "ShiftCare",
    description:
      "Built and enhanced web features for care workflow management, focusing on usability, performance, and reliable day-to-day operations.",
    stack: ["React", "Next.js", "TypeScript", "Frontend Architecture"],
    period: "Personal / Product Work",
  },
];

export const clientProjects: ProjectItem[] = [
  {
    title: "Terresta Projects",
    description:
      "Delivered multiple real-estate website experiences for Terresta, implementing responsive UIs, optimized pages, and smooth lead-focused user journeys.",
    stack: ["Next.js", "React", "Tailwind CSS", "Responsive Design"],
    period: "Client Projects",
  },
];

export const companyProjects: ProjectItem[] = [
  {
    title: "CR Connect - ClubReady",
    description:
      "Contributed to a customer engagement platform for SMS and MMS campaigns, helping automate reminders and improve communication response rates.",
    stack: ["React", "Angular", "API Integration"],
    period: "Sep 2023 - Present",
  },
  {
    title: "CR Connect Mobile App (iOS & Android)",
    description:
      "Built cross-platform mobile experiences with Expo and React Native for customer messaging workflows and engagement features.",
    stack: ["React Native", "Expo", "Mobile UX"],
    period: "Sep 2023 - Present",
  },
  {
    title: "CareStack Chrome Extension",
    description:
      "Developed extension features for issue recording and diagnostics, including network and console insights to support faster troubleshooting.",
    stack: ["React", "NestJS", "MySQL", "Chrome Extension"],
    period: "Sep 2022 - Jan 2023",
  },
  {
    title: "SMART (Customer Lifecycle Management)",
    description:
      "Worked on a customer lifecycle platform with React and NestJS, building UI flows and backend integrations to improve customer engagement.",
    stack: ["React", "NestJS", "MySQL"],
    period: "Jan 2023 - Jul 2023",
  },
  {
    title: "HubbleHox Learning Platform",
    description:
      "Contributed to admin, client, and authentication portals with Angular, integrating with backend APIs to deliver consistent user experiences.",
    stack: ["Angular", "Spring Boot", "SQL"],
    period: "Dec 2019 - Jun 2022",
  },
];

export const funProjects: ProjectItem[] = [
  {
    title: "DVD Bounce",
    description:
      "A nostalgic DVD-logo bounce animation project focused on smooth movement, timing, and playful visual behavior.",
    stack: ["JavaScript", "TypeScript", "CSS", "HTML"],
    period: "Fun Project",
    githubUrl: "https://github.com/me-alen/dvd-bounce",
    liveUrl: "https://dvd-bounce-mu.vercel.app",
  },
  {
    title: "Sand Drop",
    description:
      "A creative React/TypeScript sandbox project focused on experimentation with UI behavior, visuals, and interaction ideas.",
    stack: ["TypeScript", "React", "SCSS"],
    period: "Fun Project",
    githubUrl: "https://github.com/me-alen/sand-drop",
    liveUrl: "https://sand-drop.vercel.app",
  },
];

export const education: EducationItem[] = [
  {
    degree: "B Tech in Computer Science Engineering",
    institution: "APJ Abdul Kalam Technological University",
    period: "2015 - 2019",
  },
];

export const contact = {
  email: "alenofficial10@gmail.com",
  phone: "+91 97444 78281",
  location: "Kochi, Kerala, India",
  github: "https://github.com/me-alen",
  linkedin: "https://www.linkedin.com/in/imonlyalen/",
};
