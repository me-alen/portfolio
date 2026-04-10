type HeroSectionProps = {
  name: string;
  intro: string;
};

export default function HeroSection({ name, intro }: HeroSectionProps) {
  return (
    <section className="mb-24">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">
        Hello, I am
      </p>
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{name}</h1>
      <p className="mt-6 max-w-2xl text-lg text-[var(--muted-foreground)]">
        {intro}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <a
          href="#projects"
          className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-indigo-400 active:scale-95"
        >
          View projects
        </a>
        <a
          href="#experience"
          className="rounded-full border border-[var(--border-color)] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--subtle-foreground)] active:scale-95"
        >
          View experience
        </a>
        <a
          href="#contact"
          className="rounded-full border border-[var(--border-color)] px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--subtle-foreground)] active:scale-95"
        >
          Contact me
        </a>
      </div>
    </section>
  );
}
