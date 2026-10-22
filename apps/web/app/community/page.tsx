import type { Metadata } from "next";
import {
  MessagesSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  Users,
  AlertCircle,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Community — PrepArea",
  description: "PrepArea community guidelines and where to find us.",
};

const rules = [
  { text: "Respect every member. Treat others the way you'd like to be treated.", icon: ShieldCheck },
  { text: "No bullying, harassment or personal attacks — in any channel, at any time.", icon: ShieldCheck },
  { text: "No spam, promotional posts or unsolicited DMs.", icon: AlertCircle },
  { text: "No inappropriate, obscene or inflammatory content.", icon: AlertCircle },
  { text: "No sharing of answers or cheating-related assistance of any kind.", icon: AlertCircle },
  { text: "Do not share your or others' private information in public channels.", icon: ShieldCheck },
  { text: "No guaranteed-rank or guaranteed-selection claims, in any form.", icon: AlertCircle },
  { text: "Mentors must not misrepresent their qualifications or experience.", icon: ShieldCheck },
  { text: "Academic disagreements stay respectful and evidence-based.", icon: ShieldCheck },
  { text: "Moderators can remove content and members who break these rules.", icon: AlertCircle },
];

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        kicker="Community"
        title={
          <>
            A <span className="text-gradient-gold">safe room</span> for serious
            students
          </>
        }
        intro="PrepArea is a study community, not a coaching platform. Rules are clear from day one — for students, mentors and moderators alike."
      />

      {/* Where to find us */}
      <section className="bg-raised py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl md:text-3xl font-black text-ink mb-10" style={{ fontFamily: "var(--font-fraunces)" }}>
            Where to Find Us
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {[
              {
                icon: MessagesSquare,
                title: "Discord",
                use: "Where the community lives",
                body: "Subject and exam channels, casual conversation, and the links to live study rooms. This is where sessions actually start.",
                accent: "from-plum-soft to-plum",
                href: "https://discord.gg/preparea",
              },
              {
                icon: Send,
                title: "Telegram",
                use: "Where announcements land",
                body: "Challenge updates, session reminders and important information, delivered to one quiet place.",
                accent: "from-teal-soft to-teal",
                href: "https://t.me/preparea",
              },
            ].map(({ icon: Icon, title, use, body, accent, href }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <Tilt max={7}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="clay-card-deep flex gap-5 p-7 hover:-translate-y-1 transition-transform duration-200 cursor-pointer">
                      <span className={`clay-icon size-14 shrink-0 rounded-[18px] bg-gradient-to-br ${accent} text-white`}>
                        <Icon className="size-7" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h2 className="font-display text-xl font-black text-ink">{title}</h2>
                          <p className="text-xs font-semibold text-gold-deep">{use}</p>
                        </div>
                        <p className="mt-1 text-ink-muted">{body}</p>
                      </div>
                    </div>
                  </a>
                </Tilt>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Community Rules */}
      <section className="bg-paper py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-2xl md:text-3xl font-black text-ink mb-10" style={{ fontFamily: "var(--font-fraunces)" }}>
            Community Rules
          </h2>
          <ul className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
            {rules.map((rule, i) => (
              <Reveal key={rule.text} delay={(i % 4) * 0.06}>
                <li className="clay-card flex items-start gap-3 px-6 py-4">
                  <span className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${i % 2 === 0 ? "bg-accent" : "bg-gold"}`}>
                    <CheckCircle2 className="size-4 text-white" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-ink leading-relaxed">{rule.text}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl md:text-3xl font-black text-ink mb-6" style={{ fontFamily: "var(--font-fraunces)" }}>
            Want to Be Part of This?
          </h2>
          <p className="text-ink-muted mb-8">
            Join the community and start your journey with us.
          </p>
          <Link href="/register">
            <span className="clay-btn clay-btn-gold px-8 py-4 text-base font-black inline-flex items-center gap-2 shadow-clay-lg glow-gold hover:scale-105 transition-transform duration-200">
              Join PrepArea
              <Users className="size-5" />
            </span>
          </Link>
        </div>
      </section>
    </>
  );
}
