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
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import { Magnetic } from "@/components/fx/magnetic";

export const metadata: Metadata = {
  title: "Features",
  description: "What PrepArea includes in the MVP.",
};

const features = [
  {
    icon: Users,
    title: "Virtual study rooms",
    body: "Four scheduled focus sessions a day — Morning, Afternoon, Evening and Night Focus — on Zoom. Founders study alongside you, so the room is never empty.",
    accent: "from-accent-light to-accent",
  },
  {
    icon: Target,
    title: "Daily targets",
    body: "Set one number each morning: how many hours you'll study today. Stated simply, tracked simply.",
    accent: "from-gold-light to-gold",
  },
  {
    icon: Clock,
    title: "Study-time tracking",
    body: "Log your time in the app or track live with a built-in timer. Progress is personal — we never rank you against others.",
    accent: "from-teal-soft to-teal",
  },
  {
    icon: CalendarCheck,
    title: "Consistency challenges",
    body: "Start with the 7-Day Challenge: set, study, check in. Then 14-day, 30-day and 100-hour editions.",
    accent: "from-plum-soft to-plum",
  },
  {
    icon: LineChart,
    title: "Personal progress",
    body: "A clean weekly view of the minutes you studied, your streak, and whether you hit today's target.",
    accent: "from-accent-light to-accent",
  },
  {
    icon: MessagesSquare,
    title: "Community",
    body: "Discord for conversation and subject channels; Telegram for announcements and reminders. Clear rules from day one.",
    accent: "from-teal-soft to-teal",
  },
  {
    icon: Mic,
    title: "Mentor sessions",
    body: "Experienced aspirants share how they planned, what they'd do differently, and how they stayed consistent. Experience, never promises.",
    accent: "from-plum-soft to-plum",
  },
  {
    icon: ShieldCheck,
    title: "A safe environment",
    body: "Strict moderation, privacy-focused by design, and no guaranteed-rank or guaranteed-selection claims allowed.",
    accent: "from-gold-light to-gold",
  },
];

export default function FeaturesPage() {
  return (
    <>
      <PageHeader
        kicker="Features"
        title={
          <>
            Everything you need to{" "}
            <span className="text-gradient-gold">keep showing up</span>
          </>
        }
        intro="PrepArea isn't teaching, coaching or test series. It's the focused environment your material is missing."
      />

      <section className="bg-raised py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, body, accent }, i) => (
            <Reveal key={title} delay={(i % 4) * 0.08}>
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
        <div className="pb-16 pt-8 text-center">
          <Magnetic strength={0.25}>
            <span className="clay-btn clay-btn-gold px-8 py-3.5 text-base">
              <Link href="/register">Join the first cohort</Link>
            </span>
          </Magnetic>
        </div>
      </section>
    </>
  );
}