type ContactSectionProps = {
  email: string;
  phone: string;
  location: string;
};

export default function ContactSection({
  email,
  phone,
  location,
}: ContactSectionProps) {
  return (
    <section id="contact" className="mb-8 sm:mb-10">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Contact</h2>
      <p className="mb-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
        Open to frontend and full-stack opportunities. Reach out for
        collaborations, product roles, or freelance work.
      </p>
      <div className="space-y-2 text-sm text-[var(--soft-foreground)] sm:text-base">
        <p>
          Email:{" "}
          <a
            href={`mailto:${email}`}
            className="break-all font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            {email}
          </a>
        </p>
        <p>Phone: {phone}</p>
        <p>Location: {location}</p>
      </div>
    </section>
  );
}
