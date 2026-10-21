import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Reveal } from "@/components/fx/reveal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using PrepArea.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    body: "By accessing or using PrepArea, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.",
  },
  {
    title: "Account Responsibilities",
    body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate and complete information when registering.",
  },
  {
    title: "User Conduct",
    body: "You agree not to misuse our services, attempt to gain unauthorized access to systems, transmit harmful code, or violate any applicable laws or regulations.",
  },
  {
    title: "Intellectual Property",
    body: "All content, features, and functionality are owned by PrepArea and are protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without permission.",
  },
  {
    title: "Privacy",
    body: "Your use of our services is also governed by our Privacy Policy. By using PrepArea, you consent to the collection and use of information as described therein.",
  },
  {
    title: "Termination",
    body: "We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason with appropriate notice.",
  },
  {
    title: "Limitation of Liability",
    body: "PrepArea shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.",
  },
  {
    title: "Changes to Terms",
    body: "We may update these terms periodically. Continued use after changes constitutes acceptance of the updated terms. We will notify users of significant changes.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        kicker="Terms"
        title={
          <>
            Our{" "}
            <span className="text-gradient-gold">terms</span>
          </>
        }
        intro="Please read these terms carefully before using our services."
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
