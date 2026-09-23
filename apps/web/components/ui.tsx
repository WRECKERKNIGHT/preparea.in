export function Container({
  children,
  className = "",
}: {
  children: React.ReactNode;
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
}: {
  kicker?: string;
  title: string;
  intro?: string;
  id?: string;
}) {
  return (
    <div id={id} className="mx-auto max-w-2xl scroll-mt-20 text-center">
      {kicker ? (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {kicker}
        </p>
      ) : null}
      <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
        {title}
      </h2>
      {intro ? <p className="mt-4 text-base text-ink-muted">{intro}</p> : null}
    </div>
  );
}