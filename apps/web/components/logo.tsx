import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="PrepArea home"
    >
      <span
        className="clay-icon relative size-9 rounded-2xl bg-gradient-to-br from-accent to-accent-deep text-gold-light shadow-clay"
        aria-hidden="true"
      >
        <Sparkles className="size-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
      </span>
      <span
        className={`font-display text-xl font-black tracking-tight ${
          light ? "text-white" : "text-ink"
        }`}
      >
        Prep<span className="text-gradient-gold">Area</span>
      </span>
    </Link>
  );
}