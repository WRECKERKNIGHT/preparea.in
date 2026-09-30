import type {
  Checkin,
  CheckinStatus,
  Challenge,
  DashboardMe,
  Room,
  MentorSession,
  Student,
  StudyLog,
} from "@preparea/shared";
import { trialInfo } from "@preparea/shared";
import { dateFromKey, localDateKey, todayKey, trailingDateKeys } from "@/lib/dates";

/**
 * The dashboard read model used to be computed three times over — once in
 * MockStore, once in SheetsStore, once in SqliteStore — with the copies already
 * drifting apart. It is pure arithmetic over rows the adapter has already
 * fetched, so it lives here exactly once and every backend shares it.
 */

export interface DashboardInput {
  student: Student;
  logs: StudyLog[];
  checkins: Checkin[];
  rooms: Room[];
  challenge: Challenge | null;
  /** Whether the student is enrolled in `challenge`. */
  joined: boolean;
  mentorSessions: MentorSession[];
  announcement?: string;
  now?: Date;
}

const STREAK_CAP_DAYS = 400;

export function buildDashboard(input: DashboardInput): DashboardMe {
  const {
    student,
    logs,
    checkins,
    rooms,
    challenge,
    joined,
    mentorSessions,
    announcement,
    now = new Date(),
  } = input;

  const today = todayKey(now);

  const minutesByDate = new Map<string, number>();
  for (const log of logs) {
    minutesByDate.set(log.date, (minutesByDate.get(log.date) ?? 0) + log.minutes);
  }

  const todayMinutes = minutesByDate.get(today) ?? 0;

  const weekBuckets: DashboardMe["weekBuckets"] = [];
  let weekMinutes = 0;
  for (const key of trailingDateKeys(7, now)) {
    const minutes = minutesByDate.get(key) ?? 0;
    weekMinutes += minutes;
    weekBuckets.push({
      label: dateFromKey(key).toLocaleDateString("en-IN", { weekday: "short" }),
      minutes,
    });
  }

  // A day counts toward the streak if the student checked in at all (even a
  // miss keeps the day "answered") or logged any study time.
  const activeDates = new Set<string>();
  for (const c of checkins) if (c.status !== "miss") activeDates.add(c.date);
  for (const log of logs) if (log.minutes > 0) activeDates.add(log.date);

  let streakDays = 0;
  for (let i = 0; i < STREAK_CAP_DAYS; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    if (activeDates.has(localDateKey(d))) streakDays++;
    else break;
  }

  const latestCheckin = checkins.reduce<Checkin | null>((best, c) => {
    if (!best || c.date > best.date) return c;
    return best;
  }, null);

  const todaysCheckin = latestCheckin?.date === today ? latestCheckin : null;

  return {
    student,
    trial: trialInfo(student.createdAt),
    todayMinutes,
    todayTargetMin: todaysCheckin?.targetMin ?? student.dailyTargetMin,
    weekMinutes,
    weekBuckets,
    streakDays,
    lastCheckin: todaysCheckin,
    rooms: rooms.filter((r) => r.active),
    activeChallenge: challenge,
    challengeProgress: buildChallengeProgress(challenge, joined, checkins, now),
    mentorSessions,
    announcement,
  };
}

export interface ChallengeProgress {
  joined: boolean;
  dayStatuses: (CheckinStatus | null)[];
}

/**
 * Seven slots from the challenge start. A day that has not happened yet is
 * `null`; a day that has passed without a check-in is a `miss`.
 */
export function buildChallengeProgress(
  challenge: Challenge | null,
  joined: boolean,
  checkins: Checkin[],
  now: Date = new Date()
): ChallengeProgress {
  if (!challenge) return { joined: false, dayStatuses: [] };

  const today = todayKey(now);
  const byDate = new Map(checkins.map((c) => [c.date, c.status]));
  const dayStatuses: (CheckinStatus | null)[] = [];

  for (let i = 0; i < 7; i++) {
    const d = dateFromKey(challenge.startDate);
    d.setDate(d.getDate() + i);
    const key = localDateKey(d);
    if (key > today) {
      dayStatuses.push(null);
      continue;
    }
    dayStatuses.push(byDate.get(key) ?? "miss");
  }

  return { joined, dayStatuses };
}

export interface LeaderboardEntry {
  rank: number;
  studentId: string;
  name: string;
  klass: string;
  exam: string;
  minutes: number;
  checkinsHit: number;
  streakDays: number;
}

/**
 * Ranks students by minutes studied in the window. Ties share a rank, and the
 * sort falls back to name so the ordering is stable across requests.
 */
export function buildLeaderboard(
  entries: Omit<LeaderboardEntry, "rank" | "streakDays">[],
  streakByStudent: Map<string, number> = new Map()
): LeaderboardEntry[] {
  const sorted: LeaderboardEntry[] = entries
    .map((e) => ({ ...e, rank: 0, streakDays: streakByStudent.get(e.studentId) ?? 0 }))
    .sort((a, b) => b.minutes - a.minutes || a.name.localeCompare(b.name));

  return sorted.map((entry, i) => {
    const prev = sorted[i - 1];
    const rank = prev && prev.minutes === entry.minutes ? prev.rank : i + 1;
    return { ...entry, rank };
  });
}
