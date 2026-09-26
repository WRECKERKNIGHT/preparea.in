import Link from "next/link";
import Image from "next/image";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="PrepArea home"
    >
      <span className="clay-icon relative size-9 overflow-hidden rounded-full shadow-clay" aria-hidden="true">
        <Image
          src="/brand-logo.jpg"
          alt=""
          fill
          sizes="36px"
          className="object-cover transition-transform duration-300 group-hover:scale-110"
          priority
        />
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