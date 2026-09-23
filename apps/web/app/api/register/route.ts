import { ok, err, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { RegisterInput } from "@preparea/shared";

export async function POST(req: Request) {
  const body = await readJson(req);

  const input: RegisterInput = {
    name: String(body.name ?? ""),
    klass: String(body.klass ?? ""),
    exam: String(body.exam ?? ""),
    email: String(body.email ?? ""),
    tgUsername: body.tgUsername
      ? String(body.tgUsername)
      : undefined,
    discordUsername: body.discordUsername
      ? String(body.discordUsername)
      : undefined,
    dailyTargetMin: Number(body.dailyTargetMin ?? 300),
    mainChallenge: body.mainChallenge ? String(body.mainChallenge) : undefined,
    source: String(body.source ?? "website"),
  };

  try {
    const student = await getStore().registerStudent(input);
    return ok({ id: student.id, email: student.email });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed.";
    if ((e as Error).message?.includes("already registered")) {
      return err("already_registered", message, 409);
    }
    return err("invalid_input", message, 400);
  }
}