import { ok, err, getSession, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { StudyLogInput } from "@preparea/shared";

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to log study time.", 401);

  const body = await readJson(req);
  const minutes = Number(body.minutes);
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 1440) {
    return err("invalid_minutes", "Minutes must be between 1 and 1440.");
  }

  const input: StudyLogInput = {
    minutes,
    roomId: body.roomId ? String(body.roomId) : undefined,
    note: body.note ? String(body.note) : undefined,
    source: body.source === "timer" ? "timer" : undefined,
  };

  const log = await getStore().logStudy(session.sub, input);
  return ok(log);
}