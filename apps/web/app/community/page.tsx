import type { Metadata } from "next";
import { CheckCircle2, MessagesSquare, Send } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";
import { Tilt } from "@/components/fx/tilt";

export const metadata: Metadata = {
  title: "Community",
  description: "PrepArea community guidelines and where to find us.",
};

const rules = [
  "Respect every member. Treat others the way you'd like to be treated.",
  "No bullying, harassment or personal attacks — in any channel, at any time.",
  "No spam, promotional posts or unsolicited DMs.",
  "No inappropriate, obscene or inflammatory content.",
  "No sharing of answers or cheating-related assistance of any kind.",
  "Do not share your or others' private information in public channels.",
  "No guaranteed-rank or guaranteed-selection claims, in any form.",
  "Mentors must not misrepresent their qualifications or experience.",
  "Academic disagreements stay respectful and evidence-based.",
  "Moderators can remove content and members who break these rules.",
];

const slots = [
  {
    icon: MessagesSquare,
    title: "Discord",
    use: "Where the community lives",
    body: "Subject and exam channels, casual conversation, and the links to live study rooms. This is where sessions actually start.",
    accent: "from-plum-soft to-plum",
  },
  {
    icon: Send,
    title: "Telegram",
    use: "Where announcements land",
    body: "Challenge updates, session reminders and important information, delivered to one quiet place.",
    accent: "from-teal-soft to-teal",
  },
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

      <section className="bg-raised py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {slots.map(({ icon: Icon, title, use, body, accent }, i) => (
              <Reveal key={title} delay={i * 0.12}>
                <Tilt max={7}>
                  <div className="clay-card-deep flex gap-5 p-7">
                    <span
                      className={`clay-icon size-14 shrink-0 rounded-[18px] bg-gradient-to-br ${accent} text-white`}
                    >
                      <Icon className="size-7" aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h2 className="font-display text-xl font-black text-ink">
                          {title}
                        </h2>
                        <p className="text-xs font-semibold text-gold-deep">
                          {use}
                        </p>
                      </div>
                      <p className="mt-1 text-ink-muted">{body}</p>
                    </div>
                  </div>
                </Tilt>
              </Reveal>
            ))}
          </div>

          <h2 className="mt-16 text-center font-display text-3xl font-black text-ink">
            Community rules
          </h2>
          <ul className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-3 sm:grid-cols-2">
            {rules.map((rule, i) => (
              <Reveal key={rule} delay={(i % 2) * 0.06}>
                <li className="clay-card flex items-start gap-3 px-6 py-4">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-light to-accent">
                    <CheckCircle2 className="size-4 text-accent" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-ink">{rule}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}