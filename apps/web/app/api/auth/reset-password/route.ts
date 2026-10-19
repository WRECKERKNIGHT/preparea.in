import { ok, err, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import { createResetToken } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return err("missing_email", "Email is required.");
    }

    // Look the account up through the store so this works on every backend.
    const student = await (await getStore()).findStudentByEmail(email);

    // Never reveal whether the email exists, to prevent enumeration.
    const message = "If the email exists, a reset link has been sent.";
    if (!student) return ok({ message });

    const issued = await createResetToken(student.id);

    const resetLink = `${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/reset-password?token=${issued}`;

    return ok({
      message,
      // In development, return the link for testing
      ...(process.env.NODE_ENV === "development" && { resetLink }),
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return err("server_error", "Failed to process password reset request.");
  }
}
