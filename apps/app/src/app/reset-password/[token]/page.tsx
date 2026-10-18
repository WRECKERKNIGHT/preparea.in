import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { isEmail, normalizeEmail } from "@preparea/shared";
import { api, saveSession, fetchMe } from "@/lib/api";
import { Btn, Card, Field, T, TSerif } from "@/components/ui";
import { theme, spacing } from "@/constants/theme";

export default function ResetPasswordScreen({ params }: { params: { token: string } }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleReset() {
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

    setBusy(true);
    const res = await api<{ message: string }>(`/api/auth/reset-password/${params.token}`, {
      method: "POST",
      body: { password, confirmPassword },
    });
    setBusy(false);

    if (!res.ok) {
      Alert.alert("Reset failed", res.error?.message ?? "Invalid or expired reset token.");
      return;
    }

    Alert.alert("Password reset", "Your password has been reset successfully.", [
      {
        text: "Log in",
        onPress: () => router.replace("/login"),
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content}>
          <TSerif style={styles.title}>Reset Password</TSerif>
          <T style={styles.sub}>
            Enter a new password for your account. Your reset link will expire in 1 hour.
          </T>

          <Card>
            <Field
              label="New password"
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
            <Btn label={busy ? "Resetting…" : "Reset password"} onPress={handleReset} disabled={busy} />
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