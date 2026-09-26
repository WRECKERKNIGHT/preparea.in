import { CheckCircle2, ArrowRight, Send, MessagesSquare, Sparkles, Compass } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = {
  title: "You're in",
  description: "Welcome to PrepArea.",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ joined?: string }>;
}) {
  const { joined } = await searchParams;
  let settings: { telegramUrl?: string; discordUrl?: string } = {};
  try {
    settings = await getSettings();
  } catch {
    settings = {};
  }

  const steps = [
    {
      title: "Welcome to PrepArea",
      body: `You're on the list${joined ? " (member #" + joined + ")" : ""}. Check your email for a verification code the first time you log in.`,
    },
    {
      icon: Send,
      title: "Join Telegram — announcements",
      body: "Challenge updates, session reminders and important information land here.",
      link: settings.telegramUrl,
      linkLabel: "Join Telegram",
    },
    {
      icon: MessagesSquare,
      title: "Join Discord — the community",
      body: "Subject channels, exam groups and live study-room links. This is where sessions start.",
      link: settings.discordUrl,
      linkLabel: "Join Discord",
    },
    {
      title: "Find your study room",
      body: "Morning, afternoon, evening and night focus slots run every day. Pick one from your dashboard and show up.",
    },
    {
      title: "Learn the challenge rules",
      body: "The 7-Day Consistency Challenge: set a target each morning, study, check in each evening. Missed a day? No shame — tomorrow counts.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-paper">
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(700px 400px at 50% -10%, rgba(240,184,74,0.18), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <Reveal>
          <div className="text-center">
            <span className="clay-icon mx-auto size-16 rounded-full bg-gradient-to-br from-accent-light to-accent text-accent">
              <CheckCircle2 className="size-8" aria-hidden="true" />
            </span>
            <h1 className="mt-6 font-display text-4xl font-black leading-tight text-ink sm:text-5xl">
              You&apos;re <span className="text-gradient-gold">in.</span>
            </h1>
            <p className="mt-4 text-lg text-ink-muted">
              Here&apos;s what to do next — under five minutes, then you can be
              in a study room tonight.
            </p>
            <p className="mx-auto mt-3 inline-flex max-w-md items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold-deep">
              <Sparkles className="size-3.5" aria-hidden="true" />
              7 days of free trial on your account — no card needed.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <span className="clay-btn clay-btn-emerald px-6 py-3 text-sm">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2"
                >
                  Open your dashboard
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </span>
              <span className="clay-btn clay-btn-night px-6 py-3 text-sm">
                <Link href="/tour" className="inline-flex items-center gap-2">
                  <Compass className="size-4" aria-hidden="true" />
                  Take the 5-minute tour
                </Link>
              </span>
            </div>
          </div>
        </Reveal>

        <ol className="mt-12 space-y-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.07}>
              <li className="clay-card-deep flex gap-4 p-6">
                <span className="clay-icon mt-0.5 size-9 shrink-0 rounded-full bg-gradient-to-br from-gold-light to-gold text-gold-deep font-display text-base font-black">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-bold text-ink">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
                  {step.link ? (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-accent underline decoration-gold underline-offset-4 hover:text-accent-hover"
                    >
                      {step.linkLabel}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.2}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3">
            <span className="clay-btn clay-btn-emerald px-8 py-4 text-base">
              <Link href="/dashboard" className="inline-flex items-center gap-2">
                Open your dashboard
                <ArrowRight className="size-5" aria-hidden="true" />
              </Link>
            </span>
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-ink-faint">
              <Sparkles className="size-3.5 text-gold-deep" aria-hidden="true" />
              Your journey begins tonight.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}