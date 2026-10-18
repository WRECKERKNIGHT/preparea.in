import { randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { prisma } from "./db";
import { verifyPassword } from "./password";

const randomBytesAsync = promisify(randomBytes);

/**
 * Generate a secure random token for password reset
 */
export async function generateResetToken(): Promise<string> {
  const buffer = await randomBytesAsync(32);
  return buffer.toString("hex");
}

/**
 * Hash a reset token for storage (we don't store the plain token)
 */
export function hashResetToken(token: string): string {
  // Create a hash of the token for storage
  // In production, you might want to use bcrypt/scrypt here as well
  // For now, we'll use a simple SHA256 hash
  const crypto = require("node:crypto");
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Find a student by their reset token
 */
export async function validateResetToken(token: string) {
  const tokenHash = hashResetToken(token);

  const resetToken = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      expiresAt: {
        gt: Math.floor(Date.now() / 1000), // Not expired
      },
      usedAt: null, // Not already used
    },
    include: {
      student: true,
    },
  });

  return resetToken ? resetToken.student : null;
}

/**
 * Mark a reset token as used
 */
export async function useResetToken(token: string) {
  const tokenHash = hashResetToken(token);

  await prisma.passwordResetToken.updateMany({
    where: {
      tokenHash,
      usedAt: null,
    },
    data: {
      usedAt: Math.floor(Date.now() / 1000),
    },
  });
}

/**
 * Create a password reset token for a student
 */
export async function createResetToken(studentId: string): Promise<string> {
  const token = await generateResetToken();
  const tokenHash = hashResetToken(token);

  // Token expires in 1 hour
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;

  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      studentId,
      expiresAt,
    },
  });

  return token;
}