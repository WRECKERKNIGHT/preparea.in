import { ok, err, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { RegisterInput } from "@preparea/shared";
import { hashPassword, validatePassword } from "@/lib/password";

export async function POST(req: Request) {
  const body = await readJson(req);

  const input: RegisterInput = {
    name: String(body.name ?? ""),
    klass: String(body.klass ?? ""),
    exam: String(body.exam ?? ""),
    email: String(body.email ?? ""),
    password: String(body.password ?? ""),
    confirmPassword: String(body.confirmPassword ?? ""),
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

  // Validate password
  const passwordError = validatePassword(input.password);
  if (passwordError) {
    return err("invalid_password", passwordError, 400);
  }

  if (input.password !== input.confirmPassword) {
    return err("password_mismatch", "Passwords do not match.", 400);
  }

  try {
    const store = await getStore();
    const student = await store.registerStudent({
      ...input,
      passwordHash: await hashPassword(input.password),
    });
    return ok({ id: student.id, email: student.email });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed.";
    if ((e as Error).message?.includes("already registered")) {
      return err("already_registered", message, 409);
    }
    return err("invalid_input", message, 400);
  }
}
