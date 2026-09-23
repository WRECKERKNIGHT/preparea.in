import Link from "next/link";

export function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 font-serif text-xl font-semibold tracking-tight text-ink"
      aria-label="PrepArea home"
    >
      <span
        className="inline-block size-2.5 shrink-0 rounded-[2px] bg-accent"
        aria-hidden="true"
      />
      PrepArea
    </Link>
  );
}