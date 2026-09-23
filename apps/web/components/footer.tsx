import Link from "next/link";
import { Logo } from "@/components/logo";

const links = [
  { href: "/features", label: "Features" },
  { href: "/community", label: "Community rules" },
  { href: "/mentors", label: "Mentors" },
  { href: "/faq", label: "FAQ" },
  { href: "/privacy", label: "Privacy" },
];

export function Footer() {
  return (
    <footer className="border-t border-edge bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center">
        <div className="flex-1 space-y-2">
          <Logo />
          <p className="max-w-sm text-sm text-ink-muted">
            A study community for competitive-exam aspirants. Study together,
            track progress, stay accountable.
          </p>
        </div>
        <nav className="flex flex-col gap-2 md:flex-row md:items-center md:gap-6" aria-label="Footer">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t border-edge">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-faint sm:px-6">
          PrepArea is a study community, not a coaching or teaching platform. It
          does not guarantee ranks or selection.
        </p>
      </div>
    </footer>
  );
}