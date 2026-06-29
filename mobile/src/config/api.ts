import { Platform } from "react-native";

/** Hôte du backend Express en développement (émulateur Android → 10.0.2.2). */
const DEV_HOST = Platform.select({
  android: "10.0.2.2",
  default: "localhost",
});

/**
 * API Express + PostgreSQL (port 3001).
 * Téléphone physique : EXPO_PUBLIC_API_URL=http://VOTRE_IP_LAN:3001/api
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEV_HOST}:3001/api`;
