import { StyleSheet, View, type ColorValue } from "react-native";
import { Tabs } from "expo-router";
import { theme } from "@/constants/theme";

function Shape({ kind, color }: { kind: "square" | "circle" | "rings" | "dot"; color: ColorValue }) {
  switch (kind) {
    case "square":
      return <View style={{ width: 10, height: 10, backgroundColor: color }} />;
    case "dot":
      return <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />;
    case "circle":
      return <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: color }} />;
    case "rings":
      return (
        <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: color, alignItems: "center", justifyContent: "center" }}>
          <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: color }} />
        </View>
      );
  }
}

function tabIcon(kind: "square" | "circle" | "rings" | "dot") {
  function Icon({ color, focused }: { color: ColorValue; focused: boolean }) {
    return (
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Shape kind={kind} color={focused ? theme.accent : theme.inkFaint} />
      </View>
    );
  }
  Icon.displayName = `TabIcon-${kind}`;
  return Icon;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.paper },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: theme.fontSerif, fontWeight: "600", fontSize: 19, color: theme.ink },
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.inkFaint,
        tabBarStyle: { backgroundColor: theme.raised, borderTopColor: theme.edge },
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600", fontFamily: theme.fontSansSemiBold, textTransform: "uppercase", letterSpacing: 0.5 },
        tabBarIconStyle: { marginTop: 4 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Today", tabBarIcon: tabIcon("square") }}
      />
      <Tabs.Screen
        name="rooms"
        options={{ title: "Rooms", tabBarIcon: tabIcon("circle") }}
      />
      <Tabs.Screen
        name="community"
        options={{ title: "Community", tabBarIcon: tabIcon("rings") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Me", tabBarIcon: tabIcon("dot") }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 26,
    height: 26,
    borderRadius: theme.radius,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  iconWrapActive: {
    backgroundColor: theme.accentLight,
  },
});