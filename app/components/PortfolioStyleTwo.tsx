import { DM_Mono, Fraunces, Syne } from "next/font/google";
import type { ReactNode } from "react";

import type {
  EducationItem,
  ExperienceItem,
  ProjectItem,
} from "../data/portfolio";
import HighlightedAboutText from "./HighlightedAboutText";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-display",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-mono",
  weight: ["300", "400"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-style2-serif",
  axes: ["opsz"],
});

const styleTwoCss = `
.portfolio-style-2{--style2-bg:#080908;--style2-surface:#101110;--style2-card:#141513;--style2-border:rgba(240,237,232,.1);--style2-accent:#c8f542;--style2-accent-2:#ff6b35;--style2-text:#f0ede8;--style2-muted:#96928b;--style2-soft:rgba(240,237,232,.68);position:relative;min-height:100vh;overflow-x:hidden;background:var(--style2-bg);color:var(--style2-text);font-family:var(--font-style2-mono),monospace;font-size:14px;line-height:1.7}
.portfolio-style-2 *,.portfolio-style-2 *::before,.portfolio-style-2 *::after{box-sizing:border-box}.portfolio-style-2::before{content:"";position:fixed;inset:0;z-index:999;pointer-events:none;opacity:.2;background-image:radial-gradient(rgba(255,255,255,.12) .7px,transparent .7px);background-size:4px 4px}.portfolio-style-2 ::selection{background:var(--style2-accent);color:#000}.portfolio-style-2 a{color:inherit;text-decoration:none}
.style2-nav{position:fixed;inset:0 0 auto;z-index:100;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--style2-border);background:rgba(8,9,8,.86);padding:20px 48px;backdrop-filter:blur(16px)}.style2-nav-logo,.style2-footer-left{font-family:var(--font-style2-display),sans-serif;font-weight:800;letter-spacing:.06em}.style2-nav-logo{font-size:16px}.style2-nav-logo span,.style2-footer-left span,.style2-accent{color:var(--style2-accent)}.style2-nav-links{display:flex;gap:32px}.style2-nav-links a{color:var(--style2-muted);font-size:12px;letter-spacing:.1em;text-transform:uppercase;transition:color .2s}.style2-nav-links a:hover{color:var(--style2-accent)}
.style2-hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.72fr);min-height:100vh;overflow:hidden;padding:112px 48px 72px}.style2-hero-left,.style2-hero-right{display:flex;flex-direction:column;justify-content:center}.style2-hero-left{padding-right:48px}.style2-hero-right{align-items:flex-end;gap:20px}.style2-hero-tag{display:inline-flex;width:fit-content;align-items:center;gap:8px;border:1px solid rgba(200,245,66,.3);border-radius:2px;background:rgba(200,245,66,.1);color:var(--style2-accent);font-size:11px;letter-spacing:.12em;line-height:1.5;padding:6px 14px;text-transform:uppercase}.style2-hero-tag::before{content:"";width:6px;height:6px;border-radius:999px;background:var(--style2-accent);animation:style2-blink 1.5s infinite;flex:0 0 auto}@keyframes style2-blink{0%,100%{opacity:1}50%{opacity:.25}}
.style2-hero-name{display:flex;flex-direction:column;margin:32px 0 24px;font-family:var(--font-style2-display),sans-serif;font-size:80px;font-weight:800;letter-spacing:0;line-height:.95;text-transform:uppercase}.style2-outline{color:transparent;-webkit-text-stroke:1px rgba(240,237,232,.42)}.style2-hero-role{margin-bottom:24px;color:var(--style2-muted);font-family:var(--font-style2-serif),serif;font-size:22px;font-style:italic;font-weight:300}.style2-hero-desc,.style2-about-text p,.style2-contact-left p{color:var(--style2-soft);font-size:14px;line-height:1.85}.style2-hero-cta{display:flex;flex-wrap:wrap;gap:16px;margin-top:40px}.style2-btn-primary,.style2-btn-outline{display:inline-flex;min-height:46px;align-items:center;justify-content:center;border-radius:2px;padding:12px 28px;font-family:var(--font-style2-display),sans-serif;font-size:13px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;transition:transform .2s,border-color .2s,background .2s,color .2s}.portfolio-style-2 a.style2-btn-primary,.portfolio-style-2 a.style2-btn-primary:visited{background:var(--style2-accent);color:#000}.style2-btn-outline{border:1px solid var(--style2-border);color:var(--style2-text)}.style2-btn-primary:hover,.style2-btn-outline:hover{transform:translateY(-2px)}.style2-btn-outline:hover{border-color:var(--style2-accent);color:var(--style2-accent)}
.style2-stat-card{position:relative;width:220px;overflow:hidden;border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-card);padding:24px 28px;transition:border-color .2s}.style2-stat-card:hover{border-color:rgba(200,245,66,.34)}.style2-stat-card::before{content:"";position:absolute;inset:0 0 auto;height:2px;background:var(--style2-accent)}.style2-stat-num{color:var(--style2-accent);font-family:var(--font-style2-display),sans-serif;font-size:40px;font-weight:800;line-height:1}.style2-stat-label{margin-top:8px;color:var(--style2-muted);font-size:11px;letter-spacing:.1em;text-transform:uppercase}
.style2-marquee-section{overflow:hidden;border-block:1px solid var(--style2-border);background:var(--style2-card);padding:18px 0}.style2-marquee-track{display:flex;width:max-content;animation:style2-marquee 64s linear infinite;white-space:nowrap}.style2-marquee-track span{color:var(--style2-muted);font-family:var(--font-style2-display),sans-serif;font-size:13px;font-weight:700;letter-spacing:.16em;padding:0 16px;text-transform:uppercase}.style2-marquee-track .style2-dot{color:var(--style2-accent);padding:0 0 0 16px}@keyframes style2-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
.style2-section{padding:100px 48px}.style2-surface{background:var(--style2-surface)}.style2-section-label{display:flex;align-items:center;gap:12px;margin-bottom:16px;color:var(--style2-accent);font-size:11px;letter-spacing:.18em;text-transform:uppercase}.style2-section-label::before{content:"";width:24px;height:1px;background:var(--style2-accent)}.style2-section-title{margin-bottom:64px;font-family:var(--font-style2-display),sans-serif;font-size:52px;font-weight:800;letter-spacing:0;line-height:1}.style2-about-grid,.style2-contact-inner{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(280px,.8fr);gap:80px}.style2-about-text p{font-size:16px}.style2-about-text p+p{margin-top:20px}.style2-about-meta,.style2-about-side,.style2-contact-right{display:flex;flex-direction:column;gap:16px}.style2-about-meta{margin-top:32px;color:var(--style2-muted);font-size:12px}.style2-about-meta div::before{content:"/ ";color:var(--style2-accent)}
.style2-info-block{border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-card);padding:20px 24px}.style2-info-label,.style2-contact-label{margin-bottom:8px;color:var(--style2-muted);font-size:10px;letter-spacing:.14em;text-transform:uppercase}.style2-info-value{overflow-wrap:anywhere;color:var(--style2-text);font-family:var(--font-style2-display),sans-serif;font-size:16px;font-weight:700;line-height:1.45}
.style2-skills-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2px;overflow:hidden;border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-border)}.style2-skill-group{background:var(--style2-card);padding:32px}.style2-skill-group-wide{grid-column:1/-1}.style2-skill-title{display:flex;align-items:center;gap:8px;margin-bottom:20px;color:var(--style2-accent);font-family:var(--font-style2-display),sans-serif;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}.style2-skill-title::after{content:"";flex:1;height:1px;background:var(--style2-border)}.style2-skill-tags,.style2-project-tags,.style2-project-links,.style2-exp-stack{display:flex;flex-wrap:wrap;gap:8px}.style2-skill-tag{border:1px solid var(--style2-border);border-radius:2px;background:rgba(255,255,255,.05);color:rgba(240,237,232,.72);font-size:12px;padding:6px 14px;transition:border-color .2s,color .2s,background .2s}.style2-skill-tag:hover{border-color:var(--style2-accent);background:rgba(200,245,66,.05);color:var(--style2-accent)}
.style2-exp-timeline{position:relative}.style2-exp-item{position:relative;display:grid;grid-template-columns:200px minmax(0,1fr);gap:48px;padding-bottom:64px}.style2-exp-item:last-child{padding-bottom:0}.style2-exp-item::before{content:"";position:absolute;top:10px;bottom:-20px;left:200px;width:1px;background:var(--style2-border)}.style2-exp-item:last-child::before{display:none}.style2-exp-item::after{content:"";position:absolute;top:8px;left:195px;width:11px;height:11px;border:2px solid var(--style2-bg);border-radius:999px;background:var(--style2-accent)}.style2-exp-left{padding-right:40px;text-align:right}.style2-exp-date{margin-bottom:6px;color:var(--style2-muted);font-size:11px;letter-spacing:.08em}.style2-exp-company{color:var(--style2-text);font-family:var(--font-style2-display),sans-serif;font-size:14px;font-weight:700;line-height:1.35}.style2-exp-right{padding-left:40px}.style2-exp-title{margin-bottom:6px;color:var(--style2-text);font-family:var(--font-style2-display),sans-serif;font-size:20px;font-weight:700;line-height:1.35}.style2-exp-project{margin-bottom:16px;color:var(--style2-accent-2);font-family:var(--font-style2-serif),serif;font-size:15px;font-style:italic;font-weight:300}.style2-exp-summary{max-width:760px;color:var(--style2-soft);font-size:13px;line-height:1.8}.style2-exp-bullets{display:flex;flex-direction:column;gap:10px;margin-top:18px}.style2-exp-bullets li{position:relative;padding-left:28px;color:var(--style2-soft);font-size:13px;line-height:1.8}.style2-exp-bullets li::before{content:"➜";position:absolute;left:0;top:.1em;width:20px;color:var(--style2-accent);font-size:14px;font-weight:800;line-height:1.8}.style2-exp-stack{margin-top:18px}
.style2-projects-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1px;overflow:hidden;border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-border)}.style2-project-card{position:relative;overflow:hidden;min-height:328px;background:var(--style2-card);padding:36px 32px;transition:background .2s}.style2-project-card:hover{background:#1a1b19}.style2-project-card::before{content:"";position:absolute;inset:auto 0 0;height:2px;background:transparent;transition:background .2s}.style2-project-card:hover::before{background:var(--style2-accent)}.style2-project-num{position:absolute;top:16px;right:20px;color:rgba(255,255,255,.04);font-family:var(--font-style2-display),sans-serif;font-size:48px;font-weight:800;line-height:1}.style2-project-icon{display:flex;width:40px;height:40px;align-items:center;justify-content:center;margin-bottom:20px;border-radius:4px;background:rgba(200,245,66,.1);color:var(--style2-accent);font-family:var(--font-style2-display),sans-serif;font-size:16px;font-weight:800}.style2-project-title{margin-bottom:6px;color:var(--style2-text);font-family:var(--font-style2-display),sans-serif;font-size:16px;font-weight:700;line-height:1.35}.style2-project-company{margin-bottom:12px;color:var(--style2-accent);font-size:11px;letter-spacing:.1em;line-height:1.5;text-transform:uppercase}.style2-project-desc{margin-bottom:20px;color:var(--style2-muted);font-size:12px;line-height:1.7}.style2-project-tag{border:1px solid var(--style2-border);border-radius:2px;background:rgba(255,255,255,.04);color:rgba(240,237,232,.56);font-size:10px;padding:3px 8px}.style2-exp-tag{border:1px solid rgba(200,245,66,.35);border-radius:2px;background:rgba(200,245,66,.08);color:var(--style2-accent);font-size:10px;padding:3px 8px}.style2-project-links{margin-top:20px}.style2-project-links a{color:var(--style2-accent);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
.style2-edu-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:20px}.style2-edu-card{position:relative;overflow:hidden;border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-card);padding:28px 24px;transition:border-color .2s}.style2-edu-card:hover{border-color:rgba(200,245,66,.34)}.style2-corner{position:absolute;top:0;right:0;width:40px;height:40px;background:rgba(200,245,66,.08);clip-path:polygon(100% 0,0 0,100% 100%)}.style2-edu-icon{margin-bottom:16px;color:var(--style2-accent);font-family:var(--font-style2-display),sans-serif;font-size:13px;font-weight:800;letter-spacing:.1em}.style2-edu-title{margin-bottom:6px;color:var(--style2-text);font-family:var(--font-style2-display),sans-serif;font-size:15px;font-weight:700;line-height:1.35}.style2-edu-sub{margin-bottom:4px;color:var(--style2-muted);font-size:12px}.style2-edu-year{color:var(--style2-accent);font-size:11px;letter-spacing:.08em}
.style2-contact-inner{align-items:start}.style2-big-text{display:flex;flex-direction:column;margin-bottom:32px;font-family:var(--font-style2-display),sans-serif;font-size:64px;font-weight:800;letter-spacing:0;line-height:.98}.style2-contact-link{display:flex;min-width:0;align-items:center;gap:16px;border:1px solid var(--style2-border);border-radius:4px;background:var(--style2-card);color:var(--style2-text);padding:20px 24px;transition:border-color .2s,background .2s}.style2-contact-link:hover{border-color:var(--style2-accent);background:rgba(200,245,66,.05)}.style2-contact-icon{display:flex;width:36px;height:36px;flex:0 0 36px;align-items:center;justify-content:center;border-radius:2px;background:rgba(200,245,66,.1);color:var(--style2-accent);font-family:var(--font-style2-display),sans-serif;font-size:11px;font-weight:800}.style2-contact-info{min-width:0;flex:1}.style2-contact-label{display:block;margin-bottom:2px}.style2-contact-value{display:block;overflow-wrap:anywhere;color:var(--style2-text);font-size:13px}.style2-contact-arrow{flex:0 0 auto;color:var(--style2-muted);transition:color .2s}.style2-contact-link:hover .style2-contact-arrow{color:var(--style2-accent)}.style2-footer{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--style2-border);padding:32px 48px}.style2-footer-left{font-size:18px}.style2-footer-right{color:var(--style2-muted);font-size:11px;letter-spacing:.08em;text-transform:uppercase}
@media (max-width:1100px){.style2-hero-name{font-size:64px}.style2-section-title,.style2-big-text{font-size:44px}.style2-projects-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (max-width:900px){.style2-nav{padding:16px 24px}.style2-nav-links{display:none}.style2-hero{grid-template-columns:1fr;min-height:auto;padding:104px 24px 64px}.style2-hero-left{padding-right:0}.style2-hero-right{flex-flow:row wrap;align-items:flex-start;justify-content:flex-start;margin-top:48px}.style2-stat-card{width:min(100%,180px)}.style2-section{padding:64px 24px}.style2-about-grid,.style2-contact-inner,.style2-skills-grid{grid-template-columns:1fr;gap:40px}.style2-edu-grid,.style2-projects-grid{grid-template-columns:1fr}.style2-exp-item{grid-template-columns:1fr;gap:16px;padding-bottom:44px}.style2-exp-item::before,.style2-exp-item::after{display:none}.style2-exp-left{padding-right:0;text-align:left}.style2-exp-right{padding-left:0}.style2-footer{flex-direction:column;gap:12px;padding:24px;text-align:center}}@media (max-width:560px){.style2-hero-name{font-size:44px}.style2-section-title,.style2-big-text{font-size:36px}.style2-hero-tag,.style2-hero-cta,.style2-btn-primary,.style2-btn-outline,.style2-stat-card{width:100%}.style2-contact-link{padding:18px 16px}}
`;

