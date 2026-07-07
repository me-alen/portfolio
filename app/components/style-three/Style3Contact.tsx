"use client";

import { useState } from "react";

import { cleanExternalLabel, type Contact } from "../style-two/helpers";
import { Magnetic, MaskedWords, Reveal } from "./motion";

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  return (
    <div className="s3-contact-row">
      <dt>{label}</dt>
      <dd>
        {href ? (
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
          >
            {value}
            {external ? (
              <span className="s3-contact-arrow" aria-hidden="true">
                ↗
              </span>
            ) : null}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

export default function Style3Contact({
  contact,
  name,
}: {
  contact: Contact;
  name: string;
}) {
  const [copied, setCopied] = useState(false);
  const year = new Date().getFullYear();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (e.g. insecure context) — quietly do nothing.
    }
  };

  return (
    <section className="s3-contact" id="contact" data-resume-dark-zone>
      <Reveal>
        <p className="s3-kicker">Contact</p>
      </Reveal>

      <h2 className="s3-title">
        <MaskedWords className="s3-title-line" text="Let’s build" />
        <MaskedWords
          className="s3-title-line s3-title-italic"
          text="together."
          delay={0.12}
        />
      </h2>

      <Reveal delay={0.15}>
        <p className="s3-contact-note">
          Open to frontend and full-stack opportunities, collaborations,
          product roles, and freelance work.
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="s3-contact-email-row">
          <Magnetic>
            <a className="s3-contact-email" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
          </Magnetic>
          <button
            type="button"
            className="s3-copy-btn"
            onClick={copyEmail}
            aria-live="polite"
          >
            {copied ? "Copied ✓" : "Copy email"}
          </button>
        </div>
      </Reveal>

      <Reveal delay={0.1} amount={0.2}>
        <dl className="s3-contact-grid">
          <ContactRow
            label="Phone"
            value={contact.phone}
            href={`tel:${contact.phone.replace(/\s/g, "")}`}
          />
          <ContactRow label="Location" value={contact.location} />
          <ContactRow
            label="GitHub"
            value={cleanExternalLabel(contact.github)}
            href={contact.github}
            external
          />
          <ContactRow
            label="LinkedIn"
            value={cleanExternalLabel(contact.linkedin)}
            href={contact.linkedin}
            external
          />
        </dl>
      </Reveal>

      <footer className="s3-footer">
        <span>
          © {year} {name}
        </span>
        <span>{contact.location}</span>
        <button
          type="button"
          className="s3-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to top ↑
        </button>
      </footer>
    </section>
  );
}
