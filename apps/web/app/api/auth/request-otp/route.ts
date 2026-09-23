import { ok, err, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import { sendOtpEmail } from "@/lib/mailer";

const cooldowns = new Map<string, number>();

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return err("invalid_email", "Enter a valid email address.");
  }

  const store = getStore();
  const student = await store.findStudentByEmail(email);
  if (!student) {
    return err("not_registered", "This email isn't registered with PrepArea. Join first.", 404);
  }

  const last = cooldowns.get(email) ?? 0;
  if (Date.now() - last < 30_000) {
    return err("rate_limited", "Please wait 30 seconds before requesting another code.");
  }
  cooldowns.set(email, Date.now());

  const { code } = await store.requestOtp(email, "login");

  try {
    await sendOtpEmail(email, code);
  } catch {
    return err("mail_error", "Could not send the code. Try again in a minute.");
  }

  const isDev = process.env.NODE_ENV !== "production";
  return ok({ email, devCode: isDev ? code : undefined });
}