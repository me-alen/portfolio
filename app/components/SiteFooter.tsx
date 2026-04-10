type SiteFooterProps = {
  name: string;
};

export default function SiteFooter({ name }: SiteFooterProps) {
  return (
    <footer className="border-t border-zinc-800 pt-6 text-sm text-zinc-400">
      <p>
        © {new Date().getFullYear()} {name}. All rights reserved.
      </p>
    </footer>
  );
}
