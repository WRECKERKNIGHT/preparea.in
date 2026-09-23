import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmail, normalizeEmail } from "@preparea/shared";
import { requestOtp, verifyOtp, saveSession, fetchMe } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSend() {
    if (!isEmail(email)) {
      Alert.alert("Check your email", "Enter a valid email address.");
      return;
    }
    setBusy(true);
    const res = await requestOtp(normalizeEmail(email));
    setBusy(false);
    if (!res.ok) {
      Alert.alert("Could not send OTP", res.error?.message ?? "Please try again.");
      return;
    }
    if (res.data?.devCode) {
      setDevCode(res.data.devCode);
      Alert.alert("Dev code", `No email configured — use code ${res.data.devCode}`);
    }
    setSent(true);
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
          <TSerif style={styles.title}>Log in</TSerif>
          <T style={styles.sub}>We email you a 6-digit code. No password to remember.</T>

          <Card>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
              editable={!sent}
            />
            {sent && (
              <Field
                label="6-digit code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                placeholder="000000"
              />
            )}
            {devCode && !sent && (
              <View style={{ marginBottom: spacing.md }}>
                <Tag label={`Dev code: ${devCode}`} />
              </View>
            )}
            {!sent ? (
              <Btn label={busy ? "Sending…" : "Send code"} onPress={handleSend} disabled={busy} />
            ) : (
              <Btn label={busy ? "Checking…" : "Verify and log in"} onPress={handleVerify} disabled={busy} />
            )}
            {sent && (
              <Btn label="Resend code" variant="ghost" onPress={handleSend} disabled={busy} style={{ marginTop: spacing.sm }} />
            )}
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

function Tag({ label }: { label: string }) {
  return (
    <View style={{ backgroundColor: theme.accentLight, borderRadius: theme.radius, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" }}>
      <T style={{ color: theme.accentHover, fontSize: 13, fontWeight: "600" }}>{label}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.paper },
  content: { padding: spacing.lg, flexGrow: 1 },
  title: { fontSize: 32, marginBottom: spacing.xs },
  sub: { color: theme.inkMuted, marginBottom: spacing.lg },
});