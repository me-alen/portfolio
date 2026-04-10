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
};

export const profile = {
  name: "Alen Francis",
  role: "Frontend Developer",
  intro:
    "Frontend Developer with nearly 5 years of experience building responsive, user-focused web and mobile applications using Angular, React, and React Native.",
  about:
    "I build modern, scalable interfaces with strong attention to usability, performance, and maintainability. I enjoy collaborating with product, design, and backend teams to ship quality features on time and continuously improve product experience.",
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
  "JIRA",
  "Azure",
  "Git",
];

export const experience: ExperienceItem[] = [
  {
    company: "Innovatise / myFitApp / ClubReady",
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

export const projects: ProjectItem[] = [
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

export const contact = {
  email: "alenofficial10@gmail.com",
  phone: "+91 97444 78281",
  location: "Kochi, Kerala, India",
};
