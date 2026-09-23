import { ok } from "@/lib/api";
import { getSettings } from "@/lib/settings";

export async function GET() {
  const settings = await getSettings();
  return ok(settings);
}