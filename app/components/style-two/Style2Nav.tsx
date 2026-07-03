"use client";

import { useState } from "react";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Style2Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="style2-nav" aria-label="Primary navigation">
      <span aria-hidden="true" />
      <button
        type="button"
        className={`style2-nav-toggle${open ? " style2-nav-toggle-open" : ""}`}
        aria-expanded={open}
        aria-controls="style2-nav-links"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>
      <div
        id="style2-nav-links"
        className={`style2-nav-links${open ? " style2-nav-open" : ""}`}
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
