type HeroSectionProps = {
  name: string;
  intro: string;
};

export default function HeroSection({ name, intro }: HeroSectionProps) {
  return (
    <section className="mb-16 sm:mb-24">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-indigo-400">
        Hello, I am
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
        {name}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--muted-foreground)] sm:mt-6 sm:text-lg sm:leading-8">
        {intro}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
        <a
          href="#projects"
          className="w-full rounded-full bg-indigo-500 px-6 py-3 text-center text-sm font-semibold text-white transition-all duration-300 ease-out hover:bg-indigo-400 active:scale-95 sm:w-auto"
        >
          View projects
        </a>
        <a
          href="#experience"
          className="w-full rounded-full border border-[var(--border-color)] px-6 py-3 text-center text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--subtle-foreground)] active:scale-95 sm:w-auto"
        >
          View experience
        </a>
        <a
          href="#contact"
          className="w-full rounded-full border border-[var(--border-color)] px-6 py-3 text-center text-sm font-semibold transition-all duration-300 ease-out hover:border-[var(--subtle-foreground)] active:scale-95 sm:w-auto"
        >
          Contact me
        </a>
      </div>
    </section>
  );
}
