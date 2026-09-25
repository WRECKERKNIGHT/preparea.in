import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLASSES, EXAMS, isEmail, normalizeEmail, type Exam } from "@preparea/shared";
import { requestOtp, verifyOtp, saveSession, fetchMe, api } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

type Stage = "form" | "otp";

export default function Register() {
  const [stage, setStage] = useState<Stage>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [klass, setKlass] = useState<string | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [target, setTarget] = useState("300");
  const [code, setCode] = useState("");
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submitProfile() {
    if (!name.trim() || !isEmail(email)) {
      Alert.alert("Almost there", "Enter your name and a valid email.");
      return;
    }
    if (!klass || !exam) {
      Alert.alert("Almost there", "Pick your class and target exam.");
      return;
    }
    const dailyTargetMin = Math.min(720, Math.max(60, Number(target) || 300));
    setBusy(true);
    const reg = await api<{ id: string; email: string }>("/api/register", {
      method: "POST",
      body: { name: name.trim(), klass, exam, email: normalizeEmail(email), dailyTargetMin, source: "app" },
    });
    if (!reg.ok) {
      setBusy(false);
      Alert.alert("Registration issue", reg.error?.message ?? "Please try again.");
      return;
    }
    const otp = await requestOtp(normalizeEmail(email));
    setBusy(false);
    if (otp.data?.devCode) {
      setDevCode(otp.data.devCode);
      Alert.alert("Dev code", `No email configured — use code ${otp.data.devCode}`);
    }
    setStage("otp");
  }

  async function handleVerify() {
    setBusy(true);
    const res = await verifyOtp(normalizeEmail(email), code.trim());
    if (!res.ok || !res.data?.token) {
      setBusy(false);
      Alert.alert("Wrong code", res.error?.message ?? "Enter the 6-digit code from your email.");
      return;
    }
    const token = res.data.token;
    const me = await fetchMe(token);
    if (!me.ok || !me.data?.student) {
      setBusy(false);
      Alert.alert("Could not load profile", "Log in again in a moment.");
      return;
    }
    await saveSession({ token, student: me.data.student });
    setBusy(false);
    router.replace("/(tabs)");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <TSerif style={styles.title}>{stage === "form" ? "Create your account" : "Confirm your email"}</TSerif>
          <T style={styles.sub}>
            {stage === "form"
              ? "One profile, used across the website and the app. First 7 days are a free trial."
              : `We emailed a 6-digit code to ${email}.`}
          </T>

          <Card>
            {stage === "form" ? (
              <>
                <Field label="Name" value={name} onChangeText={setName} placeholder="Ananya Sharma" />
                <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="you@example.com" />

                <T style={styles.fieldLabel}>Class</T>
                <View style={styles.pillWrap}>
                  {CLASSES.map((c) => (
                    <Pill key={c} label={c} active={klass === c} onPress={() => setKlass(c)} />
                  ))}
                </View>

                <T style={styles.fieldLabel}>Target exam</T>
                <View style={styles.pillWrap}>
                  {EXAMS.map((e) => (
                    <Pill key={e} label={e} active={exam === e} onPress={() => setExam(e)} />
                  ))}
                </View>

                <Field
                  label="Daily target (minutes)"
                  value={target}
                  onChangeText={setTarget}
                  keyboardType="number-pad"
                  placeholder="300"
                />

                <Btn label={busy ? "Creating…" : "Create account"} onPress={submitProfile} disabled={busy} />
              </>
            ) : (
              <>
                <Field
                  label="6-digit code"
                  value={code}
                  onChangeText={setCode}
                  keyboardType="number-pad"
                  placeholder="000000"
                />
                {devCode ? <DevCode code={devCode} /> : null}
                <Btn label={busy ? "Checking…" : "Verify and enter"} onPress={handleVerify} disabled={busy} />
              </>
            )}
          </Card>

          <Btn label="Back" variant="ghost" onPress={() => (stage === "otp" ? setStage("form") : router.back())} style={{ marginTop: spacing.md }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Pill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <View style={[styles.pill, active && styles.pillActive]}>
      <Btn label={label} variant={active ? "primary" : "ghost"} onPress={onPress} style={{ flexGrow: 1 }} />
    </View>
  );
}

function DevCode({ code }: { code: string }) {
  return (
    <View style={styles.devCode}>
      <T style={styles.devCodeText}>Dev code: {code}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, flexGrow: 1 },
  title: { fontSize: 34, marginBottom: spacing.xs, letterSpacing: -0.5 },
  sub: { color: theme.inkMuted, marginBottom: spacing.lg, fontSize: 15 },
  fieldLabel: { color: theme.inkMuted, fontSize: 14, marginBottom: spacing.xs },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  pill: { borderRadius: theme.radius },
  pillActive: { borderRadius: theme.radius },
  devCode: {
    backgroundColor: theme.accentLight,
    borderRadius: theme.radius,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: spacing.md,
  },
  devCodeText: { color: theme.accentHover, fontSize: 13, fontWeight: "600" },
});