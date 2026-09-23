import { ok, err, getSession, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to view your dashboard.", 401);

  try {
    const data = await getStore().getDashboard(session.sub);
    return ok(data);
  } catch (e) {
    return err(
      "not_found",
      e instanceof Error ? e.message : "Account not found.",
      404
    );
  }
}

export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to continue.", 401);

  const body = await readJson(req);
  const target = Number(body.dailyTargetMin);
  if (!Number.isFinite(target) || target < 15 || target > 720) {
    return err("invalid_target", "Daily target must be 15–720 minutes.");
  }

  const student = await getStore().updateStudent(session.sub, {
    dailyTargetMin: target,
  });
  if (!student) return err("not_found", "Account not found.", 404);
  return ok({ dailyTargetMin: student.dailyTargetMin });
}