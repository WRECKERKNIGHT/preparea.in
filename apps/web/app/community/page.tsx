import type { Metadata } from "next";
import { CheckCircle2, MessagesSquare, Send } from "lucide-react";

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
  },
  {
    icon: Send,
    title: "Telegram",
    use: "Where announcements land",
    body: "Challenge updates, session reminders and important information, delivered to one quiet place.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Community
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
            A safe room for serious students
          </h1>
          <p className="mt-4 text-ink-muted">
            PrepArea is a study community, not a coaching platform. Rules are
            clear from day one — for students, mentors and moderators alike.
          </p>
        </div>
      </section>

      <section className="bg-raised">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {slots.map(({ icon: Icon, title, use, body }) => (
              <div key={title} className="card flex gap-4 p-6">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[6px] bg-accent-light text-accent">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <h2 className="font-medium text-ink">{title}</h2>
                    <p className="text-xs text-ink-faint">{use}</p>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{body}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="mt-14 font-serif text-2xl font-medium text-ink">
            Community rules
          </h2>
          <ul className="mt-6 grid gap-px overflow-hidden rounded-[6px] border border-edge bg-edge sm:grid-cols-2">
            {rules.map((rule) => (
              <li
                key={rule}
                className="flex items-start gap-3 bg-raised px-5 py-4 text-sm text-ink"
              >
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
                {rule}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}