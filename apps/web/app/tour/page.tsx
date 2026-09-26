import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpen,
  CalendarCheck,
  Clock,
  Compass,
  HeartHandshake,
  LineChart,
  ListChecks,
  MessagesSquare,
  Mic,
  ShieldCheck,
  Sparkles,
  Sun,
  Sunset,
  Timer,
  Users,
  Target,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import { Magnetic } from "@/components/fx/magnetic";

export const metadata: Metadata = {
  title: "How PrepArea works — your 5-minute guide",
  description:
    "What PrepArea is built for, every feature, when sessions happen, how the daily loop works, the challenge rules and your free trial.",
};

const pillars = [
  {
    icon: Users,
    title: "A study community",
    body: "PrepArea is not a coaching platform. No lectures, no courses, no guaranteed ranks. We bring together JEE, NEET, CUET and board aspirants who have decided to study — and study together.",
  },
  {
    icon: HeartHandshake,
    title: "Built on accountability",
    body: "The whole mechanic is simple: you say today's target out loud, you study, you check in at night. Your streak is your own — we never rank you against others.",
  },
  {
    icon: Sparkles,
    title: "Run by aspirants, for aspirants",
    body: "The founders are preparing themselves. Study rooms are never empty because we're in them. Mentor sessions are honest experience — never promises.",
  },
];

const dailyLoop = [
  {
    icon: Sun,
    step: "01 · Morning",
    title: "Set today's target",
    body: "One number: how many minutes you'll study today. 60, 240, 300 — whatever is honest for you.",
  },
  {
    icon: Timer,
    step: "02 · Daytime",
    title: "Study",
    body: "Join a focus room on Zoom and study with others, or work solo and log your minutes in the app.",
  },
  {
    icon: Sunset,
    step: "03 · Evening",
    title: "Check in",
    body: "Before 11 PM, close your circle by checking in. Hit your target? Green dot. Partway? Partial. Missed? No shame — tomorrow counts.",
  },
  {
    icon: CalendarCheck,
    step: "04 · Repeat",
    title: "Build the streak",
    body: "Days stack into a streak. The 7-Day Challenge turns that one good day into a habit you can feel.",
  },
];

const rooms = [
  { icon: Sun, name: "Morning Focus", time: "6:00 – 8:00 AM", note: "Start the day with early risers." },
  { icon: Compass, name: "Afternoon Focus", time: "1:00 – 3:00 PM", note: "A productive mid-day reset." },
  { icon: Sunset, name: "Evening Focus", time: "6:00 – 9:00 PM", note: "The busiest session — four founders study with you." },
  { icon: Moon, name: "Night Focus", time: "10:00 PM – 12:00 AM", note: "For the owls and late-night workers." },
];

const featureList = [
  { icon: Users, title: "Virtual study rooms", body: "Four scheduled Zoom focus sessions every single day. Show up, mute, study." },
  { icon: Target, title: "Daily targets", body: "Set one number each morning. Stated simply, tracked simply." },
  { icon: LineChart, title: "Personal progress", body: "Weekly minutes, today's target, and a streak — your view only." },
  { icon: CalendarCheck, title: "Consistency challenges", body: "Start with the free 7-Day Challenge, then 14/30-day and 100-hour editions." },
  { icon: MessagesSquare, title: "Community", body: "Discord for subject channels and conversation; Telegram for announcements." },
  { icon: Mic, title: "Mentor sessions", body: "Aspirants who've been through it share what actually worked." },
];

const rules = [
  "One rule above all: no comparing hours. Your target is between you and your streak.",
  "Keep study rooms focused — cameras optional, staying on-task required.",
  "Share Discord subject channels with genuine questions; helpfulness over noise.",
  "No guaranteed-rank or guaranteed-selection claims. Ever. Any session found doing this is removed.",
  "Be kind. This community runs on trust between students.",
];

