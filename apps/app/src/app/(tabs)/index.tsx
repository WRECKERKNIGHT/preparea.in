import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, RefreshControl, Alert } from "react-native";
import type { DashboardMe } from "@preparea/shared";
import { loadSession, fetchMe, postCheckin } from "@/lib/api";
import { Btn, Card, Line, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function TodayScreen() {
  const [me, setMe] = useState<DashboardMe | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [session, setSession] = useState<Awaited<ReturnType<typeof loadSession>>>(null);
  const [logging, setLogging] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    const s = await loadSession();
    setSession(s);
    if (!s) return;
    const res = await fetchMe(s.token);
    if (res.ok && res.data) setMe(res.data);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await loadSession();
      if (cancelled) return;
      setSession(s);
      if (!s) return;
      const res = await fetchMe(s.token);
      if (!cancelled && res.ok && res.data) setMe(res.data);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!session || !me) {
    return (
      <ScrollView contentContainerStyle={styles.center} style={styles.safe}>
        <T style={{ color: theme.inkFaint }}>Loading…</T>
      </ScrollView>
    );
  }

  const maxMin = Math.max(...me.weekBuckets.map((b) => b.minutes), me.weekMinutes, 60);
  const hours = (me.todayMinutes / 60).toFixed(1);

  async function logMinutes(min: number) {
    setLogging(min);
    const res = await postCheckin({ completedMin: min }, session);
    setLogging(null);
    if (!res.ok) {
      Alert.alert("Could not log", res.error?.message ?? "Try again.");
      return;
    }
    refresh();
  }

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
    >
      <TSerif style={styles.greeting}>Hello, {me.student.name.split(" ")[0]}</TSerif>
      <T style={styles.subline}>{me.student.klass} · {me.student.exam}</T>

      {me.announcement ? (
        <Card style={styles.announce}>
          <T style={{ color: theme.accentHover, fontWeight: "600" }}>{me.announcement}</T>
        </Card>
      ) : null}

      <View style={styles.statRow}>
        <Card style={styles.stat}>
          <T style={styles.statValue}>{hours}h</T>
          <T style={styles.statLabel}>Today · target {Math.round(me.todayTargetMin)}m</T>
        </Card>
        <Card style={styles.stat}>
          <T style={styles.statValue}>{me.streakDays}</T>
          <T style={styles.statLabel}>Day streak</T>
        </Card>
        <Card style={styles.stat}>
          <T style={styles.statValue}>{me.weekMinutes}m</T>
          <T style={styles.statLabel}>This week</T>
        </Card>
      </View>

      <Card>
        <T style={styles.cardTitle}>Last 7 days</T>
        <View style={styles.bars}>
          {me.weekBuckets.map((b) => (
            <View key={b.label} style={styles.barCol}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(8, (b.minutes / maxMin) * 100)}%`,
                      backgroundColor: b.minutes === 0 ? theme.edge : theme.accent,
                    },
                  ]}
                />
              </View>
              <T style={styles.barLabel}>{b.label}</T>
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <T style={styles.cardTitle}>Log today&rsquo;s study</T>
        <T style={{ color: theme.inkMuted, marginBottom: spacing.md }}>
          Add minutes now &mdash; the daily check-in stays honest.
        </T>
        <View style={styles.logRow}>
          {[60, 120, 240, 300].map((m) => (
            <Btn
              key={m}
              label={logging === m ? "…" : `${m}m`}
              variant="ghost"
              onPress={() => logMinutes(m)}
              disabled={logging !== null}
              style={{ flex: 1 }}
            />
          ))}
        </View>
      </Card>

      {me.activeChallenge ? (
        <Card>
          <T style={styles.cardTitle}>{me.activeChallenge.name}</T>
          <T style={{ color: theme.inkMuted, marginBottom: spacing.sm }}>
            {me.challengeProgress.joined
              ? `${me.challengeProgress.dayStatuses.filter((d) => d === "hit").length} hits so far`
              : "You are not in this challenge yet — join from Community."}
          </T>
          <T style={styles.days}>
            {me.challengeProgress.dayStatuses
              .map((d, i) => (d === "hit" ? "●" : d === "partial" ? "◐" : d === "miss" ? "✕" : "·"))
              .join(" ")}
          </T>
        </Card>
      ) : null}

      {me.rooms.length > 0 ? (
        <Card>
          <T style={styles.cardTitle}>Live rooms today</T>
          {me.rooms.map((r) => (
            <View key={r.id} style={{ marginBottom: spacing.sm }}>
              <T style={{ fontWeight: "600" }}>{r.name}</T>
              <T style={{ color: theme.inkMuted }}>
                {r.day} at {r.time} · {r.durationMin} min{r.examFocus ? ` · ${r.examFocus}` : ""}
              </T>
            </View>
          ))}
        </Card>
      ) : null}

      {me.mentorSessions.length > 0 ? (
        <>
          <Line />
          <T style={styles.cardTitle}>Mentor sessions</T>
          {me.mentorSessions.map((s) => (
            <View key={s.id} style={{ marginBottom: spacing.sm }}>
              <T style={{ fontWeight: "600" }}>{s.topic}</T>
              <T style={{ color: theme.inkMuted }}>
                with {s.mentorName} · {s.date} {s.time}
              </T>
            </View>
          ))}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.paper },
  greeting: { fontSize: 32, marginBottom: 2, letterSpacing: -0.3 },
  subline: { color: theme.inkMuted, fontSize: 15, marginBottom: spacing.md },
  announce: { backgroundColor: theme.accentLight, borderColor: theme.accentLight, marginTop: spacing.md, marginBottom: spacing.md },
  statRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.md, marginBottom: spacing.md },
  stat: { flex: 1 },
  statValue: { fontSize: 20, fontWeight: "700" },
  statLabel: { color: theme.inkMuted, fontSize: 12, marginTop: 2 },
  cardTitle: { fontSize: 17, fontWeight: "700", marginBottom: spacing.sm, fontFamily: theme.fontSerif, letterSpacing: -0.2 },
  bars: { flexDirection: "row", gap: spacing.sm, height: 120, alignItems: "flex-end" },
  barCol: { flex: 1, alignItems: "center", height: "100%", justifyContent: "flex-end" },
  barTrack: { flex: 1, width: "100%", justifyContent: "flex-end", backgroundColor: theme.paper },
  barFill: { width: "100%", borderRadius: 2 },
  barLabel: { fontSize: 11, color: theme.inkMuted, marginTop: 4 },
  logRow: { flexDirection: "row", gap: spacing.xs },
  days: { letterSpacing: 3, fontSize: 16, color: theme.accent },
});