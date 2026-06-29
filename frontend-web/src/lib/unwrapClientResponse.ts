import type { Client } from "@/types";

/** Réponse Next.js (client à la racine) ou Express (`{ message, client }`). */
export function unwrapClientPayload(data: unknown): Client {
  if (data && typeof data === "object" && "client" in data) {
    const wrapped = data as { client?: Client };
    if (wrapped.client) return wrapped.client;
  }
  return data as Client;
}
