import { clearLocalValue, readLocalValue, writeLocalValue } from "@/shared/lib/storage";
import type { StoredAuthSession } from "@/shared/types/api";

const AUTH_SESSION_STORAGE_KEY = "baramiz.auth.session";

function isStoredAuthSession(value: unknown): value is StoredAuthSession {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const session = value as Record<string, unknown>;
  const user = session.user;

  return (
    typeof session.token === "string" &&
    session.token.trim().length > 0 &&
    typeof session.expiresAt === "string" &&
    typeof user === "object" &&
    user !== null &&
    !Array.isArray(user) &&
    typeof (user as Record<string, unknown>).id === "string" &&
    typeof (user as Record<string, unknown>).email === "string"
  );
}

function isExpired(expiresAt: string) {
  const expiryTime = Date.parse(expiresAt);
  return Number.isFinite(expiryTime) && expiryTime <= Date.now();
}

export function readAuthSession() {
  const session = readLocalValue<unknown>(AUTH_SESSION_STORAGE_KEY);

  if (!isStoredAuthSession(session)) {
    clearAuthSession();
    return null;
  }

  if (isExpired(session.expiresAt)) {
    clearAuthSession();
    return null;
  }

  return session;
}

export function writeAuthSession(session: StoredAuthSession) {
  writeLocalValue(AUTH_SESSION_STORAGE_KEY, session);
}

export function clearAuthSession() {
  clearLocalValue(AUTH_SESSION_STORAGE_KEY);
}

export function readAuthToken() {
  return readAuthSession()?.token ?? null;
}
