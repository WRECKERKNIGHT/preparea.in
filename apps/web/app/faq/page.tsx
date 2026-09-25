import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about PrepArea.",
};

const faqs = [
  {
    q: "Is this a coaching or teaching platform?",
    a: "No. PrepArea is a study community. It doesn't replace teachers, coaching, textbooks or test series — it gives you the consistent, focused environment to actually study.",
  },
  {
    q: "Who is it for?",
    a: "Competitive-exam aspirants — primarily JEE, NEET, CUET and board students, roughly classes 9–12 and droppers.",
  },
  {
    q: "What do I need to start?",
    a: "A device with Zoom (or a browser), Telegram and Discord for the community. Your study material stays where it is.",
  },
  {
    q: "How does the 7-Day Challenge work?",
    a: "Set a daily target each morning, study during the day, check in each evening. Miss a day? No shame — tomorrow counts. It's about consistency, not comparison.",
  },
  {
    q: "What tools do you use?",
    a: "For the MVP: Google Forms and Sheets, Discord, Telegram, Zoom and YPT-style tracking. No custom app is required to start.",
  },
  {
    q: "Is study-time tracking competitive?",
    a: "No. Progress is personal. We deliberately avoid leaderboards and unhealthy study-hour comparisons.",
  },
  {
    q: "Is my information safe?",
    a: "We collect only what's needed to run the community, don't publish member details publicly, and enforce strict privacy and moderation rules.",
  },
  {
    q: "Is it free?",
    a: "Everyone gets a 7-day free trial — no card needed. The first cohort and 7-Day Challenge start inside it. After the trial, the community stays affordable, and selected premium features may be tested as a paid membership.",
  },
  {
    q: "Will there be a proper app?",
    a: "The MVP deliberately uses existing tools. A dedicated app is on the roadmap — only after the community proves it works.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        kicker="FAQ"
        title={
          <>
            Questions, <span className="text-gradient-gold">answered</span>
          </>
        }
      />

      <section className="bg-raised py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4">
            {faqs.map(({ q, a }, i) => (
              <Reveal key={q} delay={(i % 3) * 0.05}>
                <details className="clay-card-deep group overflow-hidden p-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-7 py-5 font-display text-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
                    {q}
                    <span
                      className="clay-icon size-8 shrink-0 rounded-full bg-gradient-to-br from-gold-light to-gold text-gold-deep transition-transform duration-300 group-open:rotate-45"
                      aria-hidden="true"
                    >
                      +
                    </span>
                  </summary>
                  <p className="px-7 pb-6 text-ink-muted">{a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-10 text-center">
              <p className="text-ink-muted">
                Still curious?{" "}
                <Link
                  href="/register"
                  className="font-bold text-accent underline decoration-gold underline-offset-4 hover:text-accent-hover"
                >
                  Join and ask us directly
                </Link>
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}