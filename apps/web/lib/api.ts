import { NextResponse } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/session";

export const SESSION_COOKIE = "pa_session";

// Rate limiting storage (in-memory, clear on restart)
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 30; // max requests per window

/**
 * Check rate limit for a given key
 */
export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const record = rateLimits.get(key);

  if (!record || now > record.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

export function ok<T>(data: T, extraHeaders?: Record<string, string>): NextResponse {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return NextResponse.json({ ok: true, data }, { headers });
}

export function err(
  code: string,
  message: string,
  status = 400,
  extraHeaders?: Record<string, string>
): NextResponse {
  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status, headers }
  );
}

export async function readJson(
  req: Request
): Promise<Record<string, unknown>> {
  try {
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return {};
    }
    const sizeHeader = req.headers.get("content-length");
    const maxSize = 1024 * 1024; // 1MB limit
    if (sizeHeader && parseInt(sizeHeader) > maxSize) {
      return {};
    }
    const body = await req.text();
    if (!body || body.length === 0) return {};
    return JSON.parse(body) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export function sanitizeInput(input: unknown): string {
  if (typeof input !== "string") return "";
  // Remove potential HTML/script injection
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
    .slice(0, 500); // Max length
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
    if (token.length > 500) return null; // Max token length
    if (token) return verifySession(token);
  }
  const cookies = parseCookies(req);
  const cookieToken = cookies[SESSION_COOKIE];
  if (cookieToken && cookieToken.length > 500) return null;
  if (cookieToken) return verifySession(cookieToken);
  return null;
}

export function sessionCookie(
  token: string,
  maxAgeSeconds: number
): string {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}; SameSite=Strict`;
}

export function clearSessionCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export function withSessionCookie(
  res: NextResponse,
  token: string,
  maxAgeSeconds: number
): NextResponse {
  res.headers.set("Set-Cookie", sessionCookie(token, maxAgeSeconds));
  return res;
}

/**
 * Get client IP from request (handles proxies).
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const url = new URL(req.url);
  return url.hostname === "localhost" ? "127.0.0.1" : url.hostname;
}

/**
 * Get user agent string (limited to prevent abuse)
 */
export function getUserAgent(req: Request): string {
  const ua = req.headers.get("user-agent") || "unknown";
  return ua.slice(0, 500);
}
