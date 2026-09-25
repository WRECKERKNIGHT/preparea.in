import Link from "next/link";
import { Sparkles } from "lucide-react";
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
    <footer className="relative mt-24 overflow-hidden bg-night text-white">
      <div className="absolute inset-0 stars opacity-70" aria-hidden="true" />
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-start">
        <div className="flex-1 space-y-3">
          <Logo light />
          <p className="max-w-sm text-sm text-white/70">
            An enchanted study academy for competitive-exam aspirants. Study
            together, track progress, stay accountable.
          </p>
        </div>
        <nav
          className="flex flex-col gap-2.5 md:flex-row md:items-center md:gap-7"
          aria-label="Footer"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/70 transition-colors hover:text-gold"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="relative border-t border-white/10">
        <p className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-4 text-xs text-white/45 sm:px-6">
          <Sparkles className="size-3.5 text-gold" aria-hidden="true" />
          PrepArea is a study community, not a coaching or teaching platform. It
          does not guarantee ranks or selection.
        </p>
      </div>
    </footer>
  );
}