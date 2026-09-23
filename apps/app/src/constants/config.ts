/**
 * Point the mobile app at the PrepArea web API.
 * - Expo Go on the same Wi-Fi: use your computer's LAN IP.
 * - Web (react-native-web): relative URLs work by default.
 */
import { Platform } from "react-native";

const LAN_BASE = "http://192.168.1.100:3000"; // TODO: set your LAN IP string

export const API_BASE: string =
  Platform.OS === "web" ? "" : LAN_BASE;

export const COMMUNITY = {
  telegram: "https://t.me/preparea_announcements",
  discord: "https://discord.gg/preparea",
} as const;