import { Sparkles } from "lucide-react";
import { Reveal } from "@/components/fx/reveal";
import { Container } from "@/components/ui";

export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: React.ReactNode;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(600px 320px at 15% -10%, rgba(240,184,74,0.16), transparent 60%), radial-gradient(700px 400px at 90% 0%, rgba(124,92,219,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <Container className="py-16 text-center sm:py-20">
        <Reveal>
          <p className="clay-chip mx-auto mb-5 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            <Sparkles className="size-3.5 text-gold-deep" aria-hidden="true" />
            {kicker}
          </p>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-black leading-[1.06] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro ? (
            <p className="mx-auto mt-5 max-w-xl text-lg text-ink-muted">
              {intro}
            </p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}