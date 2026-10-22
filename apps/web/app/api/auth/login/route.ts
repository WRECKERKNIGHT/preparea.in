import { ok, err, readJson, withSessionCookie, checkRateLimit, sanitizeInput } from "@/lib/api";
import { getStore } from "@/lib/store";
import { signSession } from "@/lib/session";
import { verifyPassword } from "@/lib/password";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`login_${clientIp}`)) {
    return err("rate_limit_exceeded", "Too many login attempts. Please try again later.", 429);
  }

  const body = await readJson(req);
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");

  // Basic validation
  if (!email || !password) {
    return err("missing_fields", "Email and password are required.", 400);
  }

  // Rate limit: 5 attempts per minute per IP
  if (!checkRateLimit(`login_attempt_${clientIp}`)) {
    return err("rate_limit_exceeded", "Too many attempts. Please wait a minute.", 429);
  }

  const store = await getStore();
  const student = await store.findStudentByEmail(email);

  // Use generic error message to prevent email enumeration
  if (!student) {
    return err("invalid_credentials", "Email or password is incorrect.", 401);
  }

  if (!student.passwordHash) {
    return err("no_password", "Please reset your password first.", 401);
  }

  const isValid = await verifyPassword(password, student.passwordHash);
  if (!isValid) {
    return err("invalid_credentials", "Email or password is incorrect.", 401);
  }

  // Check token version (for forced logout on password change)
  const tokenVersion = await store.getTokenVersion(student.id);

  const token = await signSession({
    sub: student.id,
    email: student.email,
  });

  return withSessionCookie(
    ok({
      id: student.id,
      email: student.email,
      name: student.name,
      token,
    }),
    token,
    7 * 24 * 3600 // 7 days
  );
}
