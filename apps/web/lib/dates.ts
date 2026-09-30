/**
 * Date keys are stored as `YYYY-MM-DD` strings in every adapter.
 *
 * These previously mixed `toISOString()` (UTC) with local-time formatting, so
 * a study session logged at 00:30 IST landed on the *previous* day's bucket
 * while the week chart looked for it on the correct day. Everything now keys
 * off the server's local calendar day, which is what an aspirant means by
 * "today".
 */

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function localDateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Today, in local time. */
export function todayKey(now: Date = new Date()): string {
  return localDateKey(now);
}

/** The local calendar day `offset` days from today (negative = past). */
export function dayKey(offset: number, now: Date = new Date()): string {
  const d = new Date(now);
  d.setDate(d.getDate() + offset);
  return localDateKey(d);
}

/** Shifts a `YYYY-MM-DD` key by `n` days, DST-safe. */
export function shiftDateKey(key: string, n: number): string {
  const d = new Date(`${key}T00:00:00`);
  d.setDate(d.getDate() + n);
  return localDateKey(d);
}

/** The last `days` keys ending today, oldest first. */
export function trailingDateKeys(days: number, now: Date = new Date()): string[] {
  const keys: string[] = [];
  for (let i = days - 1; i >= 0; i--) keys.push(dayKey(-i, now));
  return keys;
}

/** The date key that is `n` days after `key`, as a Date at local midnight. */
export function dateFromKey(key: string): Date {
  return new Date(`${key}T00:00:00`);
}

/** True when the key is today or earlier. */
export function isPastOrToday(key: string, now: Date = new Date()): boolean {
  return key <= todayKey(now);
}
