"use client";

import { useState } from "react";

type ContactSectionProps = {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
};

export default function ContactSection({
  email,
  phone,
  location,
  github,
  linkedin,
}: ContactSectionProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="mb-8 sm:mb-10">
      <h2 className="mb-4 text-xl font-semibold sm:text-2xl">Contact</h2>
      <p className="mb-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base sm:leading-8">
        Open to frontend and full-stack opportunities. Reach out for
        collaborations, product roles, or freelance work.
      </p>
      <div className="space-y-2 text-sm text-[var(--soft-foreground)] sm:text-base">
        <p className="flex flex-wrap items-center gap-2">
          Email:{" "}
          <a
            href={`mailto:${email}`}
            className="break-all font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            {email}
          </a>
          <button
            type="button"
            onClick={handleCopyEmail}
            className="rounded-full border border-[var(--border-color)] px-2.5 py-1 text-xs font-semibold transition-colors hover:border-[var(--subtle-foreground)]"
          >
            {copied ? "Copied!" : "Copy email"}
          </button>
        </p>
        <p>Phone: {phone}</p>
        <p>Location: {location}</p>
        <p>
          GitHub:{" "}
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            me-alen
          </a>
        </p>
        <p>
          LinkedIn:{" "}
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
          >
            imonlyalen
          </a>
        </p>
      </div>
    </section>
  );
}
