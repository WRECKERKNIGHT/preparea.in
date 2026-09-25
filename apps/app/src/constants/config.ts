/**
 * Point the mobile app at the PrepArea web API.
 * - Production builds: the deployed site (https://preparea.in).
 * - Local dev in Expo Go on the same Wi-Fi: swap in your computer's LAN IP.
 * - Web (react-native-web): relative URLs work by default.
 */
import { Platform } from "react-native";

const PROD_BASE = "https://preparea.in";

export const API_BASE: string = Platform.OS === "web" ? "" : PROD_BASE;

export const COMMUNITY = {
  telegram: "https://t.me/preparea_announcements",
  discord: "https://discord.gg/preparea",
} as const;