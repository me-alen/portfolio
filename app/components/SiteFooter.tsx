type SiteFooterProps = {
  name: string;
};

export default function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--border-color)] pt-6 text-sm text-[var(--subtle-foreground)]">
      <p>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}
