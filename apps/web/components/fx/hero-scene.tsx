"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles, BookOpen } from "lucide-react";
import { TextReveal } from "./text-reveal";
import { Particles } from "./particles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroScene() {
  const scope = useRef<HTMLDivElement | null>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (reduce) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        "[data-hero-badge]",
        { autoAlpha: 0, y: 18, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }
      )
        .fromTo(
          "[data-hero-line]",
          { autoAlpha: 0, y: 60, rotateX: 35 },
          { autoAlpha: 1, y: 0, rotateX: 0, duration: 1, stagger: 0.16 },
          "-=0.25"
        )
        .fromTo(
          "[data-hero-sub]",
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.8 },
          "-=0.5"
        )
        .fromTo(
          "[data-hero-cta]",
          { autoAlpha: 0, y: 24, scale: 0.95 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.1 },
          "-=0.55"
        )
        .fromTo(
          "[data-hero-meta]",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          "-=0.4"
        );

      // Enhanced floating orbs with more dynamic movement
      gsap.to("[data-orb-1]", {
        y: -40,
        x: 15,
        duration: 6,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      gsap.to("[data-orb-2]", {
        y: 35,
        x: -20,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1,
      });
      gsap.to("[data-orb-3]", {
        y: -30,
        x: 20,
        duration: 7,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.5,
      });

      // Parallax scrolling effect
      const parallax = gsap.to("[data-hero-parallax]", {
        y: -150,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Fade out on scroll
      const fadeOut = gsap.to("[data-hero-content]", {
        autoAlpha: 0.1,
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "10% top",
          end: "85% top",
          scrub: true,
        },
      });

      return () => {
        parallax.scrollTrigger?.kill();
        fadeOut.scrollTrigger?.kill();
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const onMouseMove = (e: React.MouseEvent) => {
    const root = scope.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / rect.width - 0.5;
    const my = (e.clientY - rect.top) / rect.height - 0.5;
    mouse.current = { x: mx, y: my };

    // Parallax effect on orbs based on mouse position
    const orbs = root.querySelectorAll("[data-cursor-orb]");
    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 20;
      gsap.to(orb, {
        x: mx * depth,
        y: my * depth,
        duration: 0.8,
        ease: "power2.out",
      });
    });
  };

  return (
    <div
      ref={scope}
      onMouseMove={onMouseMove}
      className="relative isolate flex min-h-[95vh] items-center overflow-hidden"
    >
      {/* Animated background gradient */}
      <div
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "radial-gradient(900px 500px at 15% -10%, rgba(240,184,74,0.25), transparent 60%), radial-gradient(800px 520px at 90% 8%, rgba(124,92,219,0.25), transparent 55%), radial-gradient(700px 620px at 50% 115%, rgba(63,154,168,0.18), transparent 60%)",
          animation: "gradient-shift 15s ease infinite alternate",
        }}
        aria-hidden="true"
      />

      {/* Particle system */}
      <Particles count={25} />

      {/* Dotted pattern overlay */}
      <div className="absolute inset-0 -z-10 dotted-light opacity-50" aria-hidden="true" />

      {/* Clay orbs with enhanced animation */}
      <div data-hero-parallax className="absolute inset-0 -z-10" aria-hidden="true">
        <div
          data-orb-1
          data-cursor-orb
          className="orb absolute left-[6%] top-[14%] size-28 bg-gradient-to-br from-gold-soft to-gold-deep opacity-80 shadow-clay-lg"
        />
        <div
          data-orb-2
          data-cursor-orb
          className="orb absolute right-[10%] top-[10%] size-20 bg-gradient-to-br from-plum-soft to-plum opacity-75 shadow-clay-lg"
        />
        <div
          data-orb-3
          data-cursor-orb
          className="orb absolute left-[48%] bottom-[8%] size-24 bg-gradient-to-br from-teal-soft to-teal opacity-80 shadow-clay-lg"
        />
        <div
          data-cursor-orb
          className="orb absolute right-[24%] bottom-[20%] size-12 bg-gradient-to-br from-accent-light to-accent opacity-85 shadow-clay"
        />
        <div
          className="orb absolute left-[20%] bottom-[26%] size-9 bg-gradient-to-br from-gold to-gold-deep opacity-75 shadow-clay"
        />
      </div>

      <div data-hero-content className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div
            data-hero-badge
            className="clay-chip mx-auto inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.22em] text-accent"
          >
            <Sparkles className="size-4 text-gold-deep" aria-hidden="true" />
            For JEE · NEET · CUET &amp; Boards
          </div>

          <h1
            className="mt-10 font-display text-[3rem] font-black leading-[1.02] tracking-tight text-ink sm:text-6xl lg:text-7xl"
            style={{ perspective: "600px" }}
          >
            <span data-hero-line className="block">
              <TextReveal
                text="Study "
                className="text-gradient-gold"
                delay={0.2}
                stagger={0.05}
              />
              together<span className="text-ink">.</span>
            </span>
            <span data-hero-line className="block">
              Stay{" "}
              <span className="relative inline-block">
                <TextReveal
                  text="accountable"
                  delay={0.4}
                  stagger={0.04}
                />
                <svg
                  className="absolute -bottom-3 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8C50 2 150 2 196 8"
                    stroke="var(--color-plum)"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="text-ink">.</span>
            </span>
            <span data-hero-line className="block">
              Build{" "}
              <TextReveal
                text="consistency"
                className="text-gradient-gold"
                delay={0.6}
                stagger={0.05}
              />
              <span className="text-ink">.</span>
            </span>
          </h1>

          <p
            data-hero-sub
            className="mx-auto mt-8 max-w-xl text-lg text-ink-muted"
          >
            PrepArea is an{" "}
            <span className="font-semibold text-ink">enchanted study academy</span>{" "}
            for competitive-exam aspirants. Virtual rooms, daily check-ins and
            consistency magic — not one more teaching app.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <span data-hero-cta className="clay-btn clay-btn-gold px-8 py-4 text-base glow-gold">
              <Link href="/register" className="inline-flex items-center gap-2">
                Begin your quest
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </span>
            <span data-hero-cta className="clay-btn clay-btn-outline px-8 py-4 text-base">
              <Link href="/#how-it-works">How it works</Link>
            </span>
          </div>

          <div
            data-hero-meta
            className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-sm text-ink-muted"
          >
            <span className="inline-flex items-center gap-2">
              <BookOpen className="size-5 text-accent" aria-hidden="true" />
              7-Day Consistency Challenge
            </span>
            <span className="inline-flex items-center gap-2">
              <Sparkles className="size-5 text-gold-deep" aria-hidden="true" />
              First cohort is free
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-meta
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-ink-faint"
        aria-hidden="true"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em]">
          Scroll to explore
        </span>
        <span className="block size-2 animate-bounce rounded-full bg-gold-deep" />
      </div>
    </div>
  );
}
