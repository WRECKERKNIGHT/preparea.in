"use client";

import { useEffect, useMemo, useState } from "react";
import { TSerif, T, Card, Button, Badge } from "@/components/ui";
import { api } from "@/lib/client-api";
import SimpleChart from "@/components/simple-chart";

interface DayStat {
  date: string;
  studyMinutes: number;
  checkins: { hit: number; partial: number; miss: number };
  targetMet: boolean;
}

interface WeekStat {
  weekEnd: string;
  averageMinutesPerDay: number;
  totalMinutes: number;
  days: number;
}

interface AnalyticsData {
  dailyStats: DayStat[];
  weekly: WeekStat[];
  summary: {
    totalStudyMinutes: number;
    totalCheckins: number;
    hitCheckins: number;
    consistencyRate: number;
    currentStreak: number;
    maxStreak: number;
    daysTracked: number;
    daysWithActivity: number;
  };
}

type RangeDays = 7 | 30 | 90;

function rangeFor(days: RangeDays): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - (days - 1));
  const toKey = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  return { start: toKey(start), end: toKey(end) };
}

export default function AnalyticsPage() {
  const [rangeDays, setRangeDays] = useState<RangeDays>(30);
  const [reloadKey, setReloadKey] = useState(0);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const range = useMemo(() => rangeFor(rangeDays), [rangeDays]);

  const changeRange = (days: RangeDays) => {
    setRangeDays(days);
    setLoading(true);
  };

  const retry = () => {
    setError(null);
    setLoading(true);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    const controller = new AbortController();

    // Every setState below runs after the first await, so the effect body
    // itself never triggers a synchronous cascading render.
    (async () => {
      try {
        const url = `/api/analytics?startDate=${range.start}&endDate=${range.end}`;
        const result = await api<AnalyticsData>(url, {
          signal: controller.signal,
        });
        setData(result);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error("Analytics loading error:", err);
        setError("Failed to load analytics data");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [range, reloadKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="mx-auto w-full max-w-md">
          <TSerif className="mb-4">Error Loading Analytics</TSerif>
          <T className="mb-6">{error}</T>
          <Button onClick={retry} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex h-64 items-center justify-center">
          <TSerif className="text-xl text-ink-muted">No data available</TSerif>
        </div>
      </div>
    );
  }

  const { summary, dailyStats, weekly } = data;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <TSerif className="mb-2 text-2xl font-bold">Study Analytics</TSerif>
        <div className="mb-4 flex flex-wrap gap-4">
          {([7, 30, 90] as RangeDays[]).map((days) => (
            <Button
              key={days}
              onClick={() => changeRange(days)}
              variant={rangeDays === days ? "primary" : "outline"}
            >
              Last {days} Days
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <T className="mb-2 text-sm font-medium text-ink-muted">
              Total Study Time
            </T>
            <TSerif className="text-2xl font-bold">
              {Math.floor(summary.totalStudyMinutes / 60)}h{" "}
              {summary.totalStudyMinutes % 60}m
            </TSerif>
          </Card>

          <Card className="p-4">
            <T className="mb-2 text-sm font-medium text-ink-muted">
              Consistency Rate
            </T>
            <TSerif className="text-2xl font-bold">
              {summary.consistencyRate}%
            </TSerif>
            <T className="mt-2 block text-sm text-ink-muted">
              {summary.hitCheckins}/{summary.totalCheckins} checkins met target
            </T>
          </Card>

          <Card className="p-4">
            <T className="mb-2 text-sm font-medium text-ink-muted">
              Current Streak
            </T>
            <TSerif className="text-2xl font-bold text-primary-600">
              {summary.currentStreak} days
            </TSerif>
            <T className="mt-2 block text-sm text-ink-muted">
              Best: {summary.maxStreak} days
            </T>
          </Card>

          <Card className="p-4">
            <T className="mb-2 text-sm font-medium text-ink-muted">
              Days Active
            </T>
            <TSerif className="text-2xl font-bold">
              {summary.daysWithActivity}/{summary.daysTracked}
            </TSerif>
            <T className="mt-2 block text-sm text-ink-muted">
              (
              {summary.daysTracked > 0
                ? Math.round(
                    (summary.daysWithActivity / summary.daysTracked) * 100
                  )
                : 0}
              %)
            </T>
          </Card>
        </div>

        {/* Charts */}
        <div className="col-span-2">
          <Card>
            <TSerif className="mb-4">Daily Study Time</TSerif>
            <SimpleChart
              data={dailyStats.map((day) => ({
                date: day.date,
                value: day.studyMinutes,
              }))}
              title="Minutes Studied Per Day"
              formatter={(value) => `${Math.round(value)} min`}
            />
          </Card>
        </div>

        <div className="col-span-2">
          <Card>
            <TSerif className="mb-4">Checkin Consistency</TSerif>
            <div className="space-y-4">
              <SimpleChart
                data={dailyStats.map((day) => ({
                  date: day.date,
                  value: day.checkins.hit + day.checkins.partial,
                }))}
                title="Days Meeting Target"
                height={150}
                formatter={(value) => `${Math.round(value)} days`}
              />
              <SimpleChart
                data={dailyStats.map((day) => ({
                  date: day.date,
                  value: day.checkins.miss,
                }))}
                title="Days Missing Target"
                height={150}
                formatter={(value) => `${Math.round(value)} days`}
              />
            </div>
          </Card>
        </div>

        {/* Weekly Trends */}
        <div className="col-span-1">
          <Card>
            <TSerif className="mb-4">Weekly Average Study Time</TSerif>
            <SimpleChart
              data={weekly.map((week) => ({
                date: week.weekEnd,
                value: week.averageMinutesPerDay,
              }))}
              title="Average Daily Study Time (Weekly)"
              formatter={(value) => `${Math.round(value)} min/day`}
            />
          </Card>
        </div>

        <div className="col-span-1">
          <Card>
            <TSerif className="mb-4">Study Streak</TSerif>
            <div className="space-y-4">
              <div className="text-center">
                <TSerif className="text-4xl font-bold text-primary-600">
                  {summary.currentStreak}
                </TSerif>
                <T className="block text-sm text-ink-muted">day streak</T>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Longest streak:</span>
                <span className="font-medium">{summary.maxStreak} days</span>
              </div>
              <div className="flex justify-between text-sm text-ink-muted">
                <span>Goal:</span>
                <span className="font-medium">30 days</span>
              </div>
              <Badge variant="secondary" className="w-full justify-center">
                Last {rangeDays} days
              </Badge>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
