import { prisma } from "@/lib/db";
import { ok, err, readJson } from "@/lib/api";
import { hashPassword, validatePassword } from "@/lib/password";
import { validateResetToken, useResetToken } from "@/lib/password-reset";

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const body = await readJson(req);
    const token = params.token;
    const password = String(body.password ?? "");
    const confirmPassword = String(body.confirmPassword ?? "");

    if (!token) {
      return err("missing_token", "Reset token is required.");
    }

    if (!password || !confirmPassword) {
      return err("missing_fields", "Password and confirm password are required.");
    }

    if (password !== confirmPassword) {
      return err("password_mismatch", "Passwords do not match.");
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return err("invalid_password", passwordError, 400);
    }

    // Validate the reset token
    const student = await validateResetToken(token);
    if (!student) {
      return err("invalid_token", "Invalid or expired reset token.", 400);
    }

    // Hash the new password
    const passwordHash = await hashPassword(password);

    // Update the student's password
    await prisma.student.update({
      where: { id: student.id },
      data: { passwordHash },
    });

    // Mark the token as used
    await useResetToken(token);

    return ok({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Password reset error:", error);
    return err("server_error", "Failed to reset password.");
  }
}