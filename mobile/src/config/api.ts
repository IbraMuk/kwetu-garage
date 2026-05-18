import { Platform } from "react-native";

/** Hôte du backend en développement (émulateur Android → 10.0.2.2). */
const DEV_HOST = Platform.select({
  android: "10.0.2.2",
  default: "localhost",
});

/**
 * URL de l'API Next.js (même backend que le web).
 * Sur un téléphone physique, définir EXPO_PUBLIC_API_URL=http://VOTRE_IP:3000/api
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? `http://${DEV_HOST}:3000/api`;
