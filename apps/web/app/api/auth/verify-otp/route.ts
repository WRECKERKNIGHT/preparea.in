import { ok, err, readJson, withSessionCookie } from "@/lib/api";
import { getStore } from "@/lib/store";
import { signSession } from "@/lib/session";

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = String(body.email ?? "").trim().toLowerCase();
  const code = String(body.code ?? "").trim();

  if (!email || code.length !== 6) {
    return err("invalid_code", "Enter the 6-digit code.");
  }

  const store = getStore();
  const student = await store.verifyOtp(email, code);
  if (!student) {
    return err("invalid_code", "That code is incorrect or expired. Request a new one.");
  }

  const token = await signSession({ sub: student.id, email: student.email });
  return withSessionCookie(
    ok({ id: student.id, email: student.email, token }),
    token,
    7 * 24 * 3600
  );
}