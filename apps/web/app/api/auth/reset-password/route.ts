import { prisma } from "@/lib/db";
import { ok, err, readJson } from "@/lib/api";
import { generateResetToken, createResetToken, validateResetToken, useResetToken } from "@/lib/password-reset";

export async function POST(req: Request) {
  try {
    const body = await readJson(req);
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email) {
      return err("missing_email", "Email is required.");
    }

    // Find student by email
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      // Don't reveal that the email doesn't exist for security
      // But still return ok to prevent email enumeration
      return ok({ message: "If the email exists, a reset link has been sent." });
    }

    // Generate reset token and store it
    const token = await generateResetToken();
    await createResetToken(student.id, token);

    // TODO: Actually send email with reset link
    // For now, we'll return the token in development
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${token}`;

    return ok({
      message: "If the email exists, a reset link has been sent.",
      // In development, return the link for testing
      ...(process.env.NODE_ENV === "development" && { resetLink })
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return err("server_error", "Failed to process password reset request.");
  }
}