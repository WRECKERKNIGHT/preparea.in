import Link from "next/link";
import {
  ArrowRight,
  Clock,
  Target,
  Users,
  CalendarCheck,
  LineChart,
  BookOpen,
  Mic,
  MessagesSquare,
  CheckCircle2,
  MessageSquare,
  Send,
  ListChecks,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";

const loop = [
  { icon: Target, label: "Set goal" },
  { icon: Users, label: "Join study room" },
  { icon: BookOpen, label: "Study" },
  { icon: Clock, label: "Track time" },
  { icon: CalendarCheck, label: "Check in" },
  { icon: LineChart, label: "See progress" },
  { icon: CheckCircle2, label: "Return tomorrow" },
];

const rooms = [
  { name: "Morning Focus", time: "6:00 – 8:00 AM", hint: "Start the day strong" },
  { name: "Afternoon Focus", time: "1:00 – 3:00 PM", hint: "Post-school reset" },
  { name: "Evening Focus", time: "6:00 – 9:00 PM", hint: "Deep study block" },
  { name: "Night Focus", time: "10:00 PM – 12:00 AM", hint: "Quiet, laser hours" },
];

const steps = [
  {
    icon: Users,
    title: "Join",
    body: "Register in under a minute. Just name, class, exam, and a daily study target.",
  },
  {
    icon: Target,
    title: "Set a daily target",
    body: "Decide how many hours you'll study today. One number, stated out loud.",
  },
  {
    icon: CalendarCheck,
    title: "Show up",
    body: "Join a scheduled study room. Study alongside serious aspirants. Check in at the end of the day.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <Container className="py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-edge bg-raised px-3.5 py-1.5 text-xs font-semibold text-ink-muted">
              For JEE, NEET, CUET &amp; board aspirants
            </p>
            <h1 className="font-serif text-4xl font-medium leading-[1.1] tracking-tight text-ink sm:text-6xl">
              Study together.
              <br />
              Stay accountable. Build consistency.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted">
              PrepArea is a study community for competitive-exam aspirants.
              Virtual study rooms, daily check-ins, consistency challenges and
              practical guidance from people who&rsquo;ve done the journey.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="btn-primary">
                Join the community
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link href="/#how-it-works" className="btn-ghost">
                How it works
              </Link>
            </div>
          </div>

          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 divide-y divide-edge rounded-[6px] border border-edge bg-raised sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              ["20", "students in the first cohort"],
              ["7 days", "consistency challenge"],
              ["100%", "focused on consistency"],
            ].map(([stat, label]) => (
              <div key={label} className="px-6 py-6 text-center">
                <p className="font-serif text-3xl font-medium text-ink">
                  {stat}
                </p>
                <p className="mt-1 text-sm text-ink-muted">{label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper">
        <Container className="py-20">
          <SectionHeading
            kicker="The daily loop"
            title="Consistency is a system, not a mood"
            intro="The same loop, every day. Set a goal, study with others, track it, check in."
          />
          <ol className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-edge bg-edge sm:grid-cols-4 lg:grid-cols-7">
            {loop.map(({ icon: Icon, label }, i) => (
              <li
                key={label}
                className="flex flex-col items-center gap-3 bg-raised px-4 py-6 text-center"
              >
                <span className="flex size-10 items-center justify-center rounded-[6px] bg-accent-light text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-ink">{label}</span>
                <span
                  className="text-xs font-semibold uppercase tracking-widest text-ink-faint"
                  aria-hidden="true"
                >
                  0{i + 1}
                </span>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-t border-edge bg-raised">
        <Container className="py-20">
          <SectionHeading
            kicker="How it works"
            title="From registration to your first session in minutes"
            intro="No setup, no teaching, no extra tools to learn. Just show up."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="card p-7">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-[6px] bg-accent-light text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="font-serif text-sm font-semibold text-ink-faint">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-medium text-ink">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-edge bg-paper">
        <Container className="py-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Virtual study rooms
              </p>
              <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
                Empty room? Never. Show up, cameras on, books out.
              </h2>
              <p className="mt-4 text-ink-muted">
                Scheduled focus sessions run every day — a room is never truly
                empty because founders study alongside you. Pick your slot and
                join on Zoom in one tap.
              </p>
              <ul className="mt-8 space-y-4">
                {rooms.map((room) => (
                  <li
                    key={room.name}
                    className="flex items-center justify-between gap-4 border-b border-edge pb-4"
                  >
                    <div>
                      <p className="font-medium text-ink">{room.name}</p>
                      <p className="text-sm text-ink-muted">{room.hint}</p>
                    </div>
                    <p className="text-sm font-medium text-ink-muted number">
                      {room.time}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                A session, start to finish
              </p>
              <ol className="mt-6 space-y-6">
                {[
                  { step: "1", phase: "Before", text: "Set your target for this session. One number." },
                  { step: "2", phase: "During", text: "Study together. Everyone on mute, heads down." },
                  { step: "3", phase: "After", text: "Report completion. Log your hours. Done for the day." },
                ].map(({ step, phase, text }) => (
                  <li key={phase} className="flex gap-4">
                    <span className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full border border-accent text-xs font-semibold text-accent">
                      {step}
                    </span>
                    <div>
                      <h3 className="font-medium text-ink">{phase}</h3>
                      <p className="text-sm text-ink-muted">{text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-edge bg-accent">
        <Container className="py-16">
          <div className="mx-auto max-w-3xl text-center text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-light">
              7-Day Study Consistency Challenge
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium sm:text-4xl">
              Seven days. One target a day. Your streak counts.
            </h2>
            <p className="mt-4 text-accent-light">
              Morning: set the target. Evening: report what you completed. No
              shaming for a missed day — just tomorrow. Future challenges
              include 14-day, 30-day and 100-hour editions.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-[6px] bg-white px-6 py-3 font-semibold text-accent transition-colors hover:bg-accent-light"
            >
              Join the next cohort
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Container>
      </section>

      <section className="border-t border-edge bg-paper">
        <Container className="py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                Accountability
              </p>
              <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
                Simple checks, not performance anxiety
              </h2>
              <p className="mt-4 text-ink-muted">
                Every day is three small actions. The aim is personal
                consistency — we never rank you against anyone or celebrate
                unhealthy study hours.
              </p>
            </div>
            <div className="card divide-y divide-edge">
              {[
                ["Morning", "“Today's target: 5 hours”"],
                ["Evening", "“Completed: 4.5 hours”"],
                ["Tomorrow", "“Target: 5 hours — you've got this.”"],
              ].map(([time, script]) => (
                <div key={time} className="flex items-center gap-4 px-6 py-4">
                  <span className="w-20 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                    {time}
                  </span>
                  <p className="font-serif text-lg italic text-ink">{script}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-edge bg-raised">
        <Container className="py-20">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="card p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                For experienced aspirants
              </p>
              <h2 className="mt-3 font-serif text-2xl font-medium text-ink">
                You&rsquo;ve done the journey. Help someone through it.
              </h2>
              <p className="mt-3 text-sm text-ink-muted">
                Run a mentor session on how you planned, what you&rsquo;d do
                differently, and how you stayed consistent. Share experience —
                never promises.
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-edge pt-6">
                <span className="flex size-10 items-center justify-center rounded-full bg-accent-light text-accent">
                  <Mic className="size-5" aria-hidden="true" />
                </span>
                <div className="text-sm">
                  <p className="font-medium text-ink">Example topics</p>
                  <p className="text-ink-muted">
                    Revision strategy · School + coaching balance · Exam-day
                    experience
                  </p>
                </div>
              </div>
              <Link href="/mentors" className="btn-ghost mt-6">
                Read more
              </Link>
            </div>
            <div className="grid gap-4">
              {[
                {
                  icon: MessagesSquare,
                  title: "Discord",
                  marker: "Where the community lives",
                  body: "Subject channels, exam groups, casual chat, and links to live study rooms.",
                },
                {
                  icon: Send,
                  title: "Telegram",
                  marker: "Where announcements land",
                  body: "Challenge updates, session reminders and important information, in one place.",
                },
              ].map(({ icon: Icon, title, marker, body }) => (
                <div key={title} className="card flex gap-4 p-6">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-[6px] bg-accent-light text-accent">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <h3 className="font-medium text-ink">{title}</h3>
                      <p className="text-xs text-ink-faint">{marker}</p>
                    </div>
                    <p className="mt-1 text-sm text-ink-muted">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t border-edge bg-paper">
        <Container className="py-20">
          <SectionHeading
            kicker="Community rules"
            title="A safe room for serious students"
            intro="Clear rules from day one. PrepArea is for focused, respectful study."
          />
          <ul className="mx-auto mt-10 grid max-w-4xl gap-px overflow-hidden rounded-[6px] border border-edge bg-edge sm:grid-cols-2">
            {[
              "Respect every member",
              "No bullying or harassment",
              "No spam or promotional posts",
              "No inappropriate content",
              "No cheating-related help",
              "No sharing private information",
              "No guaranteed-rank claims",
              "Respectful academic disagreement",
            ].map((rule) => (
              <li
                key={rule}
                className="flex items-center gap-3 bg-raised px-5 py-4 text-sm font-medium text-ink"
              >
                <CheckCircle2 className="size-4 shrink-0 text-accent" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-edge bg-raised">
        <Container className="py-20 text-center">
          <ListChecks className="mx-auto size-8 text-accent" aria-hidden="true" />
          <h2 className="mx-auto mt-4 max-w-xl font-serif text-3xl font-medium text-ink sm:text-4xl">
            The first milestone isn&rsquo;t an app. It&rsquo;s 20 students, 7 days, and
            people who come back tomorrow.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-ink-muted">
            Registration is free for the first cohort. Spots are limited so the
            rooms stay focused.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register" className="btn-primary">
              Reserve your spot
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link href="/faq" className="btn-ghost">
              Questions first?
            </Link>
          </div>
          <p className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-faint">
            <MessageSquare className="size-3.5" aria-hidden="true" />
            For student creators and groups: referrals are welcome — reach out
            on Instagram.
          </p>
        </Container>
      </section>
    </>
  );
}