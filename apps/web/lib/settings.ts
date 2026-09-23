import type { PublicSettings } from "@preparea/shared";
import { getStore } from "@/lib/store";

const fallback: PublicSettings = {
  announcement:
    "The first 7-Day Consistency Challenge cohort is open. Evening check-ins before 11 PM, please.",
  activeChallengeId: undefined,
  telegramUrl: "https://t.me/preparea_announcements",
  discordUrl: "https://discord.gg/preparea",
};

export async function getSettings(): Promise<PublicSettings> {
  try {
    const store = getStore();
    const settings = await store.getSettings();
    return { ...fallback, ...settings };
  } catch {
    return fallback;
  }
}