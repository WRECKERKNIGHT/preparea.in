import { ok, err, readJson } from "@/lib/api";
import { getStore } from "@/lib/store";
import { hashPassword, validatePassword } from "@/lib/password";
import { validateResetToken, markResetTokenUsed } from "@/lib/password-reset";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const body = await readJson(req);
    const { token } = await params;
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

    const student = await validateResetToken(token);
    if (!student) {
      return err("invalid_token", "Invalid or expired reset token.", 400);
    }

    const passwordHash = await hashPassword(password);

    const updated = await (await getStore()).updateStudent(student.id, {
      passwordHash,
    });
    if (!updated) {
      return err("server_error", "Failed to reset password.");
    }

    await markResetTokenUsed(token);

    return ok({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Password reset error:", error);
    return err("server_error", "Failed to reset password.");
  }
}
