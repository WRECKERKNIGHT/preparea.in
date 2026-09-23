import { CheckCircle2, ArrowRight, Send, MessagesSquare } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

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
    <section className="bg-paper">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-accent-light text-accent">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-5 font-serif text-3xl font-medium text-ink sm:text-4xl">
            You&apos;re in.
          </h1>
          <p className="mt-3 text-ink-muted">
            Here&apos;s what to do next — under five minutes, then you can be in
            a study room tonight.
          </p>
        </div>

        <ol className="mt-12 space-y-4">
          {steps.map((step, i) => (
            <li key={step.title} className="card flex gap-4 p-6">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-light font-serif text-sm font-semibold text-accent">
                {i + 1}
              </span>
              <div className="min-w-0">
                <h2 className="font-medium text-ink">{step.title}</h2>
                <p className="mt-1 text-sm text-ink-muted">{step.body}</p>
                {step.link ? (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover"
                  >
                    {step.linkLabel}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Open your dashboard
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}