type Profile = {
  name: string;
  role: string;
  intro: string;
  about: string;
};

type Contact = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

type ProjectGroup = {
  label: string;
  projects: ProjectItem[];
};

type PortfolioStyleTwoProps = {
  profile: Profile;
  skills: string[];
  languages: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projectGroups: ProjectGroup[];
  contact: Contact;
};

type DecoratedProject = ProjectItem & {
  category: string;
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

const mobileSkills = new Set([
  "React Native",
  "Expo",
  "IOS",
  "Android",
]);

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

const projectManagementSkills = new Set([
  "Jira",
  "Azure DevOps",
  "Agile/Scrum",
]);

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

function groupSkills(skills: string[]) {
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function splitName(name: string) {
  const [firstName, ...rest] = name.split(" ");

  return {
    firstName,
    lastName: rest.join(" ") || firstName,
  };
}

function extractYears(intro: string) {
  return intro.match(/\d+(?:\.\d+)?\+/)?.[0] ?? "6.5+";
}

function cleanExternalLabel(url: string) {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}

function flattenProjects(projectGroups: ProjectGroup[]) {
  return projectGroups.flatMap((group) =>
    group.projects.map((project) => ({
      ...project,
      category: group.label,
    })),
  );
}

function getParagraphs(text: string) {
  return text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function SectionHeading({
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

function ContactCard({
  href,
  label,
  value,
  icon,
}: {
  href: string;
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <a className="style2-contact-link" href={href} rel="noopener noreferrer">
      <span className="style2-contact-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="style2-contact-info">
        <span className="style2-contact-label">{label}</span>
        <span className="style2-contact-value">{value}</span>
      </span>
      <span className="style2-contact-arrow" aria-hidden="true">
        -&gt;
      </span>
    </a>
  );
}

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
  const allProjects: DecoratedProject[] = flattenProjects(projectGroups);
  const marqueeSkills = [...skills, ...skills];
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
      <style dangerouslySetInnerHTML={{ __html: styleTwoCss }} />
      <nav className="style2-nav" aria-label="Primary navigation">
        <a className="style2-nav-logo" href="#home" aria-label="Home">
          {getInitials(profile.name)}
          <span>.</span>
        </a>
        <div className="style2-nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main>
        <section className="style2-hero" id="home">
          <div className="style2-hero-left">
            <div className="style2-hero-tag">
              Available for frontend and fullstack roles · Kochi · Remote
            </div>
            <h1 className="style2-hero-name">
              <span>{firstName}</span>
              <span className="style2-outline">
                {lastName}
                <span className="style2-accent">.</span>
              </span>
            </h1>
            <p className="style2-hero-role">{profile.role}</p>
            <p className="style2-hero-desc">{profile.intro}</p>
            <div className="style2-hero-cta">
              <a className="style2-btn-primary" href="#contact">
                Get in touch
              </a>
              <a className="style2-btn-outline" href="#projects">
                View work
              </a>
            </div>
          </div>

          <div className="style2-hero-right" aria-label="Portfolio stats">
            {stats.map((stat) => (
              <article className="style2-stat-card" key={stat.label}>
                <div className="style2-stat-num">{stat.value}</div>
                <div className="style2-stat-label">{stat.label}</div>
              </article>
            ))}
          </div>
        </section>

        <div className="style2-marquee-section" aria-hidden="true">
          <div className="style2-marquee-track">
            {marqueeSkills.map((skill, index) => (
              <span key={`${skill}-${index}`}>
                {skill}
                <span className="style2-dot"> / </span>
              </span>
            ))}
          </div>
        </div>

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
                <div>{contact.location}</div>
                <div>{profile.role}</div>
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
                <a className="style2-info-value" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="style2-section" id="skills">
          <SectionHeading
            label="Technical skills"
            title={
              <>
                Product polish,
                <br />
                system depth.
              </>
            }
          />
          <div className="style2-skills-grid">
            {skillGroups.map((group, index) => {
              const shouldSpanFullRow =
                skillGroups.length % 2 === 1 && index === skillGroups.length - 1;

              return (
                <article
                  className={`style2-skill-group ${
                    shouldSpanFullRow ? "style2-skill-group-wide" : ""
                  }`}
                  key={group.title}
                >
                  <h3 className="style2-skill-title">{group.title}</h3>
                  <div className="style2-skill-tags">
                    {group.skills.map((skill) => (
                      <span className="style2-skill-tag" key={skill}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="style2-section style2-surface" id="experience">
          <SectionHeading
            label="Work experience"
            title={
              <>
                Built across
                <br />
                real teams.
              </>
            }
          />
          <div className="style2-exp-timeline">
            {experience.map((role) => (
              <article className="style2-exp-item" key={role.company}>
                <div className="style2-exp-left">
                  <div className="style2-exp-date">{role.period}</div>
                  <div className="style2-exp-company">{role.location}</div>
                </div>
                <div className="style2-exp-right">
                  <h3 className="style2-exp-title">{role.company}</h3>
                  <p className="style2-exp-project">{role.role}</p>
                  <p className="style2-exp-summary">{role.summary}</p>
                  <ul className="style2-exp-bullets">
                    {role.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                  <div className="style2-exp-stack">
                    {role.stack.map((item) => (
                      <span className="style2-exp-tag" key={item}>
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="style2-section" id="projects">
          <SectionHeading
            label="Selected projects"
            title={
              <>
                Built for
                <br />
                everyday users.
              </>
            }
          />
          <div className="style2-projects-grid">
            {allProjects.map((project, index) => (
              <article className="style2-project-card" key={project.title}>
                <div className="style2-project-num">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="style2-project-icon" aria-hidden="true">
                  {project.category.slice(0, 1)}
                </div>
                <h3 className="style2-project-title">{project.title}</h3>
                <div className="style2-project-company">
                  {project.category} - {project.period}
                </div>
                <p className="style2-project-desc">{project.description}</p>
                <div className="style2-project-tags">
                  {project.stack.map((item) => (
                    <span className="style2-project-tag" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
                {project.githubUrl || project.liveUrl ? (
                  <div className="style2-project-links">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} rel="noopener noreferrer" target="_blank">
                        Live
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a href={project.githubUrl} rel="noopener noreferrer" target="_blank">
                        Repo
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="style2-section style2-surface" id="education">
          <SectionHeading
            label="Education"
            title={
              <>
                Always
                <br />
                learning.
              </>
            }
          />
          <div className="style2-edu-grid">
            {education.map((item) => (
              <article
                className="style2-edu-card"
                key={`${item.degree}-${item.institution}`}
              >
                <div className="style2-corner" aria-hidden="true" />
                <div className="style2-edu-icon" aria-hidden="true">
                  EDU
                </div>
                <h3 className="style2-edu-title">{item.degree}</h3>
                <p className="style2-edu-sub">{item.institution}</p>
                <p className="style2-edu-year">{item.period}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="style2-section" id="contact">
          <div className="style2-section-label">Let&apos;s connect</div>
          <div className="style2-contact-inner">
            <div className="style2-contact-left">
              <div className="style2-big-text">
                <span>Let&apos;s</span>
                <span className="style2-outline">build</span>
                <span>together.</span>
              </div>
              <p>
                Open to frontend and full-stack opportunities, collaborations,
                product roles, and freelance work.
              </p>
            </div>
            <div className="style2-contact-right">
              <ContactCard
                href={`mailto:${contact.email}`}
                icon="@"
                label="Email"
                value={contact.email}
              />
              <ContactCard
                href={`tel:${contact.phone.replace(/\s/g, "")}`}
                icon="TEL"
                label="Phone"
                value={contact.phone}
              />
              <ContactCard
                href={contact.linkedin}
                icon="IN"
                label="LinkedIn"
                value={cleanExternalLabel(contact.linkedin)}
              />
              <ContactCard
                href={contact.github}
                icon="GH"
                label="GitHub"
                value={cleanExternalLabel(contact.github)}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="style2-footer">
        <div className="style2-footer-left">
          {profile.name}
          <span>.</span>
        </div>
        <div className="style2-footer-right">
          © {new Date().getFullYear()} - {profile.role}
        </div>
      </footer>
    </div>
  );
}
