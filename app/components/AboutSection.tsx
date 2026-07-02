import HighlightedAboutText from "./HighlightedAboutText";

type AboutSectionProps = {
  about: string;
};

export default function AboutSection({ about }: AboutSectionProps) {
  const paragraphs = about
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <section id="about" className="mb-14 sm:mb-20">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">About</h2>
      <div className="max-w-3xl space-y-5 text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
        {paragraphs.map((paragraph, index) => (
          <p key={`${index}-${paragraph.slice(0, 24)}`}>
            <HighlightedAboutText text={paragraph} />
          </p>
        ))}
      </div>
    </section>
  );
}
