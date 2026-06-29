/** Normalise une réponse API en tableau (évite les crashs .filter / .map). */
export function unwrapList<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.value)) return record.value as T[];
  }
  return [];
}

/** Extrait une entité (réponse Express `{ client }` ou objet direct). */
export function unwrapEntity<T>(data: unknown, keys: string[]): T {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;
    for (const key of keys) {
      if (record[key] && typeof record[key] === "object") {
        return record[key] as T;
      }
    }
  }
  return data as T;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = error as {
      response?: {
        data?: {
          error?: string;
          message?: string;
          errors?: { msg?: string }[] | { msg: string }[];
        };
      };
    };
    const data = res.response?.data;
    if (data?.error) return data.error;
    if (data?.message) return data.message;
    if (Array.isArray(data?.errors)) {
      const parts = data.errors
        .map((e) => (typeof e === "object" && e && "msg" in e ? e.msg : String(e)))
        .filter(Boolean);
      if (parts.length) return parts.join(" · ");
    }
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function formatNumber(value: number | null | undefined): string {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n.toLocaleString("fr-FR") : "0";
}

export function formatMoney(value: number | null | undefined): string {
  return `${formatNumber(value)} FCFA`;
}

export const DEMO_TOKEN = "demo-kwetu-garage";

export function isDemoToken(token: string | null | undefined): boolean {
  return token === DEMO_TOKEN;
}