function Moon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export default function TourPage() {
  return (
    <>
      <PageHeader
        kicker="Your 5-minute guide"
        title={
          <>
            How <span className="text-gradient-gold">PrepArea</span> works
          </>
        }
        intro="What this is for, every feature, when sessions happen, and how the daily loop turns one good day into a lasting habit."
      />

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            kicker="The big picture"
            title="Built for one job: helping you study"
            intro="Everything here exists to make consistency easier, not to add another layer of prep pressure."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <Tilt className="h-full" max={6}>
                  <div className="clay-card h-full p-7">
                    <span className="clay-icon inline-flex size-12 rounded-2xl bg-gradient-to-br from-accent-light to-accent text-accent">
                      <p.icon className="size-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-xl font-bold text-ink">
                      {p.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">
                      {p.body}
                    </p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="clay-card-deep flex flex-col items-center gap-6 overflow-hidden p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
              <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-full shadow-clay ring-4 ring-gold/30 sm:h-48 sm:w-48">
                <Image
                  src="/brand-og.jpg"
                  alt="PrepArea community studying together"
                  fill
                  sizes="192px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-2xl font-black text-ink">
                  The founders study with you.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  Every focus room runs with PrepArea founders present — so you
                  are never the only one in the room. That is the whole trick:
                  you show up because someone else already has. Your 7-day free
                  trial includes your first challenge free.
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent underline decoration-gold underline-offset-4 hover:text-accent-hover"
                >
                  Start your free trial
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-raised">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="the-loop"
            kicker="Your day, step by step"
            title="The daily loop"
            intro="Four tiny actions a day. That is the entire PrepArea habit."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dailyLoop.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="clay-card h-full p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">
                    {s.step}
                  </p>
                  <span className="mt-4 inline-flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-light to-gold text-gold-deep">
                    <s.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="flex flex-col items-center gap-2 rounded-3xl border border-gold/30 bg-gold/10 p-6 text-center">
              <Clock className="size-6 text-gold-deep" aria-hidden="true" />
              <p className="max-w-xl text-sm leading-relaxed text-ink">
                <strong className="font-bold text-ink">Timing:</strong> set your
                target as early as you like, study any time of day, and close
                your check-in{" "}
                <strong className="font-bold text-ink">before 11 PM</strong>.
                Miss the window? It counts as a miss — and tomorrow has a fresh
                24 hours.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="rooms"
            kicker="Always a place to study"
            title="Study rooms, every day"
            intro="Four focus sessions run daily on Zoom. Walk in muted, click away."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {rooms.map((r, i) => (
              <Reveal key={r.name} delay={i * 0.07}>
                <Tilt max={6} className="h-full">
                  <div className="clay-card-deep flex items-start gap-5 p-6">
                    <span className="clay-icon inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-soft to-teal text-teal">
                      <r.icon className="size-6" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-bold text-ink">
                        {r.name}
                      </h3>
                      <p className="text-sm font-semibold text-accent">
                        {r.time}
                      </p>
                      <p className="mt-1.5 text-sm text-ink-muted">{r.note}</p>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-raised">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="features"
            kicker="Everything inside"
            title="Every feature, plainly listed"
            intro="No hidden tiers. This is the whole of PrepArea today, and what the roadmap extends."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureList.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <Tilt max={6} className="h-full">
                  <div className="clay-card h-full p-6">
                    <span className="clay-icon inline-flex size-11 rounded-2xl bg-gradient-to-br from-plum-soft to-plum text-plum">
                      <f.icon className="size-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                      {f.body}
                    </p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            id="rules"
            kicker="Keep it healthy"
            title="The rules"
            intro="Five simple clauses keep this place useful instead of stressful."
          />
          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {rules.map((rule, i) => (
              <Reveal key={rule} delay={i * 0.05}>
                <div className="clay-card flex items-start gap-4 p-5">
                  <span className="clay-icon mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-light to-gold font-display text-sm font-black text-gold-deep">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-ink">{rule}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-night py-20 sm:py-24">
        <div
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage:
              "radial-gradient(700px 400px at 20% 0%, rgba(124,92,219,0.22), transparent 60%), radial-gradient(700px 400px at 85% 90%, rgba(240,184,74,0.14), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <Container className="text-center">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold-soft">
              <Bell className="size-3.5" aria-hidden="true" />
              What&apos;s next for you
            </p>
            <h2 className="mx-auto max-w-2xl font-display text-4xl font-black leading-tight text-white sm:text-5xl">
              Seven days. Then it becomes a habit.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/70">
              Your 7-day free trial includes the full app and your first
              challenge. Sign up, set the first target tonight, and check in
              before 11 PM.
            </p>
            <Reveal delay={0.1}>
              <div className="mt-9 inline-flex">
                <Magnetic strength={0.25}>
                  <span className="clay-btn clay-btn-emerald px-8 py-4 text-base">
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2"
                    >
                      Start your 7-day free trial
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </Link>
                  </span>
                </Magnetic>
              </div>
            </Reveal>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/50">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-gold-soft" aria-hidden="true" /> No card needed
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ListChecks className="size-4 text-gold-soft" aria-hidden="true" /> Free challenge included
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-4 text-gold-soft" aria-hidden="true" /> Cancel anytime
              </span>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}