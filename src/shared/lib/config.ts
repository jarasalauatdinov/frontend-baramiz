import type { Language } from "@/shared/types/api";

const DEFAULT_API_BASE_URL = "/api";
const DEFAULT_PROXY_TARGET = "http://localhost:3000";

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}

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

  return trimTrailingSlash(configuredApiBaseUrl || DEFAULT_API_BASE_URL);
}

function resolveBackendOrigin() {
  const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  const proxyTarget = trimTrailingSlash(import.meta.env.VITE_API_PROXY_TARGET?.trim() || DEFAULT_PROXY_TARGET);

  if (isAbsoluteUrl(configuredApiBaseUrl || "")) {
    try {
      return new URL(configuredApiBaseUrl!).origin;
    } catch {
      return proxyTarget;
    }
  }

  if (import.meta.env.DEV) {
    return proxyTarget;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return proxyTarget;
}

export function resolveBackendAssetUrl(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return undefined;
  }

  const normalizedValue = value.trim();

  if (/^(https?:|data:|blob:)/i.test(normalizedValue)) {
    return normalizedValue;
  }

  const path = normalizedValue.startsWith("/") ? normalizedValue : `/${normalizedValue}`;

  try {
    return new URL(path, `${resolveBackendOrigin()}/`).toString();
  } catch {
    return normalizedValue;
  }
}

export const appConfig = {
  apiBaseUrl: resolveApiBaseUrl(),
  backendOrigin: resolveBackendOrigin(),
  defaultLanguage: (import.meta.env.VITE_DEFAULT_LANGUAGE || "en") as Language,
  routeStorageKey: "baramiz.generated-route",
} as const;
