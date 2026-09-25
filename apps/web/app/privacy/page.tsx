import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";

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
      <PageHeader
        kicker="Privacy"
        title={
          <>
            Your information, kept{" "}
            <span className="text-gradient-gold">minimal</span>
          </>
        }
        intro="We collect the least we need and protect what we hold."
      />

      <section className="bg-raised py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4">
            {sections.map(({ title, body }, i) => (
              <Reveal key={title} delay={(i % 2) * 0.07}>
                <div className="clay-card-deep p-7">
                  <h2 className="font-display text-xl font-black text-ink">
                    {title}
                  </h2>
                  <p className="mt-2 text-ink-muted">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}