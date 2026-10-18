import { useState, useEffect } from "react";
import { View, Text, Button, FlatList, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { api, loadSession } from "@/lib/api";
import { formatDate } from "@/lib/date-utils"; // We'll create this helper

export default function AnalyticsScreen() {
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
    start.setDate(end.getDate() - 29); // Last 30 days
    setDateRange({ start, end });
    loadAnalytics();
  }, []);

  useEffect(() => {
    // We'll reload when date range changes
    loadAnalytics();
  }, [dateRange]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const session = await loadSession();
      if (!session) {
        throw new Error("No active session");
      }

      const startDate = dateRange.start.toISOString().split('T')[0];
      const endDate = dateRange.end.toISOString().split('T')[0];

      const response = await api(`/api/analytics?startDate=${startDate}&endDate=${endDate}`, {
        method: "GET",
        token: session.token,
      });

      if (!response.ok) {
        throw new Error(response.error?.message || "Failed to fetch analytics");
      }

      setAnalyticsData(response.data);
    } catch (err) {
      console.error("Analytics loading error:", err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (range: { start: Date; end: Date }) => {
    setDateRange(range);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16, textAlign: "center" }}>
          Error Loading Analytics
        </Text>
        <Text style={{ textAlign: "center", marginBottom: 20, color: "#ef4444" }}>
          {error}
        </Text>
        <Button
          title="Try Again"
          color="#3b82f6"
          onPress={loadAnalytics}
        />
      </View>
    );
  }

  if (!analyticsData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" }}>
        <Text style={{ textAlign: "center", color: "#6b7280" }}>
          No data available
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
          Study Analytics
        </Text>

        {/* Date Range Selector - Simplified */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>
            Last 30 Days
          </Text>
          <Button
            title="Change"
            color="#3b82f6"
            onPress={() => {
              // In a real app, we'd show a date picker modal
              Alert.alert(
                "Date Range Selection",
                "Coming soon: Select custom date range\nFor now, viewing last 30 days",
                [{ text: "OK", style: "cancel" }]
              );
            }}
          />
        </View>

        {/* Summary Cards */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
          <View style={{ backgroundColor: "#f9fafb", padding: 16, borderRadius: 8, width: "48%" }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              Total Study Time
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {Math.floor(analyticsData.summary.totalStudyMinutes / 60)}h {analyticsData.summary.totalStudyMinutes % 60}m
            </Text>
          </View>

          <View style={{ backgroundColor: "#f9fafb", padding: 16, borderRadius: 8, width: "48%" }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              Consistency Rate
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#10b981" }}>
              {analyticsData.summary.consistencyRate}%
            </Text>
          </View>

          <View style={{ backgroundColor: "#f9fafb", padding: 16, borderRadius: 8, width: "48%" }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              Current Streak
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "#3b82f6" }}>
              {analyticsData.summary.currentStreak} days
            </Text>
          </View>

          <View style={{ backgroundColor: "#f9fafb", padding: 16, borderRadius: 8, width: "48%" }}>
            <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
              Days Active
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {analyticsData.summary.daysWithActivity}/{analyticsData.summary.daysTracked}
            </Text>
          </View>
        </View>

        {/* Charts Placeholder - In a real app we'd use a charting library */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Daily Study Time
          </Text>
          <View style={{
            height: 200,
            backgroundColor: "#f9fafb",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text style={{ color: "#6b7280", textAlign: "center" }}>
              Chart visualization would appear here\n(in a real app with a charting library)
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 8 }}>
            Checkin Consistency
          </Text>
          <View style={{
            height: 200,
            backgroundColor: "#f9fafb",
            borderRadius: 8,
            justifyContent: "center",
            alignItems: "center"
          }}>
            <Text style={{ color: "#6b7280", textAlign: "center" }}>
              Chart visualization would appear here
            </Text>
          </View>
        </View>

        {/* Navigation */}
        <View style={{ marginTop: 30, paddingHorizontal: 20 }}>
          <Button
            title="Study Timer"
            color="#10b981"
            onPress={() => router.push("/study-timer")}
          />
          <Button
            title="Study History"
            color="#6b7280"
            onPress={() => router.push("/study-history")}
          />
        </View>
      </View>
    </View>
  );
}