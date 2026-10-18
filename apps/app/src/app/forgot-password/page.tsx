import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmail, normalizeEmail } from "@preparea/shared";
import { api } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSendResetLink() {
    if (!isEmail(email)) {
      Alert.alert("Check your email", "Enter a valid email address.");
      return;
    }

    setBusy(true);
    const res = await api<{ message: string }>("/api/auth/reset-password", {
      method: "POST",
      body: { email: normalizeEmail(email) },
    });
    setBusy(false);

    if (!res.ok) {
      Alert.alert("Reset failed", res.error?.message ?? "Please try again.");
      return;
    }

    Alert.alert(
      "Reset link sent",
      res.data?.message ?? "If the email exists, a reset link has been sent.",
      [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <TSerif style={styles.title}>Forgot Password</TSerif>
          <T style={styles.sub}>
            Enter your email address to receive a password reset link.
          </T>

          <Card>
            <Field
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <Btn label={busy ? "Sending…" : "Send reset link"} onPress={handleSendResetLink} disabled={busy} />
          </Card>

          <Btn
            label="Back to login"
            variant="ghost"
            onPress={() => router.replace("/login")}
            style={{ marginTop: spacing.md }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}