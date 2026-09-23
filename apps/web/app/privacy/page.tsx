import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How PrepArea handles your information.",
};

const sections = [
  {
    title: "What we collect",
    body: "Only what's needed to run the community: name, class, exam, email, optional Telegram/Discord username, an approximate daily study target, and your stated consistency challenge. We don't ask for sensitive personal information.",
  },
  {
    title: "Why we collect it",
    body: "To register you, send community invites and check-in reminders, and understand what our members need help with.",
  },
  {
    title: "What we don't do",
    body: "We don't publish member details publicly, don't sell or rent your data, and don't build advertising profiles from it.",
  },
  {
    title: "Where it lives",
    body: "Member data is stored in a private Google Spreadsheet accessible only to the PrepArea team. Login codes are emailed to you and expire in 10 minutes.",
  },
  {
    title: "Who can see it",
    body: "Founders and moderators administer the community. Other students never see your private information. You are a minor's product, treated with the care that requires.",
  },
  {
    title: "Your rights",
    body: "You can ask to review, correct or delete your data at any time, and you can leave the community whenever you like. Contact us at privacy@preparea.in.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="border-b border-edge bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Privacy
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink">
            Your information, kept minimal
          </h1>
          <p className="mt-4 text-ink-muted">
            We collect the least we need and protect what we hold.
          </p>
        </div>
      </section>

      <section className="bg-raised">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="space-y-px overflow-hidden rounded-[6px] border border-edge bg-edge">
            {sections.map(({ title, body }) => (
              <div key={title} className="bg-raised p-6">
                <h2 className="font-serif text-lg font-medium text-ink">{title}</h2>
                <p className="mt-2 text-sm text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}