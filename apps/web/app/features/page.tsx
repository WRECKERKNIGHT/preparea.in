import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  LineChart,
  MessagesSquare,
  Mic,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Features",
  description: "What PrepArea includes in the MVP.",
};

const features = [
  {
    icon: Users,
    title: "Virtual study rooms",
    body: "Four scheduled focus sessions a day — Morning, Afternoon, Evening and Night Focus — on Zoom. Founders study alongside you, so the room is never empty.",
  },
  {
    icon: Target,
    title: "Daily targets",
    body: "Set one number each morning: how many hours you'll study today. Stated simply, tracked simply.",
  },
  {
    icon: Clock,
    title: "Study-time tracking",
    body: "Log your time in the app or track live with a built-in timer. Progress is personal — we never rank you against others.",
  },
  {
    icon: CalendarCheck,
    title: "Consistency challenges",
    body: "Start with the 7-Day Challenge: set, study, check in. Then 14-day, 30-day and 100-hour editions.",
  },
  {
    icon: LineChart,
    title: "Personal progress",
    body: "A clean weekly view of the minutes you studied, your streak, and whether you hit today's target.",
  },
  {
    icon: MessagesSquare,
    title: "Community",
    body: "Discord for conversation and subject channels; Telegram for announcements and reminders. Clear rules from day one.",
  },
  {
    icon: Mic,
    title: "Mentor sessions",
    body: "Experienced aspirants share how they planned, what they'd do differently, and how they stayed consistent. Experience, never promises.",
  },
  {
    icon: ShieldCheck,
    title: "A safe environment",
    body: "Strict moderation, privacy-focused by design, and no guaranteed-rank or guaranteed-selection claims allowed.",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Features
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
            Everything you need to keep showing up
          </h1>
          <p className="mt-4 text-ink-muted">
            PrepArea isn&apos;t teaching, coaching or test series. It&apos;s the
            focused environment your material is missing.
          </p>
        </div>
      </section>

      <section className="bg-raised">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="card p-6">
              <span className="flex size-10 items-center justify-center rounded-[6px] bg-accent-light text-accent">
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-serif text-lg font-medium text-ink">
                {title}
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{body}</p>
            </div>
          ))}
        </div>
        <div className="pb-16 text-center">
          <Link href="/register" className="btn-primary">
            Join the first cohort
          </Link>
        </div>
      </section>
    </>
  );
}