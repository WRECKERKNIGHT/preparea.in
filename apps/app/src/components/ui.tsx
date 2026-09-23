import { Pressable, StyleSheet, Text, TextInput, View, type TextProps, type PressableProps } from "react-native";
import { theme, spacing } from "@/constants/theme";

export function T(props: TextProps) {
  return <Text {...props} style={[styles.text, props.style]} />;
}

export function TSerif(props: TextProps) {
  return <Text {...props} style={[styles.serif, props.style]} />;
}

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

export function Btn({
  label,
  onPress,
  variant = "primary",
  disabled,
  ...rest
}: { label: string; variant?: "primary" | "ghost" | "danger"; disabled?: boolean } & PressableProps) {
  return (
    <Pressable
      {...rest}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        variant === "primary" && styles.btnPrimary,
        variant === "ghost" && styles.btnGhost,
        variant === "danger" && styles.btnDanger,
        pressed && styles.btnPressed,
        disabled && styles.btnDisabled,
      ]}
    >
      <T style={[styles.btnText, variant !== "primary" && styles.btnTextSecondary, disabled && styles.btnTextDisabled]}>
        {label}
      </T>
    </Pressable>
  );
}

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  multiline,
  editable,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: "email-address" | "number-pad" | "default";
  secureTextEntry?: boolean;
  multiline?: boolean;
  editable?: boolean;
}) {
  return (
    <View style={styles.field}>
      <T style={styles.fieldLabel}>{label}</T>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.inkFaint}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        editable={editable}
        style={[
          styles.input,
          multiline && { minHeight: 72, textAlignVertical: "top" as const },
          editable === false && styles.inputDisabled,
        ]}
      />
    </View>
  );
}

export function Tag({ label, danger }: { label: string; danger?: boolean }) {
  return (
    <View style={[styles.tag, danger && styles.tagDanger]}>
      <T style={[styles.tagText, danger && styles.tagTextDanger]}>{label}</T>
    </View>
  );
}

export function Line() {
  return <View style={styles.line} />;
}

const styles = StyleSheet.create({
  text: {
    color: theme.ink,
    fontFamily: theme.fontSans,
    fontSize: 16,
    lineHeight: 24,
  },
  serif: {
    color: theme.ink,
    fontFamily: theme.fontSerif,
    fontWeight: "600",
  },
  card: {
    backgroundColor: theme.raised,
    borderColor: theme.edge,
    borderWidth: 1,
    borderRadius: theme.radius,
    padding: spacing.md,
  },
  btn: {
    borderRadius: theme.radius,
    paddingVertical: 13,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: theme.accent },
  btnGhost: { backgroundColor: theme.raised, borderColor: theme.edge, borderWidth: 1 },
  btnDanger: { backgroundColor: theme.raised, borderColor: theme.edge, borderWidth: 1 },
  btnPressed: { opacity: 0.82 },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: "#FFFFFF", fontWeight: "600", fontFamily: theme.fontSansMedium },
  btnTextSecondary: { color: theme.ink },
  btnTextDisabled: { color: theme.inkFaint },
  field: { marginBottom: spacing.md },
  fieldLabel: { color: theme.inkMuted, fontSize: 13, marginBottom: spacing.xs, fontWeight: "600" },
  input: {
    borderColor: theme.edge,
    borderWidth: 1,
    borderRadius: theme.radius,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 16,
    color: theme.ink,
    backgroundColor: theme.raised,
    fontFamily: theme.fontSans,
  },
  inputDisabled: { backgroundColor: theme.paper, color: theme.inkFaint },
  tag: {
    backgroundColor: theme.accentLight,
    borderRadius: theme.radius,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  tagDanger: { backgroundColor: "#F3E4DE" },
  tagText: { color: theme.accentHover, fontSize: 12, fontWeight: "600" },
  tagTextDanger: { color: theme.error, fontSize: 12, fontWeight: "600" },
  line: { height: 1, backgroundColor: theme.edge, marginVertical: spacing.md },
});