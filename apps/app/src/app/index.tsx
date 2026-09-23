import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { loadSession } from "@/lib/api";
import { Btn, Card, Line, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function Landing() {
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    loadSession().then((s) => {
      if (s) {
        router.replace("/(tabs)");
      } else {
        setChecking(false);
      }
    });
  }, []);

  if (checking) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.brandRow}>
          <T style={styles.brandMark}>PA</T>
          <TSerif style={styles.brandName}>PrepArea</TSerif>
        </View>

        <View style={styles.hero}>
          <TSerif style={styles.heroTitle}>
            Show up.{"\n"}Study together.
          </TSerif>
          <T style={styles.heroSub}>
            The study community for JEE, NEET, CUET and Boards aspirants.
            Daily check-ins, live rooms, streaks and mentors.
          </T>
        </View>

        <Card>
          <T style={styles.cardTitle}>How it works</T>
          <View style={styles.featureRow}>
            <T style={styles.num}>01</T>
            <View style={{ flex: 1 }}>
              <T style={styles.featureTitle}>Check in daily</T>
              <T style={styles.featureBody}>
                Hit or miss — logging the day keeps you honest.
              </T>
            </View>
          </View>
          <View style={styles.featureRow}>
            <T style={styles.num}>02</T>
            <View style={{ flex: 1 }}>
              <T style={styles.featureTitle}>Join live rooms</T>
              <T style={styles.featureBody}>
                Scheduled group study sessions with a timer, no distractions.
              </T>
            </View>
          </View>
          <View style={styles.featureRow}>
            <T style={styles.num}>03</T>
            <View style={{ flex: 1 }}>
              <T style={styles.featureTitle}>Get mentors</T>
              <T style={styles.featureBody}>
                Past toppers guiding batch members.
              </T>
            </View>
          </View>
        </Card>

        <Line />

        <View style={styles.ctaRow}>
          <Btn label="Create your account" onPress={() => router.push("/register")} style={{ flex: 1 }} />
          <Btn label="Log in" variant="ghost" onPress={() => router.push("/login")} style={{ flex: 1 }} />
        </View>

        <T style={styles.footnote}>
          Demo login: demo@preparea.in — use the dev code shown on screen.
        </T>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  brandRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.xl },
  brandMark: {
    color: "#FFFFFF",
    backgroundColor: theme.accent,
    fontSize: 14,
    fontWeight: "700",
    fontFamily: theme.fontSansSemiBold,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: theme.radius,
    overflow: "hidden",
    letterSpacing: 0.5,
  },
  brandName: { fontSize: 19, fontFamily: theme.fontSerif, fontWeight: "600", letterSpacing: -0.3 },
  hero: { marginBottom: spacing.xl },
  heroTitle: { fontSize: 42, lineHeight: 48, marginBottom: spacing.md, letterSpacing: -0.6 },
  heroSub: { color: theme.inkMuted, fontSize: 17, lineHeight: 27 },
  cardTitle: { fontSize: 18, fontWeight: "700", marginBottom: spacing.md, fontFamily: theme.fontSerif, letterSpacing: -0.3 },
  featureRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  num: { color: theme.accent, fontWeight: "700", width: 32 },
  featureTitle: { fontWeight: "600" },
  featureBody: { color: theme.inkMuted, marginTop: 2 },
  ctaRow: { flexDirection: "row", gap: spacing.sm },
  footnote: { color: theme.inkFaint, fontSize: 13, textAlign: "center", marginTop: spacing.lg },
});