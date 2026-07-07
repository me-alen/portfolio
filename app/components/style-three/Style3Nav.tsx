const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About", secondary: true },
  { href: "#experience", label: "Experience", secondary: true },
  { href: "#contact", label: "Contact" },
];

export default function Style3Nav() {
  return (
    <nav className="s3-nav" aria-label="Portfolio sections">
      {LINKS.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className={link.secondary ? "s3-nav-secondary" : undefined}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
