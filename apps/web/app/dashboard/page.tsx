import type { Metadata } from "next";
import { DashboardClient } from "@/components/dashboard-client";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your PrepArea study dashboard.",
};

export default function DashboardPage() {
  return (
    <section className="bg-paper">
      <DashboardClient />
    </section>
  );
}