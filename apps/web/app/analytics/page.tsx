import { Metadata } from "next";
import { getServerSession } from "@/lib/session";
import { useEffect, useState } from "react";
import { TSerif, T, Card, Button, Badge } from "@/components/ui";
import { getAnalytics } from "@/lib/analytics";
import { DatePicker } from "@/components/ui/date-picker"; // We'll create this
import { ChartContainer } from "@/components/analytics-charts";

export const metadata: Metadata = {
  title: "Analytics - PrepArea",
  description: "View your study progress and performance trends",
};

export default function AnalyticsPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });

  // Initialize with last 30 days
  useEffect(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 29); // Last 30 days including today
    setDateRange({ start, end });
    loadAnalytics();
  }, []);

  useEffect(() => {
    // In a real app, we'd get session from context or cookie
    // For now, we'll simulate getting the current user
    getServerSession().then(setSession).finally(() => setLoading(false));
  }, []);

  const loadAnalytics = async () => {
    if (!session?.student?.id) {
      setError("Unable to load user data");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const startDate = dateRange.start.toISOString().split('T')[0];
      const endDate = dateRange.end.toISOString().split('T')[0];

      const data = await getAnalytics(session.student.id, startDate, endDate);
      setAnalyticsData(data);
    } catch (err) {
      console.error("Analytics loading error:", err);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full border-4 border-primary-500 border-t-transparent h-12 w-12"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="w-full max-w-md mx-auto">
          <TSerif className="mb-4">Error Loading Analytics</TSerif>
          <T className="mb-6">{error}</T>
          <Button onClick={loadAnalytics} variant="outline">
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-64">
          <TSerif className="text-xl text-muted-foreground">No data available</TSerif>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mb-6">
        <TSerif className="text-2xl font-bold mb-2">Study Analytics</TSerif>
        <div className="flex flex-wrap gap-4 mb-4">
          <Button
            onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 6); // Last 7 days
              setDateRange({ start, end });
              loadAnalytics();
            }}
            variant={dateRange.end.getDate() - dateRange.start.getDate() === 6 ? "primary" : "outline"}
          >
            Last 7 Days
          </Button>
          <Button
            onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 29); // Last 30 days
              setDateRange({ start, end });
              loadAnalytics();
            }}
            variant={dateRange.end.getDate() - dateRange.start.getDate() === 29 ? "primary" : "outline"}
          >
            Last 30 Days
          </Button>
          <Button
            onClick={() => {
              const end = new Date();
              const start = new Date();
              start.setDate(end.getDate() - 89); // Last 90 days
              setDateRange({ start, end });
              loadAnalytics();
            }}
            variant={dateRange.end.getDate() - dateRange.start.getDate() === 89 ? "primary" : "outline"}
          >
            Last 90 Days
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <T className="text-sm font-medium text-muted-foreground mb-2">Total Study Time</T>
            <TSerif className="text-2xl font-bold">
              {Math.floor(analyticsData.summary.totalStudyMinutes / 60)}h {analyticsData.summary.totalStudyMinutes % 60}m
            </T>
          </Card>

          <Card className="p-4">
            <T className="text-sm font-medium text-muted-foreground mb-2">Consistency Rate</T>
            <TSerif className="text-2xl font-bold">
              {analyticsData.summary.consistencyRate}%
            </T>
            <T className="text-sm text-muted-foreground mt-2">
              {analyticsData.summary.hitCheckins}/{analyticsData.summary.totalCheckins} checkins met target
            </T>
          </Card>

          <Card className="p-4">
            <T className="text-sm font-medium text-muted-foreground mb-2">Current Streak</T>
            <TSerif className="text-2xl font-bold text-primary-500">
              {analyticsData.summary.currentStreak} days
            </T>
            <T className="text-sm text-muted-foreground mt-2">
              Best: {analyticsData.summary.maxStreak} days
            </T>
          </Card>

          <Card className="p-4">
            <T className="text-sm font-medium text-muted-foreground mb-2">Days Active</T>
            <TSerif className="text-2xl font-bold">
              {analyticsData.summary.daysWithActivity}/{analyticsData.summary.daysTracked}
            </T>
            <T className="text-sm text-muted-foreground mt-2">
              ({Math.round((analyticsData.summary.daysWithActivity / analyticsData.summary.daysTracked) * 100)}%)
            </T>
          </Card>
        </div>

        {/* Charts */}
        <div className="col-span-2">
          <Card>
            <TSerif className="mb-4">Daily Study Time</TSerif>
            <SimpleChart
              data={analyticsData.dailyStats.map(day => ({
                date: day.date,
                value: day.studyMinutes
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
                data={analyticsData.dailyStats.map(day => ({
                  date: day.date,
                  value: day.checkins.hit + day.checkins.partial // Hit + partial = met target
                }))}
                title="Days Meeting Target"
                height={150}
                formatter={(value) => `${value} days`}
              />
              <SimpleChart
                data={analyticsData.dailyStats.map(day => ({
                  date: day.date,
                  value: day.checkins.miss
                }))}
                title="Days Missing Target"
                height={150}
                formatter={(value) => `${value} days`}
              />
            </div>
          </Card>
        </div>

        {/* Weekly Trends */}
        <div className="col-span-1">
          <Card>
            <TSerif className="mb-4">Weekly Average Study Time</TSerif>
            <SimpleChart
              data={analyticsData.weekly.map(week => ({
                date: week.weekEnd,
                value: week.averageMinutesPerDay
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
                <TSerif className="text-4xl font-bold text-primary-500">
                  {analyticsData.summary.currentStreak}
                </TSerif>
                <T className="text-sm text-muted-foreground">day streak</T>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Longest streak:</span>
                <span className="font-medium">{analyticsData.summary.maxStreak} days</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Goal:</span>
                <span className="font-medium">30 days</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}