import { createHash, randomBytes } from "node:crypto";
import type { Client } from "@libsql/client";
import { createDb, migrate, resolveDbConfig } from "./db";
import type { Student } from "@preparea/shared";

let cached: { key: string; client: Client } | null = null;

async function getDb(): Promise<Client> {
  const config = resolveDbConfig();
  const key = JSON.stringify(config);
  if (cached && cached.key === key) return cached.client;

  const client = createDb(config);
  await migrate(client);
  cached = { key, client };
  return client;
}

/**
 * Generate a secure random token for password reset
 */
export async function generateResetToken(): Promise<string> {
  return randomBytes(32).toString("hex");
}

/**
 * Hash a reset token for storage (the plain token is never persisted)
 */
export function hashResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function rowToStudent(r: Record<string, unknown>): Student | null {
  const id = String(r.id ?? "");
  const email = String(r.email ?? "");
  const name = String(r.name ?? "");
  if (!id || !email || !name) return null;

  return {
    id,
    name,
    klass: String(r.klass ?? ""),
    exam: String(r.exam ?? ""),
    email,
    passwordHash: r.passwordHash ? String(r.passwordHash) : undefined,
    tgUsername: r.tgUsername ? String(r.tgUsername) : undefined,
    discordUsername: r.discordUsername ? String(r.discordUsername) : undefined,
    dailyTargetMin: Number(r.dailyTargetMin) || 300,
    mainChallenge: r.mainChallenge ? String(r.mainChallenge) : undefined,
    status: (String(r.status) as Student["status"]) || "new",
    createdAt: String(r.createdAt ?? ""),
    tokenVersion: Number(r.tokenVersion) || 0,
  };
}

/**
 * Find a student by their reset token, if it is unused and unexpired.
 */
export async function validateResetToken(token: string): Promise<Student | null> {
  const db = await getDb();
  const tokenHash = hashResetToken(token);

  const res = await db.execute({
    sql: `SELECT s.* FROM password_reset_tokens t
          JOIN students s ON s.id = t.studentId
          WHERE t.tokenHash = ?
            AND t.expiresAt > ?
            AND t.usedAt IS NULL`,
    args: [tokenHash, Math.floor(Date.now() / 1000)],
  });

  if (!res.rows.length) return null;
  return rowToStudent(res.rows[0] as unknown as Record<string, unknown>);
}

/**
 * Mark a reset token as used.
 *
 * Deliberately not named `use*`: the rule-of-hooks lint would otherwise treat
 * this server-side helper as a React hook.
 */
export async function markResetTokenUsed(token: string): Promise<void> {
  const db = await getDb();
  const tokenHash = hashResetToken(token);

  await db.execute({
    sql: "UPDATE password_reset_tokens SET usedAt = ? WHERE tokenHash = ? AND usedAt IS NULL",
    args: [Math.floor(Date.now() / 1000), tokenHash],
  });
}

/**
 * Create a password reset token for a student.
 * Returns the plain token that the caller must deliver to the user.
 */
export async function createResetToken(studentId: string): Promise<string> {
  const db = await getDb();
  const token = await generateResetToken();
  const tokenHash = hashResetToken(token);

  // Token expires in 1 hour
  const expiresAt = Math.floor(Date.now() / 1000) + 3600;

  await db.execute({
    sql: `INSERT INTO password_reset_tokens
            (id, studentId, tokenHash, expiresAt, usedAt, createdAt)
          VALUES (?, ?, ?, ?, NULL, ?)`,
    args: [
      `prt_${randomBytes(8).toString("hex")}`,
      studentId,
      tokenHash,
      expiresAt,
      new Date().toISOString(),
    ],
  });

  return token;
}
