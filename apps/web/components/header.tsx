import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/community", label: "Community" },
  { href: "/mentors", label: "Mentors" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden text-sm font-medium text-ink-muted transition-colors hover:text-ink sm:block"
          >
            Log in
          </Link>
          <Link href="/register" className="btn-primary text-sm">
            Join PrepArea
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  );
}