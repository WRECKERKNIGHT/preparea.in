export interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

const TOKEN_KEY = "pa_token";

/**
 * Client-side fetch wrapper. Mirrors the shape of the server routes, which
 * reply `{ ok: true, data }` or `{ ok: false, error: { code, message } }`.
 *
 * Lives in its own module rather than `lib/api.ts` so client bundles never
 * pull in `next/server`.
 */
export async function api<T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, signal } = options;

  const token =
    typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;

  const finalHeaders: Record<string, string> = { ...headers };
  if (token) finalHeaders.Authorization = `Bearer ${token}`;
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";

  const res = await fetch(path, {
    method,
    headers: finalHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: "same-origin",
    signal,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.ok) {
    const message =
      json?.error?.message ?? `Request failed with status ${res.status}`;
    throw new Error(message);
  }

  return json.data as T;
}
