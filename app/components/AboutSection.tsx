type AboutSectionProps = {
  about: string;
};

export default function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="mb-20">
      <h2 className="mb-4 text-2xl font-semibold">About</h2>
      <p className="max-w-3xl leading-8 text-zinc-300">{about}</p>
    </section>
  );
}
