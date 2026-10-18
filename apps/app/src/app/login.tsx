import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmail, normalizeEmail } from "@preparea/shared";
import { login, saveSession, fetchMe } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleLogin() {
    if (!isEmail(email)) {
      Alert.alert("Check your email", "Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Check your password", "Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    const res = await login(normalizeEmail(email), password);
    if (!res.ok || !res.data?.token) {
      setBusy(false);
      Alert.alert("Login failed", res.error?.message ?? "Check your email and password.");
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
          <TSerif style={styles.title}>Log in</TSerif>
          <T style={styles.sub}>Enter your email and password to access your study dashboard.</T>

          <Card>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <Field
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Your password"
            />
            <Btn label={busy ? "Logging in…" : "Log in"} onPress={handleLogin} disabled={busy} />
          </Card>

          <Btn
            label="Back"
            variant="ghost"
            onPress={() => router.back()}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, flexGrow: 1 },
  title: { fontSize: 32, marginBottom: spacing.xs },
  sub: { color: theme.inkMuted, marginBottom: spacing.lg },
});