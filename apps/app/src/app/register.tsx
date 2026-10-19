import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CLASSES, EXAMS, isEmail, normalizeEmail, type Exam } from "@preparea/shared";
import { api } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [klass, setKlass] = useState<string | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [target, setTarget] = useState("300");
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (!name.trim() || !isEmail(email)) {
      Alert.alert("Almost there", "Enter your name and a valid email.");
      return;
    }
    if (!klass || !exam) {
      Alert.alert("Almost there", "Pick your class and target exam.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Check your password", "Password must be at least 8 characters.");
      return;
    }
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      Alert.alert("Check your password", "Password must contain letters and numbers.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Re-enter your password to confirm.");
      return;
    }
    const dailyTargetMin = Math.min(720, Math.max(60, Number(target) || 300));
    setBusy(true);
    const reg = await api<{ id: string; email: string }>("/api/register", {
      method: "POST",
      body: {
        name: name.trim(),
        klass,
        exam,
        email: normalizeEmail(email),
        password,
        confirmPassword,
        dailyTargetMin,
        source: "app",
      },
    });
    setBusy(false);
    if (!reg.ok) {
      Alert.alert("Registration issue", reg.error?.message ?? "Please try again.");
      return;
    }
    Alert.alert("Account created", "You can now log in with your email and password.", [
      { text: "Log in", onPress: () => router.back() },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <TSerif style={styles.title}>Create your account</TSerif>
          <T style={styles.sub}>
            One profile, used across the website and the app. First 7 days are a free trial.
          </T>

          <Card>
            <Field label="Name" value={name} onChangeText={setName} placeholder="Ananya Sharma" />
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
            />

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

            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="At least 8 chars with letters & numbers"
            />
            <Field
              label="Confirm password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              placeholder="Re-enter your password"
            />

            <Btn label={busy ? "Creating…" : "Create account"} onPress={handleSubmit} disabled={busy} />
          </Card>

          <Btn label="Back" variant="ghost" onPress={() => router.back()} style={{ marginTop: spacing.md }} />
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, flexGrow: 1 },
  title: { fontSize: 34, marginBottom: spacing.xs, letterSpacing: -0.5 },
  sub: { color: theme.inkMuted, marginBottom: spacing.lg, fontSize: 15 },
  fieldLabel: { color: theme.inkMuted, fontSize: 14, marginBottom: spacing.xs },
  pillWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs, marginBottom: spacing.md },
  pill: { borderRadius: theme.radius },
  pillActive: { borderRadius: theme.radius },
});