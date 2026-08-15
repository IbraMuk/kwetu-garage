import Constants from "expo-constants";
import { Platform } from "react-native";

const API_PORT = 3001;

/** true si l'hôte est une boucle locale inaccessible depuis un mobile. */
function isLoopbackHost(host: string | null | undefined): boolean {
  return host === "localhost" || host === "127.0.0.1";
}

/** Extrait l'hôte d'une URL sans dépendre de `new URL()` (peu fiable sur Hermes). */
function extractHost(url: string): string | null {
  const match = /^[a-z]+:\/\/([^/:?#]+)/i.exec(url.trim());
  return match ? match[1] : null;
}

/**
 * Récupère l'IP LAN du PC qui exécute Metro (fournie par Expo Go).
 * Fonctionne sur appareil physique ET émulateur lancés via Expo Go.
 */
function getMetroHost(): string | null {
  const c = Constants as any;
  const hostUri =
    c.expoConfig?.hostUri ??
    c.expoGoConfig?.debuggerHost ??
    c.manifest?.debuggerHost ??
    c.manifest2?.extra?.expoGo?.debuggerHost ??
    null;
  if (!hostUri) return null;
  const host = String(hostUri).split(":")[0]?.trim();
  return host && !isLoopbackHost(host) ? host : null;
}

/** Hôte de repli quand Metro n'est pas détectable (émulateur Android → 10.0.2.2). */
const FALLBACK_HOST = Platform.select({
  android: "10.0.2.2",
  default: "localhost",
})!;

function resolveBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  // Sur le web, localhost est valide : on respecte l'env tel quel.
  if (Platform.OS === "web") {
    return envUrl || `http://${FALLBACK_HOST}:${API_PORT}/api`;
  }

  // Sur mobile, une URL explicite non-loopback est prioritaire.
  if (envUrl) {
    const host = extractHost(envUrl);
    if (host && !isLoopbackHost(host)) return envUrl;
  }

  // Auto-détection de l'IP du PC via Metro (idéal pour Expo Go / téléphone physique).
  const metroHost = getMetroHost();
  if (metroHost) return `http://${metroHost}:${API_PORT}/api`;

  return `http://${FALLBACK_HOST}:${API_PORT}/api`;
}

/**
 * API Express + PostgreSQL (port 3001).
 * L'URL est résolue automatiquement :
 *  - Web / émulateur : localhost ou 10.0.2.2
 *  - Téléphone physique (Expo Go) : IP LAN du PC détectée via Metro
 *  - Override manuel possible : EXPO_PUBLIC_API_URL=http://VOTRE_IP_LAN:3001/api
 */
export const API_BASE_URL = resolveBaseUrl();

// Log de diagnostic : visible dans les logs Metro au démarrage de l'app.
console.log("[API] URL de base utilisée:", API_BASE_URL);
