import { appConfig } from "@/lib/config";
import { readSessionValue, writeSessionValue } from "@/lib/storage";
import type { GeneratedRoute, GenerateRouteInput } from "@/types/api";
import { normalizeGeneratedRoute } from "@/api/normalize";

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
