import { SignJWT, jwtVerify } from "jose";
import type { Store } from "@/lib/store";

// Use environment variable with fallback for development
const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "preparea-dev-secret-change-in-production"
);

export interface SessionPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate a secure session token
 * @param payload - Session payload
 * @param expiresInDays - Token expiry in days (default: 7)
 */
export async function signSession(
  payload: SessionPayload,
  expiresInDays = 7
): Promise<string> {
  // Sanitize inputs
  if (typeof payload.sub !== "string" || payload.sub.length > 255) {
    throw new Error("Invalid user ID");
  }
  if (typeof payload.email !== "string" || payload.email.length > 254) {
    throw new Error("Invalid email");
  }

  return new SignJWT({ sub: payload.sub, email: payload.email })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt(Math.floor(Date.now() / 1000))
    .setExpirationTime(`${expiresInDays}d`)
    .sign(secret);
}

/**
 * Verify and decode a session token
 * @param token - JWT token to verify
 */
export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    if (!token || typeof token !== "string") return null;
    if (token.length > 2000) return null; // Prevent buffer overflow

    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: "preparea",
    });

    // Validate required fields
    if (typeof payload.sub !== "string") return null;
    if (typeof payload.email !== "string") return null;
    if (typeof payload.iat !== "number") return null;
    if (typeof payload.exp !== "number") return null;

    return {
      sub: payload.sub,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    } as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Check if a token is expired
 */
export function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
    if (!payload.exp) return true;
    return payload.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
}

/**
 * Rotate token version for a student (invalidates all existing tokens)
 */
export async function rotateTokenVersion(
  studentId: string,
  store: Pick<Store, "getTokenVersion" | "updateStudent">
): Promise<void> {
  const currentVersion = await store.getTokenVersion(studentId);
  await store.updateStudent(studentId, {
    tokenVersion: (currentVersion ?? 0) + 1
  });
}
