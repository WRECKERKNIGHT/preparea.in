import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "preparea-dev-secret-change-me"
);

export interface SessionPayload {
  sub: string;
  email: string;
}

export async function signSession(
  payload: SessionPayload,
  expiresInDays = 7
): Promise<string> {
  return new SignJWT({ sub: payload.sub, email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${expiresInDays}d`)
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.sub !== "string") return null;
    if (typeof payload.email !== "string") return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

/**
 * Rotate token version for a student (invalidates all existing tokens).
 */
export async function rotateTokenVersion(
  studentId: string,
  store: any
): Promise<void> {
  const currentVersion = await store.getTokenVersion(studentId);
  await store.updateStudent(studentId, {
    tokenVersion: (currentVersion ?? 0) + 1
  });
}
