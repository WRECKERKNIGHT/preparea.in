import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import type {
  ApiEnvelope,
  Checkin,
  DashboardMe,
  PublicSettings,
  Room,
  Student,
} from "@preparea/shared";
import { API_BASE } from "@/constants/config";

type Session = {
  token: string;
  student: Student;
};

function sessionDir(): Directory {
  const dir = new Directory(Paths.document, "preparea");
  if (!dir.exists) {
    dir.create({ intermediates: true, idempotent: true });
  }
  return dir;
}

export async function loadSession(): Promise<Session | null> {
  try {
    if (Platform.OS === "web") {
      const raw = globalThis.localStorage?.getItem("pa_token");
      if (!raw) return null;
      return JSON.parse(raw) as Session;
    }
    const file = new File(sessionDir(), "session.json");
    if (!file.exists) return null;
    return JSON.parse(await file.text()) as Session;
  } catch {
    return null;
  }
}

export async function saveSession(session: Session): Promise<void> {
  const raw = JSON.stringify(session);
  if (Platform.OS === "web") {
    globalThis.localStorage?.setItem("pa_token", raw);
    return;
  }
  const file = new File(sessionDir(), "session.json");
  if (!file.exists) {
    file.create({ intermediates: true, overwrite: true });
  }
  file.write(raw);
}

export async function clearSession(): Promise<void> {
  try {
    if (Platform.OS === "web") {
      globalThis.localStorage?.removeItem("pa_token");
      return;
    }
    const file = new File(sessionDir(), "session.json");
    if (file.exists) file.delete();
  } catch {
    // ignore
  }
}

export async function api<T>(
  path: string,
  opts: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<ApiEnvelope<T>> {
  const { method = "GET", body, token } = opts;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  try {
    return (await res.json()) as ApiEnvelope<T>;
  } catch {
    return { ok: false, error: { code: "BAD_RESPONSE", message: "Bad response from server" } };
  }
}

export async function authedApi<T>(
  path: string,
  opts: { method?: string; body?: unknown } = {},
  session: Session | null,
): Promise<ApiEnvelope<T>> {
  return api<T>(path, { ...opts, token: session?.token ?? null });
}

export async function requestOtp(email: string): Promise<ApiEnvelope<{ devCode?: string; cooldown?: number }>> {
  return api("/api/auth/request-otp", { method: "POST", body: { email } });
}

export async function verifyOtp(
  email: string,
  code: string,
): Promise<ApiEnvelope<{ id: string; email: string; token: string }>> {
  return api("/api/auth/verify-otp", { method: "POST", body: { email, code } });
}

export async function fetchMe(token: string): Promise<ApiEnvelope<DashboardMe>> {
  return api("/api/me", { token });
}

export async function logout(token: string): Promise<void> {
  await api("/api/auth/logout", { method: "POST", token });
}

export async function fetchRooms(session: Session | null): Promise<Room[]> {
  const res = await authedApi<Room[]>("/api/rooms", {}, session);
  return res.data ?? [];
}

export async function fetchSettings(): Promise<PublicSettings> {
  const res = await api<PublicSettings>("/api/settings");
  return res.data ?? {};
}

export interface JoinResult {
  joined: boolean;
}

export async function joinChallenge(
  challengeId: string,
  session: Session | null,
): Promise<ApiEnvelope<JoinResult>> {
  return authedApi(`/api/challenges/${challengeId}/join`, { method: "POST" }, session);
}

export async function postCheckin(
  payload: { completedMin: number; note?: string },
  session: Session | null,
): Promise<ApiEnvelope<Checkin>> {
  return authedApi("/api/checkins", { method: "POST", body: payload }, session);
}