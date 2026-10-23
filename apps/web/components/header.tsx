"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Magnetic } from "@/components/fx/magnetic";

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/tour", label: "Tour" },
  { href: "/features", label: "Features" },
  { href: "/community", label: "Community" },
  { href: "/mentors", label: "Mentors" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      const y = window.scrollY;
      const nowScrolled = y > 24;
      if (nowScrolled) {
        el.classList.add("scrolled");
        el.classList.remove("transparent");
      } else {
        el.classList.add("transparent");
        el.classList.remove("scrolled");
      }
    };

    // Use passive listener and throttle manually
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", throttledScroll);
  }, []);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-40 border-b border-edge/60 transparent"
    >
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
          <Magnetic strength={0.25}>
            <span className="clay-btn clay-btn-emerald px-5 py-2.5 text-sm">
              <Link href="/register" className="inline-flex items-center gap-2">
                Join PrepArea
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </span>
          </Magnetic>
        </div>
      </div>
    </header>
  );
}
