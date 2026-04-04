import { readAuthToken } from "@/shared/lib/auth-storage";
import { appConfig } from "@/shared/lib/config";
import type { ApiErrorResponse } from "@/shared/types/api";

export class ApiRequestError extends Error {
  readonly status: number;
  readonly details?: ApiErrorResponse["errors"];

  constructor(status: number, message: string, details?: ApiErrorResponse["errors"]) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions extends RequestInit {
  query?: object;
}

function buildUrl(path: string, query?: RequestOptions["query"]) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const combinedPath = `${appConfig.apiBaseUrl}${normalizedPath}`;
  const baseOrigin = typeof window !== "undefined" ? window.location.origin : appConfig.backendOrigin;
  const url = /^https?:\/\//i.test(combinedPath)
    ? new URL(combinedPath)
    : new URL(combinedPath, baseOrigin);

  Object.entries((query || {}) as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

function buildHeaders(options: RequestOptions) {
  const token = readAuthToken();
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export async function apiRequest<TResponse>(path: string, options: RequestOptions = {}) {
  const requestUrl = buildUrl(path, options.query);
  let response: Response;

  try {
    response = await fetch(requestUrl, {
      ...options,
      headers: buildHeaders(options),
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown network error";
    throw new ApiRequestError(
      0,
      `Could not reach the backend API at ${requestUrl}. ${errorMessage}`,
    );
  }

  if (!response.ok) {
    let errorPayload: ApiErrorResponse | undefined;

    try {
      errorPayload = (await response.json()) as ApiErrorResponse;
    } catch {
      errorPayload = undefined;
    }

    throw new ApiRequestError(
      response.status,
      errorPayload?.message || `Request to ${requestUrl} failed with status ${response.status}`,
      errorPayload?.errors,
    );
  }

  if (response.status === 204) {
    return null as TResponse;
  }

  return (await response.json()) as TResponse;
}
