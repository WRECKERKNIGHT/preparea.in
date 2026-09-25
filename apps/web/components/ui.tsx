import type { ReactNode } from "react";
import { Reveal } from "@/components/fx/reveal";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  kicker,
  title,
  intro,
  id,
  light = false,
}: {
  kicker?: string;
  title: string;
  intro?: string;
  id?: string;
  light?: boolean;
}) {
  return (
    <Reveal id={id} className="mx-auto max-w-2xl scroll-mt-24 text-center">
      {kicker ? (
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-edge bg-raised px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent clay-chip">
          <span className="size-1.5 rounded-full bg-gold-deep" aria-hidden="true" />
          {kicker}
        </p>
      ) : null}
      <h2
        className={`font-display text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro ? (
        <p
          className={`mt-5 text-base sm:text-lg ${
            light ? "text-white/70" : "text-ink-muted"
          }`}
        >
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}