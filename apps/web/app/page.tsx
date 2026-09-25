import Link from "next/link";
import {
  ArrowRight,
  Mic,
  MessagesSquare,
  Send,
  CheckCircle2,
  ListChecks,
  Crown,
  Clock,
} from "lucide-react";
import { Container, SectionHeading } from "@/components/ui";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import { Magnetic } from "@/components/fx/magnetic";
import { HeroScene } from "@/components/fx/hero-scene";
import { MarqueeStrip, StatsStrip } from "@/components/fx/stats-strip";
import { LoopScroll } from "@/components/fx/loop-scroll";
import { NightChallenge } from "@/components/fx/night-challenge";

const steps = [
  {
    icon: Crown,
    title: "Join",
    body: "Register in under a minute. Just name, class, exam, and a daily study target.",
    accent: "from-gold-light to-gold",
  },
  {
    icon: Clock,
    title: "Set a daily target",
    body: "Decide how many hours you'll study today. One number, stated out loud.",
    accent: "from-accent-light to-accent",
  },
  {
    icon: ListChecks,
    title: "Show up",
    body: "Join a scheduled study room. Study alongside serious aspirants. Check in at the end of the day.",
    accent: "from-teal-soft to-teal",
  },
];

const rooms = [
  { name: "The Morning Tower", time: "6:00 – 8:00 AM", hint: "Start the day strong" },
  { name: "The Noon Walk", time: "1:00 – 3:00 PM", hint: "Post-school reset" },
  { name: "The Evening Hall", time: "6:00 – 9:00 PM", hint: "Deep study block" },
  { name: "The Midnight Archive", time: "10:00 PM – 12:00 AM", hint: "Quiet, laser hours" },
];

const scripts = [
  ["Morning", "“Today's target: 5 hours”"],
  ["Evening", "“Completed: 4.5 hours”"],
  ["Tomorrow", "“Target: 5 hours — you've got this.”"],
];

const guides = [
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
];

const rules = [
  "Respect every member",
  "No bullying or harassment",
  "No spam or promotional posts",
  "No inappropriate content",
  "No cheating-related help",
  "No sharing private information",
  "No guaranteed-rank claims",
  "Respectful academic disagreement",
];

