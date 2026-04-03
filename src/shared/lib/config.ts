import type { Language } from "@/shared/types/api";

const DEFAULT_API_BASE_URL = "/api";

function isLocalBackendUrl(value: string) {
  try {
    const url = new URL(value);
    return ["localhost", "127.0.0.1", "0.0.0.0"].includes(url.hostname);
  } catch {
    return false;
  }
}

function resolveApiBaseUrl() {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (import.meta.env.DEV && (!configuredApiBaseUrl || isLocalBackendUrl(configuredApiBaseUrl))) {
    return DEFAULT_API_BASE_URL;
  }

  return (configuredApiBaseUrl || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

export const appConfig = {
  apiBaseUrl: resolveApiBaseUrl(),
  defaultLanguage: (import.meta.env.VITE_DEFAULT_LANGUAGE || "en") as Language,
  routeStorageKey: "baramiz.generated-route",
} as const;
