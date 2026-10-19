import { ok, err, getSession, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { StudyLogInput } from "@preparea/shared";

export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) return err("unauthorized", "Unauthorized", 401);

    const body = await readJson(req);
    const minutes = Number(body.minutes);
    if (!Number.isFinite(minutes) || minutes <= 0) {
      return err("invalid_input", "Minutes must be positive", 400);
    }

    const input: StudyLogInput = {
      minutes,
      roomId: body.roomId ? String(body.roomId) : undefined,
      note: body.note ? String(body.note) : undefined,
      source: body.source === "timer" ? "timer" : "manual",
    };

    const log = await (await getStore()).logStudy(session.sub, input);
    return ok(log);
  } catch (error) {
    console.error("Error creating study log:", error);
    return err("server_error", "Failed to create study log", 500);
  }
}
