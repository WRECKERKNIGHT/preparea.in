import { ok, err, getSession, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { FeedbackInput } from "@preparea/shared";

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return err("unauthorized", "Log in to give feedback.", 401);

  const body = await readJson(req);
  const input: FeedbackInput = {
    helpsConsistency: Boolean(body.helpsConsistency),
    sessionsAttended: Number(body.sessionsAttended ?? 0),
    liked: String(body.liked ?? ""),
    improve: String(body.improve ?? ""),
    joinAgain: Boolean(body.joinAgain),
    wouldPay: Boolean(body.wouldPay),
    features: body.features ? String(body.features) : undefined,
  };

  await getStore().submitFeedback(session.sub, input);
  return ok({ submitted: true });
}