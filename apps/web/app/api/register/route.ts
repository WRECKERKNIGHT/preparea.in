import { NextRequest } from "next/server";
import { ok, err, readJson, sanitizeInput, getSession, checkRateLimit } from "@/lib/api";
import { getStore } from "@/lib/store";
import type { RegisterInput } from "@preparea/shared";
import { hashPassword, validatePassword, validateEmail } from "@/lib/password";

const IP_RATE_LIMIT_WINDOW = 10 * 60 * 1000; // 10 minutes per IP

export async function POST(req: NextRequest) {
  // Rate limiting by IP
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(`register_${clientIp}`)) {
    return err("rate_limit_exceeded", "Too many registration attempts. Please try again later.", 429);
  }

  const body = await readJson(req);

  const name = sanitizeInput(String(body.name ?? ""));
  const klass = sanitizeInput(String(body.klass ?? ""));
  const exam = sanitizeInput(String(body.exam ?? ""));
  const email = String(body.email ?? "").trim().toLowerCase();
  const password = String(body.password ?? "");
  const confirmPassword = String(body.confirmPassword ?? "");
  const dailyTargetMin = Number(body.dailyTargetMin ?? 300);
  const source = sanitizeInput(String(body.source ?? "website"));

  // Validate email
  const emailError = validateEmail(email);
  if (emailError) {
    return err("invalid_email", emailError, 400);
  }

  // Validate name
  if (name.length < 2 || name.length > 50) {
    return err("invalid_name", "Name must be between 2 and 50 characters.", 400);
  }

  // Validate password
  const passwordError = validatePassword(password);
  if (passwordError) {
    return err("invalid_password", passwordError, 400);
  }

  if (password !== confirmPassword) {
    return err("password_mismatch", "Passwords do not match.", 400);
  }

  // Validate exam and class
  const validExams = ["JEE", "NEET", "CUET", "Boards", "Other"];
  const validClasses = ["8", "9", "10", "11", "12", "Graduate", "Dropper", "Other"];
  if (!validExams.includes(exam)) {
    return err("invalid_exam", "Please select a valid exam type.", 400);
  }
  if (!validClasses.includes(klass)) {
    return err("invalid_class", "Please select a valid class.", 400);
  }

  // Rate limit by email to prevent duplicate registrations
  const store = await getStore();
  const existingStudent = await store.findStudentByEmail(email);
  if (existingStudent) {
    return err("already_registered", "An account with this email already exists.", 409);
  }

  try {
    const student = await store.registerStudent({
      name,
      klass,
      exam,
      email,
      passwordHash: await hashPassword(password),
      dailyTargetMin,
      source,
    });

    return ok({
      id: student.id,
      email: student.email,
      name: student.name,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Registration failed.";
    console.error("Registration error:", e);
    return err("registration_failed", message, 500);
  }
}

export async function GET() {
  return err("method_not_allowed", "POST method only", 405);
}
