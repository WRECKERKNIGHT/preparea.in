"use client";

import { Counter } from "@/components/fx/counter";
import { Reveal } from "@/components/fx/reveal";
import { Marquee } from "@/components/fx/marquee";
import { Sparkles, Castle, Scroll } from "lucide-react";

const marqueeItems = [
  <span key="jee" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Sparkles className="size-4 text-gold-deep" aria-hidden="true" /> JEE
  </span>,
  <span key="neet" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Sparkles className="size-4 text-plum" aria-hidden="true" /> NEET
  </span>,
  <span key="cuet" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Sparkles className="size-4 text-teal" aria-hidden="true" /> CUET
  </span>,
  <span key="boards" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Sparkles className="size-4 text-accent" aria-hidden="true" /> Boards
  </span>,
  <span key="sessions" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Castle className="size-4 text-plum" aria-hidden="true" /> Study Rooms
  </span>,
  <span key="challenges" className="flex items-center gap-2 font-display text-lg font-bold text-ink">
    <Scroll className="size-4 text-gold-deep" aria-hidden="true" /> Consistency Challenges
  </span>,
];

export function MarqueeStrip() {
  return (
    <div className="border-y border-edge bg-paper-deep py-5">
      <Marquee items={marqueeItems} className="text-ink" />
    </div>
  );
}

const stats = [
  { value: 20, suffix: "", label: "students in the first cohort" },
  { value: 7, suffix: " days", label: "consistency challenge" },
  { value: 4, suffix: " rooms", label: "focused study slots a day" },
  { value: 100, suffix: "%", label: "focused on consistency" },
];

export function StatsStrip() {
  return (
    <section className="relative py-16">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(600px 300px at 50% 0%, rgba(240,184,74,0.16), transparent 65%)",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.1}>
            <div className="clay-card-deep px-6 py-8 text-center">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="font-display text-5xl font-black text-gradient-gold"
              />
              <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}