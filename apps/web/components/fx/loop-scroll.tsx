"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Target,
  Users,
  BookOpen,
  Clock,
  CalendarCheck,
  LineChart,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const loop = [
  { icon: Target, label: "Set goal" },
  { icon: Users, label: "Join study room" },
  { icon: BookOpen, label: "Study" },
  { icon: Clock, label: "Track time" },
  { icon: CalendarCheck, label: "Check in" },
  { icon: LineChart, label: "See progress" },
  { icon: CheckCircle2, label: "Return tomorrow" },
];

export function LoopScroll() {
  const section = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const sec = section.current;
    const trk = track.current;
    if (!sec || !trk) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce || !window.matchMedia("(max-width: 1024px)").matches === false) {
      return;
    }
    if (window.innerWidth < 1024) return;

    const ctx = gsap.context(() => {
      const tween = gsap.to(trk, {
        x: () => -(trk.scrollWidth - window.innerWidth + 48),
        ease: "none",
        scrollTrigger: {
          trigger: sec,
          start: "top top",
          end: () => `+=${trk.scrollWidth - window.innerWidth + 200}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger?.kill();
    }, sec);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-paper">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(700px 400px at 10% 10%, rgba(124,92,219,0.1), transparent 60%), radial-gradient(700px 400px at 90% 90%, rgba(63,154,168,0.1), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="max-w-2xl">
          <p className="clay-chip mb-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3.5 text-gold-deep" aria-hidden="true" />
            The daily loop
          </p>
          <h2 className="font-display text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Consistency is a{" "}
            <span className="text-gradient-gold">system</span>, not a mood
          </h2>
          <p className="mt-4 text-lg text-ink-muted">
            The same loop, every day. Set a goal, study with others, track it,
            check in. Scroll to spin the wheel.
          </p>
        </div>
      </div>

      <div
        ref={track}
        className="mt-12 flex w-max items-center gap-4 px-4 pb-20 sm:px-6"
      >
        {loop.map(({ icon: Icon, label }, i) => (
          <div key={label} className="relative flex items-center gap-4">
            <div
              className={`clay-card-deep flex h-40 w-40 flex-col items-center justify-center gap-3 text-center sm:h-44 sm:w-44 ${
                i === 0 ? "glow-gold" : ""
              }`}
            >
              <span className="clay-icon size-12 rounded-2xl bg-gradient-to-br from-accent-light to-accent text-accent">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="px-3 text-sm font-bold text-ink">{label}</span>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-ink-faint">
                0{i + 1}
              </span>
            </div>
            {i < loop.length - 1 ? (
              <span className="text-3xl text-gold-deep" aria-hidden="true">
                →
              </span>
            ) : null}
          </div>
        ))}
      </div>

      <div className="sr-only" aria-label="Daily loop steps">
        {loop.map((l, i) => `${i + 1}. ${l.label}`).join(", ")}
      </div>
    </section>
  );
}