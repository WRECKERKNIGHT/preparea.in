import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = {
  title: "Register",
  description: "Join the PrepArea study community.",
};

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(700px 400px at 50% -10%, rgba(240,184,74,0.18), transparent 60%), radial-gradient(600px 380px at 90% 90%, rgba(124,92,219,0.14), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="dotted-light absolute inset-0 -z-10 opacity-50" aria-hidden="true" />
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="text-center">
            <p className="clay-chip mx-auto mb-5 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              <Sparkles className="size-3.5 text-gold-deep" aria-hidden="true" />
              Registration
            </p>
            <h1 className="font-display text-4xl font-black leading-[1.06] tracking-tight text-ink sm:text-5xl">
              Join the <span className="text-gradient-gold">first cohort</span>
            </h1>
            <p className="mt-4 text-lg text-ink-muted">
              Free for the first 20 students. Two minutes, and you&rsquo;re in.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="clay-card-deep mt-10 p-7 sm:p-9">
            <RegisterForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}