export default function LandingPage() {
  return (
    <>
      <HeroScene />
      <MarqueeStrip />
      <StatsStrip />

      <LoopScroll />

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 bg-raised py-20">
        <Container>
          <SectionHeading
            kicker="How it works"
            title="From registration to your first session in minutes"
            intro="No setup, no teaching, no extra tools to learn. Just show up."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, body, accent }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <Tilt max={9}>
                  <div className="clay-card-deep relative p-8">
                    <span
                      className={`clay-icon size-14 rounded-[20px] bg-gradient-to-br ${accent} text-ink shadow-clay`}
                    >
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <span className="absolute right-6 top-6 font-display text-4xl font-black text-ink-faint/40">
                      0{i + 1}
                    </span>
                    <h3 className="mt-5 font-display text-2xl font-black text-ink">
                      {title}
                    </h3>
                    <p className="mt-2 text-ink-muted">{body}</p>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Study rooms */}
      <section className="bg-paper py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="clay-chip mb-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Virtual study rooms
              </p>
              <h2 className="font-display text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Empty room?{" "}
                <span className="text-gradient-gold">Never.</span> Show up,
                cameras on, books out.
              </h2>
              <p className="mt-5 text-lg text-ink-muted">
                Scheduled focus sessions run every day — a room is never truly
                empty because founders study alongside you. Pick your slot and
                join on Zoom in one tap.
              </p>
              <div className="mt-8 space-y-3">
                {rooms.map((room, i) => (
                  <Reveal key={room.name} delay={i * 0.08}>
                    <div className="clay-card group flex items-center justify-between gap-4 px-6 py-4 transition-transform duration-200 hover:-translate-y-0.5">
                      <div>
                        <p className="font-display text-lg font-bold text-ink">
                          {room.name}
                        </p>
                        <p className="text-sm text-ink-muted">{room.hint}</p>
                      </div>
                      <p className="number text-sm font-bold text-ink-muted">
                        {room.time}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.15} x={30}>
              <div className="clay-card-deep p-9">
                <p className="clay-chip inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  A session, start to finish
                </p>
                <ol className="mt-8 space-y-7">
                  {[
                    { step: "1", phase: "Before", text: "Set your target for this session. One number." },
                    { step: "2", phase: "During", text: "Study together. Everyone on mute, heads down." },
                    { step: "3", phase: "After", text: "Report completion. Log your hours. Done for the day." },
                  ].map(({ step, phase, text }) => (
                    <li key={phase} className="flex gap-4" data-step>
                      <span
                        className="clay-icon mt-0.5 size-9 shrink-0 rounded-full bg-gradient-to-br from-accent-light to-accent text-accent font-display text-base font-black"
                      >
                        {step}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink">
                          {phase}
                        </h3>
                        <p className="text-ink-muted">{text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className="mt-8 h-2 overflow-hidden rounded-full bg-edge/60">
                  <div
                    className="h-full w-full rounded-full bg-gradient-to-r from-accent via-gold to-plum"
                    style={{ animation: "shimmer 4s linear infinite", backgroundSize: "200% 100%" }}
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <NightChallenge />

      {/* Accountability */}
      <section className="bg-paper py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="clay-chip mb-4 inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                Accountability
              </p>
              <h2 className="font-display text-4xl font-black leading-[1.08] tracking-tight text-ink sm:text-5xl">
                Simple checks, not{" "}
                <span className="text-gradient-gold">performance anxiety</span>
              </h2>
              <p className="mt-5 text-lg text-ink-muted">
                Every day is three small actions. The aim is personal consistency
                — we never rank you against anyone or celebrate unhealthy study
                hours.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="clay-card-deep divide-y divide-edge/70">
                {scripts.map(([time, quote]) => (
                  <div key={time} className="flex flex-col gap-1 px-8 py-6 sm:flex-row sm:items-center sm:gap-6">
                    <span className="clay-chip inline-flex w-fit items-center px-4 py-1 text-xs font-bold uppercase tracking-wider text-accent">
                      {time}
                    </span>
                    <p className="font-serif text-xl italic text-ink sm:text-2xl">
                      {quote}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Mentorship + community */}
      <section className="bg-raised py-20">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <div className="clay-card-deep p-9">
                <p className="clay-chip inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-accent">
                  For experienced aspirants
                </p>
                <h2 className="mt-4 font-display text-3xl font-black leading-tight text-ink">
                  You&rsquo;ve done the journey.{" "}
                  <span className="text-gradient-gold">Help someone</span>{" "}
                  through it.
                </h2>
                <p className="mt-3 text-ink-muted">
                  Run a mentor session on how you planned, what you&rsquo;d do
                  differently, and how you stayed consistent. Share experience —
                  never promises.
                </p>
                <div className="mt-7 flex items-center gap-4 rounded-2xl border border-edge bg-raised p-5">
                  <span className="clay-icon size-12 rounded-full bg-gradient-to-br from-plum-soft to-plum text-white">
                    <Mic className="size-6" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-bold text-ink">Example topics</p>
                    <p className="text-sm text-ink-muted">
                      Revision strategy · School + coaching balance · Exam-day experience
                    </p>
                  </div>
                </div>
                <Magnetic strength={0.2}>
                  <span className="clay-btn clay-btn-outline mt-7 px-6 py-3 text-sm">
                    <Link href="/mentors">Read more</Link>
                  </span>
                </Magnetic>
              </div>
            </Reveal>
            <div className="grid gap-5">
              {guides.map(({ icon: Icon, title, marker, body }, i) => (
                <Reveal key={title} delay={i * 0.12}>
                  <Tilt max={7}>
                    <div className="clay-card-deep flex gap-5 p-7">
                      <span className="clay-icon size-12 shrink-0 rounded-[18px] bg-gradient-to-br from-accent-light to-accent text-accent">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className="font-display text-xl font-black text-ink">{title}</h3>
                          <p className="text-xs font-semibold text-gold-deep">{marker}</p>
                        </div>
                        <p className="mt-1 text-ink-muted">{body}</p>
                      </div>
                    </div>
                  </Tilt>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Rules */}
      <section className="bg-paper py-20">
        <Container>
          <SectionHeading
            kicker="Community rules"
            title="A safe room for serious students"
            intro="Clear rules from day one. PrepArea is for focused, respectful study."
          />
          <ul className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
            {rules.map((rule, i) => (
              <Reveal key={rule} delay={(i % 2) * 0.08}>
                <li className="clay-card flex items-center gap-3 px-6 py-4">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-light to-accent text-accent">
                    <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-ink">{rule}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-night py-24 text-white">
        <div className="absolute inset-0 stars opacity-70" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(700px 420px at 12% 0%, rgba(124,92,219,0.35), transparent 60%), radial-gradient(600px 380px at 90% 100%, rgba(240,184,74,0.22), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <Container>
          <div className="relative mx-auto max-w-2xl text-center">
            <Reveal>
              <ListChecks className="mx-auto size-10 text-gold" aria-hidden="true" />
              <h2 className="mt-6 font-display text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                The first milestone isn&rsquo;t an app. It&rsquo;s{" "}
                <span className="shimmer-text">20 students, 7 days</span>, and
                people who come back tomorrow.
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-lg text-white/70">
                Registration is free for the first cohort. Spots are limited so
                the rooms stay focused.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Magnetic strength={0.25}>
                  <span className="clay-btn clay-btn-gold px-8 py-4 text-base glow-gold">
                    <Link href="/register" className="inline-flex items-center gap-2">
                      Reserve your spot
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </Link>
                  </span>
                </Magnetic>
                <span className="clay-btn clay-btn-night px-7 py-4 text-base">
                  <Link href="/faq">Questions first?</Link>
                </span>
              </div>
              <p className="mt-10 flex items-center justify-center gap-2 text-sm text-white/50">
                For student creators and groups: referrals are welcome — reach
                out on Instagram.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}