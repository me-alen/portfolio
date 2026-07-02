const highlightTerms = [
  "Senior Software Engineer",
  "technical specification writing",
  "GitHub Copilot",
  "React Native",
  "Cursor AI",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "Angular",
  "React",
  "CI/CD",
  "Agile",
  "Git",
  "Claude Code"
];

const highlightPattern = new RegExp(
  `(${highlightTerms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})`,
  "gi",
);

type HighlightedAboutTextProps = {
  text: string;
};

export default function HighlightedAboutText({
  text,
}: HighlightedAboutTextProps) {
  return text.split(highlightPattern).map((part, index) => {
    const shouldHighlight = highlightTerms.some(
      (term) => term.toLowerCase() === part.toLowerCase(),
    );

    if (!shouldHighlight) {
      return part;
    }

    return (
      <strong className="font-extrabold" key={`${part}-${index}`}>
        {part}
      </strong>
    );
  });
}
