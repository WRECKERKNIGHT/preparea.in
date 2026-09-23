import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, RefreshControl, Alert } from "react-native";
import { router } from "expo-router";
import { loadSession, fetchMe, logout, clearSession, api } from "@/lib/api";
import { Field, Btn, Card, Line, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof loadSession>>>(null);
  const [me, setMe] = useState<Awaited<ReturnType<typeof fetchMe>>["data"] | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [target, setTarget] = useState("");
  const [saving, setSaving] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  const refresh = useCallback(async () => {
    const s = await loadSession();
    setSession(s);
    setLoggedIn(!!s);
    if (!s) return;
    const res = await fetchMe(s.token);
    if (res.ok && res.data) {
      setMe(res.data);
      setTarget(String(res.data.student.dailyTargetMin));
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await loadSession();
      if (cancelled) return;
      setSession(s);
      setLoggedIn(!!s);
      if (!s) return;
      const res = await fetchMe(s.token);
      if (cancelled) return;
      if (res.ok && res.data) {
        setMe(res.data);
        setTarget(String(res.data.student.dailyTargetMin));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveTarget() {
    if (!session || !me) return;
    const min = Math.min(720, Math.max(60, Number(target) || 300));
    setSaving(true);
    const res = await api("/api/me", { method: "PATCH", body: { dailyTargetMin: min }, token: session.token });
    setSaving(false);
    if (!res.ok) {
      Alert.alert("Could not save", res.error?.message ?? "Try again.");
      return;
    }
    refresh();
  }

  async function handleLogout() {
    if (session) {
      await logout(session.token).catch(() => undefined);
    }
    await clearSession();
    setMe(null);
    setLoggedIn(false);
    router.replace("/");
  }

  if (!loggedIn) {
    return (
      <ScrollView contentContainerStyle={styles.center} style={styles.safe}>
        <TSerif style={{ fontSize: 24, textAlign: "center" }}>Not logged in</TSerif>
        <T style={{ color: theme.inkMuted, textAlign: "center", marginVertical: spacing.md }}>
          Log in to see your profile and settings.
        </T>
        <View style={{ flexDirection: "row", gap: spacing.sm }}>
          <Btn label="Log in" onPress={() => router.push("/login")} style={{ flex: 1 }} />
          <Btn label="Create account" variant="ghost" onPress={() => router.push("/register")} style={{ flex: 1 }} />
        </View>
      </ScrollView>
    );
  }

  const s = me?.student;

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
    >
      <TSerif style={styles.title}>{s?.name ?? "Your profile"}</TSerif>
      <T style={{ color: theme.inkMuted, marginBottom: spacing.lg }}>{s?.email}</T>

      <Card style={{ marginBottom: spacing.md }}>
        <T style={styles.cardTitle}>Details</T>
        <Row k="Class" v={s?.klass ?? "—"} />
        <Row k="Target exam" v={s?.exam ?? "—"} />
        <Row k="Streak" v={`${me?.streakDays ?? 0} days`} />
        <Row k="Joined" v={s?.createdAt ? s.createdAt.slice(0, 10) : "—"} />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <T style={styles.cardTitle}>Daily target</T>
        <T style={{ color: theme.inkMuted, marginBottom: spacing.sm }}>
          A realistic floor you can hit every single day.
        </T>
        <Field label="Minutes" value={target} onChangeText={setTarget} keyboardType="number-pad" />
        <Btn label={saving ? "Saving…" : "Save target"} onPress={saveTarget} disabled={saving} />
      </Card>

      <Line />

      <Btn label="Log out" variant="danger" onPress={handleLogout} />
      <T style={{ color: theme.inkFaint, fontSize: 12, textAlign: "center", marginTop: spacing.md }}>
        PrepArea · study in public, succeed in private
      </T>
    </ScrollView>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <View style={styles.row}>
      <T style={{ color: theme.inkMuted, flex: 1 }}>{k}</T>
      <T style={{ fontWeight: "600" }}>{v}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  center: { flexGrow: 1, alignItems: "center", justifyContent: "center", backgroundColor: theme.paper, padding: spacing.lg },
  title: { fontSize: 30, marginBottom: 2, letterSpacing: -0.4 },
  cardTitle: { fontSize: 17, fontWeight: "700", marginBottom: spacing.md, fontFamily: theme.fontSerif, letterSpacing: -0.2 },
  row: { flexDirection: "row", marginBottom: spacing.sm },
});