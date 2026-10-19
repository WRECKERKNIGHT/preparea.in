import { createDb, migrate, resolveDbConfig, type DbConfig } from "./db";
import type { Client } from "@libsql/client";
import { dayKey, todayKey } from "@/lib/dates";

/**
 * Shared handle for the analytics queries. The client is memoised per process
 * so repeated calls within one request window reuse a single connection.
 */
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
 * Get study analytics for a student over a date range
 */
export async function getStudyAnalytics(
  studentId: string,
  startDate: string,
  endDate: string
) {
  const db = await getDb();

  const logRes = await db.execute({
    sql: `SELECT date, minutes FROM logs
          WHERE studentId = ? AND date >= ? AND date <= ?
          ORDER BY date ASC`,
    args: [studentId, startDate, endDate],
  });

  const checkinRes = await db.execute({
    sql: `SELECT date, status FROM checkins
          WHERE studentId = ? AND date >= ? AND date <= ?
          ORDER BY date ASC`,
    args: [studentId, startDate, endDate],
  });

  const logs = logRes.rows.map((r) => ({
    date: String(r.date),
    minutes: Number(r.minutes) || 0,
  }));

  const checkins = checkinRes.rows.map((r) => ({
    date: String(r.date),
    status: String(r.status),
  }));

  // Calculate daily totals
  type CheckinCounts = { hit: number; partial: number; miss: number };
  const dailyStats: Record<
    string,
    {
      date: string;
      studyMinutes: number;
      checkins: CheckinCounts;
      targetMet: boolean;
    }
  > = {};

  // Initialize all dates in range
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);

  if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
    const cursor = new Date(start);
    while (cursor <= end) {
      const y = cursor.getFullYear();
      const m = String(cursor.getMonth() + 1).padStart(2, "0");
      const d = String(cursor.getDate()).padStart(2, "0");
      const dateStr = `${y}-${m}-${d}`;
      dailyStats[dateStr] = {
        date: dateStr,
        studyMinutes: 0,
        checkins: { hit: 0, partial: 0, miss: 0 },
        targetMet: false,
      };
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  // Aggregate study logs
  for (const log of logs) {
    if (dailyStats[log.date]) {
      dailyStats[log.date].studyMinutes += log.minutes;
    }
  }

  // Aggregate checkins
  for (const checkin of checkins) {
    const bucket = dailyStats[checkin.date];
    if (!bucket) continue;

    if (checkin.status === "hit" || checkin.status === "partial") {
      bucket.checkins[checkin.status as "hit" | "partial"] += 1;
      bucket.targetMet = true;
    } else if (checkin.status === "miss") {
      bucket.checkins.miss += 1;
    }
  }

  // Calculate summary stats
  const totalStudyMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
  const totalCheckins = checkins.length;
  const hitCheckins = checkins.filter((c) => c.status === "hit").length;
  const consistencyRate =
    totalCheckins > 0 ? (hitCheckins / totalCheckins) * 100 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;

  const dates = Object.keys(dailyStats).sort();
  for (const date of dates) {
    const day = dailyStats[date];
    const studied = day.studyMinutes > 0;

    if (studied || day.targetMet) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }

  return {
    dailyStats: Object.values(dailyStats),
    summary: {
      totalStudyMinutes,
      totalCheckins,
      hitCheckins,
      consistencyRate: Number(consistencyRate.toFixed(1)),
      currentStreak,
      maxStreak,
      daysTracked: dates.length,
      daysWithActivity: dates.filter(
        (d) => dailyStats[d].studyMinutes > 0 || dailyStats[d].targetMet
      ).length,
    },
  };
}

/**
 * Get subject-wise breakdown (falls back to the exam on the profile)
 */
export async function getSubjectAnalytics(studentId: string) {
  const db = await getDb();
  const res = await db.execute({
    sql: "SELECT exam FROM students WHERE id = ?",
    args: [studentId],
  });

  if (!res.rows.length) return [];
  const exam = String(res.rows[0].exam ?? "");

  return [
    {
      subject: exam,
      minutes: 0,
      percentage: 100,
      sessions: 0,
    },
  ];
}

/**
 * Get performance trends over time
 */
export async function getPerformanceTrends(
  studentId: string,
  days: number = 30
) {
  const endDate = todayKey();
  const startDate = dayKey(-days + 1, new Date(endDate));

  const analytics = await getStudyAnalytics(studentId, startDate, endDate);

  // Calculate weekly averages
  const weeklyData = [];
  let weekMinutes = 0;
  let weekDays = 0;

  for (const day of analytics.dailyStats) {
    weekMinutes += day.studyMinutes;
    weekDays++;

    if (
      weekDays === 7 ||
      day.date === analytics.dailyStats[analytics.dailyStats.length - 1].date
    ) {
      weeklyData.push({
        weekEnd: day.date,
        averageMinutesPerDay: weekMinutes / weekDays,
        totalMinutes: weekMinutes,
        days: weekDays,
      });
      weekMinutes = 0;
      weekDays = 0;
    }
  }

  return {
    daily: analytics.dailyStats,
    weekly: weeklyData,
    summary: analytics.summary,
  };
}

export type { DbConfig };
