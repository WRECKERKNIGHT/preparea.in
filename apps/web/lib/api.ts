import { NextResponse } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/session";

export const SESSION_COOKIE = "pa_session";

export function ok<T>(data: T): NextResponse {
  return NextResponse.json({ ok: true, data });
}

export function err(
  code: string,
  message: string,
  status = 400
): NextResponse {
  return NextResponse.json({ ok: false, error: { code, message } }, { status });
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function parseCookies(req: Request): Record<string, string> {
  const header = req.headers.get("cookie") ?? "";
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx > 0) {
      const key = part.slice(0, idx).trim();
      out[key] = decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return out;
}

export async function getSession(req: Request): Promise<SessionPayload | null> {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    const token = auth.slice(7).trim();
    if (token) return verifySession(token);
  }
  const cookies = parseCookies(req);
  const cookieToken = cookies[SESSION_COOKIE];
  if (cookieToken) return verifySession(cookieToken);
  return null;
}

export function sessionCookie(
  token: string,
  maxAgeSeconds: number
): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function withSessionCookie(
  res: NextResponse,
  token: string,
  maxAgeSeconds: number
): NextResponse {
  res.headers.set("Set-Cookie", sessionCookie(token, maxAgeSeconds));
  return res;
}