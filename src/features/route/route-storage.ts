import { appConfig } from "@/shared/lib/config";
import { clearSessionValue, readSessionValue, writeSessionValue } from "@/shared/lib/storage";
import type { GeneratedRoute, GenerateRouteInput } from "@/shared/types/api";
import { normalizeGeneratedRoute } from "@/shared/api/normalize";

export interface StoredRouteResult {
  input: GenerateRouteInput;
  route: GeneratedRoute;
  createdAt: string;
}

export function readStoredRouteResult() {
  const value = readSessionValue<StoredRouteResult>(appConfig.routeStorageKey);
  if (!value) {
    return null;
  }

  const route = normalizeGeneratedRoute(value.route);
  if (!route) {
    return null;
  }

  return {
    ...value,
    route,
  } satisfies StoredRouteResult;
}

export function writeStoredRouteResult(value: StoredRouteResult) {
  writeSessionValue(appConfig.routeStorageKey, value);
}

export function clearStoredRouteResult() {
  clearSessionValue(appConfig.routeStorageKey);
}
