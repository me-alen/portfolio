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
    <section id="contact" className="mb-10">
      <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
      <p className="mb-4 max-w-2xl text-zinc-300">
        Open to frontend and full-stack opportunities. Reach out for
        collaborations, product roles, or freelance work.
      </p>
      <div className="space-y-2 text-zinc-200">
        <p>
          Email:{" "}
          <a
            href={`mailto:${email}`}
            className="font-semibold text-indigo-300 hover:text-indigo-200"
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
