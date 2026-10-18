import { prisma } from "./db";
import type {
  StudyLog,
  Checkin,
  Student,
  DashboardMe
} from "@preparea/shared";
import { dayKey, todayKey } from "@/lib/dates";

/**
 * Get study analytics for a student over a date range
 */
export async function getStudyAnalytics(
  studentId: string,
  startDate: string,
  endDate: string
) {
  // Get study logs in date range
  const logs = await prisma.studyLog.findMany({
    where: {
      studentId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Get checkins in date range
  const checkins = await prisma.checkin.findMany({
    where: {
      studentId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  // Calculate daily totals
  const dailyStats = {};

  // Initialize all dates in range
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const dateStr = current.toISOString().split('T')[0];
    dailyStats[dateStr] = {
      date: dateStr,
      studyMinutes: 0,
      checkins: {
        hit: 0,
        partial: 0,
        miss: 0,
      },
      targetMet: false,
    };
    current.setDate(current.getDate() + 1);
  }

  // Aggregate study logs
  for (const log of logs) {
    if (dailyStats[log.date]) {
      dailyStats[log.date].studyMinutes += log.minutes;
    }
  }

  // Aggregate checkins
  for (const checkin of checkins) {
    if (dailyStats[checkin.date]) {
      dailyStats[checkin.date].checkins[checkin.status as keyof typeof dailyStats[0].checkins] += 1;

      // Check if target was met (hit or partial counts as meeting target for motivation)
      if (checkin.status === "hit" || checkin.status === "partial") {
        dailyStats[checkin.date].targetMet = true;
      }
    }
  }

  // Calculate summary stats
  const totalStudyMinutes = logs.reduce((sum, log) => sum + log.minutes, 0);
  const totalCheckins = checkins.length;
  const hitCheckins = checkins.filter(c => c.status === "hit").length;
  const consistencyRate = totalCheckins > 0 ? (hitCheckins / totalCheckins) * 100 : 0;

  // Calculate streaks
  let currentStreak = 0;
  let maxStreak = 0;

  const dates = Object.keys(dailyStats).sort();
  for (const date of dates) {
    const day = dailyStats[date];
    const studied = day.studyMinutes > 0;
    const targetMet = day.targetMet;

    if (studied || targetMet) {
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
      daysWithActivity: dates.filter(d =>
        dailyStats[d].studyMinutes > 0 || dailyStats[d].targetMet
      ).length,
    }
  };
}

/**
 * Get subject-wise breakdown (if we add subject tracking to logs)
 */
export async function getSubjectAnalytics(
  studentId: string,
  startDate: string,
  endDate: string
) {
  // Placeholder for when we add subject tracking
  // For now, return mock data based on exams from student profile
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { exam: true },
  });

  if (!student) return [];

  // Return basic breakdown by exam subject
  return [
    {
      subject: student.exam,
      minutes: 0, // Would be calculated from tagged logs
      percentage: 100,
      sessions: 0,
    }
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

    if (weekDays === 7 || day.date === analytics.dailyStats[analytics.dailyStats.length - 1].date) {
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