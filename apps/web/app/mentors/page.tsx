import type { Metadata } from "next";
import { Mic, ShieldCheck, NotebookPen } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mentors",
  description: "Practical guidance from experienced aspirants.",
};

const topics = [
  "How I planned my preparation for the full year",
  "Mistakes I made so you don't have to",
  "Managing school, coaching and self-study together",
  "A revision strategy that actually sticks",
  "Staying consistent for months, not days",
  "What exam day actually feels like",
];

const principles = [
  "Mentors share their own experience — they don't teach curriculum.",
  "No guaranteed ranks, selections or scores, ever.",
  "Mentors are verified by PrepArea before hosting a session.",
  "Sessions are structured: talk, then Q&A.",
];

export default function MentorsPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Mentors
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
            You&apos;ve done the journey. Help someone through it.
          </h1>
          <p className="mt-4 text-ink-muted">
            Practical guidance from experienced aspirants — for students,
            delivered honestly.
          </p>
        </div>
      </section>

      <section className="bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Example session topics
          </p>
          <ul className="grid gap-px overflow-hidden rounded-[6px] border border-edge bg-edge sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <li
                key={topic}
                className="flex items-center gap-3 bg-raised px-5 py-4 font-serif text-base text-ink"
              >
                <Mic className="size-4 shrink-0 text-accent" aria-hidden="true" />
                {topic}
              </li>
            ))}
          </ul>

          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {[
              {
                icon: Mic,
                title: "Short, structured sessions",
                body: "30–45 minutes including Q&A. Scheduled in advance, announced on Telegram.",
              },
              {
                icon: ShieldCheck,
                title: "Verified, honest mentors",
                body: "Every mentor is verified before hosting. No inflated claims, no promises.",
              },
              {
                icon: NotebookPen,
                title: "Experience over expertise",
                body: "Mentors share what worked for them — they aren't standing in for teachers or coaching.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="card p-6">
                <Icon className="size-5 text-accent" aria-hidden="true" />
                <h2 className="mt-3 font-serif text-lg font-medium text-ink">
                  {title}
                </h2>
                <p className="mt-2 text-sm text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-medium text-ink">
            What mentors commit to
          </h2>
          <ul className="mx-auto mt-6 max-w-xl space-y-3">
            {principles.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-left text-sm text-ink-muted"
              >
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-ink-muted">
            Interested in mentoring?{" "}
            <Link href="/register" className="font-semibold text-accent hover:text-accent-hover">
              Join the community
            </Link>{" "}
            and mention it — we&apos;ll get in touch.
          </p>
        </div>
      </section>
    </>
  );
}