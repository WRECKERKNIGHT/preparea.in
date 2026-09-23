import type { Metadata } from "next";
import Link from "next/link";

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
    a: "The first cohort and 7-Day Challenge are free. After we prove value, selected premium features may be tested as a paid membership.",
  },
  {
    q: "Will there be a proper app?",
    a: "The MVP deliberately uses existing tools. A dedicated app is on the roadmap — only after the community proves it works.",
  },
];

export default function FaqPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            FAQ
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
            Questions, answered
          </h1>
        </div>
      </section>

      <section className="bg-raised">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="space-y-px overflow-hidden rounded-[6px] border border-edge bg-edge">
            {faqs.map(({ q, a }) => (
              <div key={q} className="bg-raised p-6">
                <h2 className="font-serif text-lg font-medium text-ink">{q}</h2>
                <p className="mt-2 text-sm text-ink-muted">{a}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <p className="text-sm text-ink-muted">
              Still curious?{" "}
              <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
                Join and ask us directly
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}