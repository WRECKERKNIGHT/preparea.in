import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, RefreshControl, Alert } from "react-native";
import * as WebBrowser from "expo-web-browser";
import type { PublicSettings } from "@preparea/shared";
import { loadSession, fetchMe, fetchSettings, joinChallenge } from "@/lib/api";
import { Btn, Card, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";
import { COMMUNITY } from "@/constants/config";

export default function CommunityScreen() {
  const [settings, setSettings] = useState<PublicSettings>({});
  const [me, setMe] = useState<Awaited<ReturnType<typeof fetchMe>>["data"] | null>(null);
  const [session, setSession] = useState<Awaited<ReturnType<typeof loadSession>>>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [joining, setJoining] = useState(false);

  const refresh = useCallback(async () => {
    const s = await loadSession();
    setSession(s);
    const st = await fetchSettings();
    setSettings(st);
    if (s) {
      const res = await fetchMe(s.token);
      if (res.ok) setMe(res.data);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await loadSession();
      if (cancelled) return;
      setSession(s);
      const st = await fetchSettings();
      if (cancelled) return;
      setSettings(st);
      if (s) {
        const res = await fetchMe(s.token);
        if (!cancelled && res.ok) setMe(res.data);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function open(url: string) {
    await WebBrowser.openBrowserAsync(url);
  }

  async function handleJoin() {
    if (!session) return;
    if (!settings.activeChallengeId) return;
    setJoining(true);
    const res = await joinChallenge(settings.activeChallengeId, session);
    setJoining(false);
    if (!res.ok) {
      Alert.alert("Could not join", res.error?.message ?? "Try again.");
      return;
    }
    refresh();
  }

  const joined = me?.challengeProgress?.joined ?? false;

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
    >
      <TSerif style={styles.title}>Community</TSerif>
      <T style={{ color: theme.inkMuted, marginBottom: spacing.lg }}>
        Same goal, same schedule. You are not doing this alone.
      </T>

      {settings.activeChallengeId ? (
        <Card style={{ marginBottom: spacing.md }}>
          <TSerif style={{ fontSize: 17 }}>Active challenge</TSerif>
          <T style={{ color: theme.inkMuted, marginTop: 4 }}>
            {joined
              ? "You are in. Log your daily minutes and keep the streak alive."
              : "This challenge is running now. Join and check in every day."}
          </T>
          {!joined && (
            <Btn label={joining ? "Joining…" : "Join this challenge"} onPress={handleJoin} disabled={joining} style={{ marginTop: spacing.md }} />
          )}
        </Card>
      ) : null}

      <T style={styles.groupTitle}>Keep in touch</T>
      <Card style={{ marginBottom: spacing.md }}>
        <T style={{ fontWeight: "600" }}>Announcements</T>
        <T style={{ color: theme.inkMuted, marginTop: 2 }}>Room links, topper sessions, fresh challenges.</T>
        <Btn label="Telegram channel" onPress={() => open(settings.telegramUrl ?? COMMUNITY.telegram)} style={{ marginTop: spacing.md }} />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <T style={{ fontWeight: "600" }}>Study buddies</T>
        <T style={{ color: theme.inkMuted, marginTop: 2 }}>Find partners in your class and exam and hold each other accountable.</T>
        <Btn label="Discord server" onPress={() => open(settings.discordUrl ?? COMMUNITY.discord)} style={{ marginTop: spacing.md }} />
      </Card>

      <Card>
        <T style={{ fontWeight: "600" }}>Mentors</T>
        <T style={{ color: theme.inkMuted, marginTop: 2 }}>
          Weekly sessions with toppers who recently cleared the same exams.
        </T>
        <T style={{ fontWeight: "600", marginTop: spacing.md }}>Rough week?</T>
        <T style={{ color: theme.inkMuted, marginTop: 2 }}>
          Ask an admin or mentor before you break a streak — a 2-minute message helps.
        </T>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: 30, marginBottom: 6, letterSpacing: -0.4 },
  groupTitle: { fontSize: 16, fontWeight: "700", marginBottom: spacing.sm, marginTop: spacing.md, fontFamily: theme.fontSansSemiBold },
});