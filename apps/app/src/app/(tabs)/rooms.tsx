import { useEffect, useState, useCallback } from "react";
import { ScrollView, StyleSheet, View, RefreshControl, Linking, Alert } from "react-native";
import type { Room } from "@preparea/shared";
import { loadSession, fetchRooms } from "@/lib/api";
import { Btn, Card, Tag, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function RoomsScreen() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = useCallback(async () => {
    const s = await loadSession();
    const list = await fetchRooms(s);
    setRooms(list);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const s = await loadSession();
      const list = await fetchRooms(s);
      if (!cancelled) setRooms(list);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = [...rooms].sort((a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day));

  function openZoom(link?: string) {
    if (!link) return;
    Linking.openURL(link).catch(() => Alert.alert("Could not open link", link));
  }

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />}
    >
      <TSerif style={styles.title}>Live study rooms</TSerif>
      <T style={{ color: theme.inkMuted, marginBottom: spacing.lg }}>
        Scheduled group sessions — camera on, timer running, nobody checking their phone.
      </T>

      {sorted.length === 0 ? (
        <Card>
          <T style={{ color: theme.inkMuted }}>No rooms are scheduled right now. Check back soon.</T>
        </Card>
      ) : (
        sorted.map((room) => (
          <Card key={room.id} style={{ marginBottom: spacing.md }}>
            <View style={styles.rowBetween}>
              <TSerif style={{ fontSize: 16 }}>{room.name}</TSerif>
              {room.active && <Tag label="Active" />}
            </View>
            <T style={{ color: theme.inkMuted, marginTop: 4 }}>
              {room.day} · {room.time} · {room.durationMin} minutes
            </T>
            {room.examFocus ? <T style={{ color: theme.inkMuted }}>Focus: {room.examFocus}</T> : null}
            {room.zoomLink ? (
              <Btn label="Join on Zoom" onPress={() => openZoom(room.zoomLink)} style={{ marginTop: spacing.md }} />
            ) : null}
          </Card>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  title: { fontSize: 30, marginBottom: 6, letterSpacing: -0.4 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});