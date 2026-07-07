import {
  BookOpen,
  Bot,
  BrainCircuit,
  ClipboardList,
  Cloud,
  FileCode,
  FileText,
  Gauge,
  Infinity as InfinityIcon,
  IterationCw,
  KeyRound,
  Network,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import {
  siAndroid,
  siAngular,
  siClaude,
  siCss,
  siCursor,
  siDocker,
  siExpo,
  siExpress,
  siGit,
  siGithub,
  siGithubactions,
  siGithubcopilot,
  siGraphql,
  siHtml5,
  siIos,
  siJavascript,
  siJira,
  siJsonwebtokens,
  siLinux,
  siNestjs,
  siNextdotjs,
  siNodedotjs,
  siPrisma,
  siReact,
  siReactquery,
  siRedux,
  siTailwindcss,
  siTypeorm,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";

// Brand marks from the Simple Icons pack, keyed by the exact skill strings in
// app/data/portfolio.ts.
const SKILL_ICONS: Record<string, SimpleIcon> = {
  React: siReact,
  Angular: siAngular,
  "Next.js": siNextdotjs,
  TypeScript: siTypescript,
  JavaScript: siJavascript,
  "Redux Toolkit": siRedux,
  "React Query": siReactquery,
  GraphQL: siGraphql,
  HTML5: siHtml5,
  CSS3: siCss,
  "Tailwind CSS": siTailwindcss,
  "React Native": siReact,
  Expo: siExpo,
  IOS: siIos,
  Android: siAndroid,
  "Node.js": siNodedotjs,
  NestJS: siNestjs,
  Express: siExpress,
  PrismaORM: siPrisma,
  TypeORM: siTypeorm,
  JWT: siJsonwebtokens,
  Git: siGit,
  GitHub: siGithub,
  "GitHub Actions": siGithubactions,
  Docker: siDocker,
  Linux: siLinux,
  Jira: siJira,
  Claude: siClaude,
  "Cursor AI": siCursor,
  Copilot: siGithubcopilot,
};

// Symbolic Lucide glyphs for skills without an official mark: conceptual
// skills (REST APIs, Prompt Engineering…) and brands whose logos were legally
// removed from icon packs (AWS, Azure DevOps, ChatGPT).
const GENERIC_ICONS: Record<string, LucideIcon> = {
  "Performance Optimization": Gauge,
  "REST APIs": Network,
  "OAuth 2.0": KeyRound,
  "AWS (EC2, S3, Lambda)": Cloud,
  "CI/CD": Workflow,
  "Azure DevOps": InfinityIcon,
  "Agile/Scrum": IterationCw,
  ChatGPT: Bot,
  "Prompt Engineering": Sparkles,
  "LLM API Integration": BrainCircuit,
  OpenSpec: FileCode,
  "Technical Specification Writing": FileText,
  "Documentation Generation": BookOpen,
  "Requirements Analysis": ClipboardList,
};

export function SkillMark({ skill }: { skill: string }) {
  const brand = SKILL_ICONS[skill];

  if (brand) {
    return (
      <svg
        className="s3-cap-icon"
        viewBox="0 0 24 24"
        width={16}
        height={16}
        fill="currentColor"
        aria-hidden="true"
      >
        <path d={brand.path} />
      </svg>
    );
  }

  const Generic = GENERIC_ICONS[skill];

  if (Generic) {
    return (
      <Generic
        className="s3-cap-icon"
        size={16}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    );
  }

  return null;
}
