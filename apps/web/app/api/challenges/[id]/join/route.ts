import { ok, err, getSession } from "@/lib/api";
import { getStore } from "@/lib/store";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession(_req);
  if (!session) return err("unauthorized", "Log in to join a challenge.", 401);

  const { id } = await ctx.params;
  await getStore().joinChallenge(session.sub, id);
  return ok({ joined: true, challengeId: id });
}