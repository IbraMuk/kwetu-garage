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

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { error?: string; message?: string } } })
      .response;
    return response?.data?.error ?? response?.data?.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
