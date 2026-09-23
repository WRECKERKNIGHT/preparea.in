import { ok, err, getSession, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { CheckinInput } from "@preparea/shared";

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to check in.", 401);

  const body = await readJson(req);
  const completedMin = Number(body.completedMin);
  if (!Number.isFinite(completedMin) || completedMin < 0 || completedMin > 1440) {
    return err("invalid_minutes", "Completed minutes must be 0–1440.");
  }

  const input: CheckinInput = {
    targetMin: body.targetMin ? Number(body.targetMin) : undefined,
    completedMin: Math.round(completedMin),
    note: body.note ? String(body.note) : undefined,
  };
  if (input.targetMin !== undefined && !Number.isFinite(input.targetMin)) {
    return err("invalid_target", "Target must be a number.");
  }

  const checkin = await getStore().upsertCheckin(session.sub, input);
  return ok(checkin);
}