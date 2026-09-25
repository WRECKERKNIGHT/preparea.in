"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Flame, Sparkles } from "lucide-react";
import { Magnetic } from "@/components/fx/magnetic";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function NightChallenge() {
  const section = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    if (!sec) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-night-card]",
        { autoAlpha: 0, y: 70, scale: 0.94 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 70%",
            once: true,
          },
        }
      );
      gsap.to("[data-flame]", {
        scale: 1.12,
        rotate: -4,
        duration: 1.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, sec);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-night text-white"
    >
      <div className="absolute inset-0 stars opacity-80" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(700px 420px at 50% -10%, rgba(124,92,219,0.4), transparent 65%), radial-gradient(600px 380px at 90% 110%, rgba(240,184,74,0.2), transparent 65%), radial-gradient(600px 380px at 8% 100%, rgba(63,154,168,0.18), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="dotted-night absolute inset-0 opacity-50" aria-hidden="true" />

      {/* floating sparkles */}
      <div className="absolute inset-0" aria-hidden="true">
        {[
          "left-[8%] top-[16%]",
          "right-[10%] top-[22%]",
          "left-[20%] bottom-[18%]",
          "right-[24%] bottom-[10%]",
          "left-[45%] top-[8%]",
        ].map((pos, i) => (
          <span
            key={i}
            className={`absolute ${pos} text-gold animate-twinkle`}
            style={{ animationDelay: `${i * 0.5}s`, fontSize: `${14 + (i % 3) * 8}px` }}
          >
            ✦
          </span>
        ))}
      </div>

      <div data-night-card className="relative mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <span className="clay-chip-night mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-gold">
          <Flame data-flame className="size-3.5" aria-hidden="true" />
          7-Day Study Consistency Challenge
        </span>
        <h2 className="font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          Seven days. One quest a day.{" "}
          <span className="shimmer-text">Your streak counts.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/70">
          Morning: set the target. Evening: report what you completed. No
          shaming for a missed day — just tomorrow. Future editions: 14-day,
          30-day and 100-hour challenges.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic strength={0.25}>
            <span className="clay-btn clay-btn-gold px-8 py-4 text-base glow-gold">
              <Link href="/register" className="inline-flex items-center gap-2">
                Join the next cohort
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </span>
          </Magnetic>
        </div>
        <p className="mt-8 inline-flex items-center gap-2 text-sm text-white/50">
          <Sparkles className="size-4 text-gold" aria-hidden="true" />
          First cohort is free · Spots are limited
        </p>
      </div>
    </section>
  );
}