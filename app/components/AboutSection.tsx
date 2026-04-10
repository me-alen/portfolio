type AboutSectionProps = {
  about: string;
};

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="mb-14 sm:mb-20">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">About</h2>
      <p className="max-w-3xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
        {about}
      </p>
    </section>
  );
}
