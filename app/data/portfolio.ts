export type ExperienceItem = {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  bullets: string[];
  stack: string[];
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
  role: "Senior Software Engineer ( Frontend / Fullstack )",
  intro:
    "Senior Software Engineer with 6.5+ years of experience building responsive, user-focused web and mobile products using Angular, React, React Native, and Next.js.",
  about:
  `I’m a Senior Software Engineer with 6.5+ years of experience building scalable web and mobile applications using React, Next.js, Angular, React Native, TypeScript, and modern JavaScript technologies. I enjoy designing clean frontend architectures, creating intuitive user experiences, and developing high-quality software that is performant, maintainable, and built to scale. I’m comfortable working across the full product development lifecycle, collaborating with cross-functional teams to deliver reliable features for both web and cross-platform mobile applications.

Throughout my career, I’ve contributed to customer-facing products by building reusable component libraries, integrating APIs, optimizing application performance, and implementing real-time features. I enjoy working closely with designers, backend engineers, QA teams, and DevOps engineers to transform ideas into production-ready solutions, while following modern development practices such as Git workflows, CI/CD automation, code reviews, Agile methodologies, and technical specification writing.

I’m passionate about continuously improving the way software is built by embracing modern development tools and emerging technologies. I actively use AI-assisted workflows with Cursor AI, Claude Code and GitHub Copilot to accelerate development, improve code quality, and streamline technical documentation. I enjoy exploring new frameworks, best practices, and engineering approaches that enable teams to iterate faster, build better products, and deliver meaningful experiences to users.`
};

export const languages = [
  "English",
  "Hindi",
  "Malayalam",
  "Tamil",
  "Kannada",
  "German",
  "Japanese",
];

export const skills = [
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
  "React Native",
  "Expo",
  "IOS",
  "Android",
  "Node.js",
  "NestJS",
  "REST APIs",
  "JWT",
  "OAuth 2.0",
  "Express",
  "PrismaORM",
  "TypeORM",
  "Git",
  "GitHub",
  "GitHub Actions",
  "AWS (EC2, S3, Lambda)",
  "Docker",
  "Linux",
  "CI/CD",
  "Jira",
  "Azure DevOps",
  "Agile/Scrum",
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
];

export const experience: ExperienceItem[] = [
  {
    company: "Xplor Technologies (ClubReady) — formerly Innovatise / myFitApp",
    role: "Senior Frontend Engineer",
    location: "Trivandrum",
    period: "Aug 2023 - Present",
    summary:
      "Building and maintaining Angular, React, and React Native applications with strong focus on performance, scalability, and clean API integration.",
    bullets: [
      "Develop and maintain ClubReady Connect across web (Angular), mobile (React Native/Expo for iOS and Android), and an embeddable JS/React widget, including customer engagement features like SMS/MMS messaging, templates, and automated workflows.",
      "Re-architected real-time communication by replacing polling with WebSocket/SSE across web, mobile, and widget, cutting update latency from ~5 seconds to near real-time.",
      "Reduced crash rate, bundle size, and load time by upgrading the web app from Angular 13 to Angular 18 and migrating the widget from vanilla JavaScript to React.",
      "Cut CI/CD build times across platforms: web from 15–20 min to under 3 min, iOS from 35–40 min to 5–6 min, and Android from 30–35 min to 7–8 min.",
      "Integrate ClubReady Connect with ClubReady CORE CRM to synchronize member and prospect data.",
    ],
    stack: [
      "React",
      "React Native",
      "Expo",
      "Angular",
      "TypeScript",
      "REST APIs",
      "Git",
      "Azure DevOps",
      "Jira",
    ],
  },
  {
    company: "Good Methods Global / CareStack",
    role: "Fullstack Developer",
    location: "Trivandrum & Kochi",
    period: "Jul 2022 - Jul 2023",
    summary:
      "Developed React and Angular frontends and NestJS backend services, with JWT/OAuth2 auth, testing, and agile feature delivery.",
    bullets: [
      "Built and shipped the CareStack Chrome Extension — capturing screen recordings, voice-over, network activity, and system diagnostics — to 2,500+ dental practices, cutting customer-issue diagnostic turnaround from a 2+ day minimum to near-instant.",
      "Developed the SMART Customer Lifecycle Management platform using React and NestJS.",
      "Implemented authentication and authorization using JWT and OAuth 2.0.",
      "Developed and integrated REST APIs using NestJS to support core platform features.",
      "Used Redux for complex state management and Jest for automated testing.",
    ],
    stack: [
      "React",
      "Angular",
      "NestJS",
      "Redux",
      "TypeScript",
      "Jest",
      "MySQL",
      "REST APIs",
      "Git",
    ],
  },
  {
    company: "Tenzymes Pvt. Ltd",
    role: "Fullstack Developer",
    location: "Trivandrum",
    period: "Nov 2020 - Jun 2022",
    summary:
      "Worked across Angular and React web apps with RESTful integrations and collaborated closely with cross-functional teams.",
    bullets: [
      "Contributed to the HubbleHox Learning Platform, building Admin, Client, and Authentication portals.",
      "Developed responsive UIs using Angular, integrated with backend services built on Spring Boot and SQL.",
      "Collaborated with designers and backend developers to deliver end-to-end solutions.",
      "Implemented reusable component architecture and state management solutions.",
    ],
    stack: [
      "Angular",
      "React",
      "Redux",
      "TypeScript",
      ".NET",
      "Spring Boot",
      "SQL",
      "REST APIs",
      "Git",
    ],
  },
  {
    company: "Attinad Software",
    role: "Junior Frontend Developer",
    location: "Trivandrum",
    period: "Dec 2019 - Nov 2020",
    summary:
      "Delivered Angular-based client projects with responsive UI implementation and strong maintainability standards.",
    bullets: [
      "Built responsive user interfaces using Angular Material and ngx-bootstrap.",
      "Integrated frontend applications with backend APIs using HTTP services and observables.",
    ],
    stack: [
      "Angular",
      "Angular Material",
      "ngx-bootstrap",
      "TypeScript",
      "REST APIs",
      "Git",
    ],
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
  linkedin: "https://www.linkedin.com/in/alenfrancis/",
};
