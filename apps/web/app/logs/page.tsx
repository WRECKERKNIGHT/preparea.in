import StudyTimer from "@/components/study-timer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study Timer - PrepArea",
  description: "Track your study sessions with the built-in timer",
};

export default function StudyTimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <StudyTimer />
    </div>
  );
}