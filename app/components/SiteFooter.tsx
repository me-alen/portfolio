type SiteFooterProps = {
  name: string;
};

export default function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--border-color)] pt-6 text-center text-xs text-[var(--subtle-foreground)] sm:text-left sm:text-sm">
      <p>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}
