import type { Metadata } from "next";
import { Mic, ShieldCheck, NotebookPen } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import { Magnetic } from "@/components/fx/magnetic";

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
      <PageHeader
        kicker="Mentors"
        title={
          <>
            You&apos;ve done the journey.{" "}
            <span className="text-gradient-gold">Help someone</span> through it.
          </>
        }
        intro="Practical guidance from experienced aspirants — for students, delivered honestly."
      />

      <section className="bg-raised py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Reveal>
            <p className="clay-chip mb-6 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
              Example session topics
            </p>
          </Reveal>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic, i) => (
              <Reveal key={topic} delay={(i % 3) * 0.07}>
                <li className="clay-card flex items-center gap-3 px-6 py-5">
                  <span className="clay-icon size-9 shrink-0 rounded-xl bg-gradient-to-br from-plum-soft to-plum text-white">
                    <Mic className="size-4" aria-hidden="true" />
                  </span>
                  <span className="font-display text-base font-bold text-ink">
                    {topic}
                  </span>
                </li>
              </Reveal>
            ))}
          </ul>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: Mic,
                title: "Short, structured sessions",
                body: "30–45 minutes including Q&A. Scheduled in advance, announced on Telegram.",
                accent: "from-plum-soft to-plum",
              },
              {
                icon: ShieldCheck,
                title: "Verified, honest mentors",
                body: "Every mentor is verified before hosting. No inflated claims, no promises.",
                accent: "from-accent-light to-accent",
              },
              {
                icon: NotebookPen,
                title: "Experience over expertise",
                body: "Mentors share what worked for them — they aren't standing in for teachers or coaching.",
                accent: "from-gold-light to-gold",
              },
            ].map(({ icon: Icon, title, body, accent }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <Tilt max={8}>
                  <div className="clay-card-deep h-full p-7">
                    <span
                      className={`clay-icon size-12 rounded-[18px] bg-gradient-to-br ${accent} text-ink`}
                    >
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    <h2 className="mt-4 font-display text-xl font-black text-ink">
                      {title}
                    </h2>
                    <p className="mt-2 text-sm text-ink-muted">{body}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="font-display text-3xl font-black text-ink">
            What mentors commit to
          </h2>
          <ul className="mx-auto mt-8 grid max-w-xl grid-cols-1 gap-3 text-left">
            {principles.map((p, i) => (
              <Reveal key={p} delay={i * 0.07}>
                <li className="clay-card flex items-start gap-3 px-6 py-4 text-sm text-ink">
                  <span className="mt-1.5 size-2.5 shrink-0 rounded-full bg-gold-deep" />
                  {p}
                </li>
              </Reveal>
            ))}
          </ul>
          <Reveal delay={0.2}>
            <p className="mt-10 text-ink-muted">
              Interested in mentoring?{" "}
              <Magnetic strength={0.2}>
                <Link
                  href="/register"
                  className="font-bold text-accent underline decoration-gold underline-offset-4 hover:text-accent-hover"
                >
                  Join the community
                </Link>
              </Magnetic>{" "}
              and mention it — we&apos;ll get in touch.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}