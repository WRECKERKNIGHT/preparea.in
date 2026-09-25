"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "@/components/logo";
import { Magnetic } from "@/components/fx/magnetic";
import { ScrollProgress } from "@/components/fx/scroll-progress";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const NAV = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/community", label: "Community" },
  { href: "/mentors", label: "Mentors" },
  { href: "/faq", label: "FAQ" },
];

export function Header() {
  const ref = useRef<HTMLDivElement | null>(null);
  const scrolled = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onScroll = () => {
      const y = window.scrollY;
      const nowScrolled = y > 24;
      if (nowScrolled === scrolled.current) return;
      scrolled.current = nowScrolled;
      const el = ref.current;
      if (!el) return;
      gsap.to(el, {
        duration: reduce ? 0 : 0.4,
        ease: "power2.out",
        backgroundColor: nowScrolled
          ? "rgba(250,243,230,0.82)"
          : "rgba(250,243,230,0.5)",
        boxShadow: nowScrolled
          ? "0 10px 30px rgba(72,48,102,0.12)"
          : "0 0 0 rgba(0,0,0,0)",
        backdropFilter: nowScrolled ? "blur(14px)" : "blur(0px)",
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <ScrollProgress />
      <header
        ref={ref}
        className="fixed inset-x-0 top-0 z-40 border-b border-edge/60"
        style={{ backgroundColor: "rgba(250,243,230,0.5)" }}
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
    </>
  );
}