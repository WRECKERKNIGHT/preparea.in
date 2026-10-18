import { ok, err, readJson, withSessionCookie } from "@/lib/api";
import { getStore } from "@/lib/store";
import { signSession } from "@/lib/session";
import { verifyPassword } from "@/lib/password";

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  if (!email || !password) {
    return err("missing_fields", "Email and password are required.");
  }

  const store = await getStore();
  const student = await store.findStudentByEmail(email);

  if (!student) {
    return err("invalid_credentials", "Email or password is incorrect.", 401);
  }

  if (!student.passwordHash) {
    return err("no_password", "This account does not have a password set. Please reset your password.", 401);
  }

  const isValid = await verifyPassword(password, student.passwordHash);
  if (!isValid) {
    return err("invalid_credentials", "Email or password is incorrect.", 401);
  }

  const token = await signSession({ sub: student.id, email: student.email });

  return withSessionCookie(
    ok({
      id: student.id,
      email: student.email,
      name: student.name,
      token,
    }),
    token,
    7 * 24 * 3600
  );
}
