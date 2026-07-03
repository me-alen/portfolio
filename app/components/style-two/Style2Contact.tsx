import { cleanExternalLabel, type Contact } from "./helpers";

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

export default function Style2Contact({ contact }: { contact: Contact }) {
  return (
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
  );
}
