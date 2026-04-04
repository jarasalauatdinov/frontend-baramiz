import { useCallback, useEffect, useMemo, useState } from "react";
import { clearSessionValue, readSessionValue, writeSessionValue } from "@/shared/lib/storage";
import type { Coordinates } from "@/shared/types/api";

type LocationStatus = "idle" | "locating" | "ready" | "denied" | "unsupported" | "error";
type LocationErrorCode = "permission_denied" | "unavailable" | "timeout" | "unsupported" | "unknown" | null;

interface StoredLocation {
  coords: Coordinates;
  timestamp: number;
}

interface UseCurrentLocationResult {
  coords: Coordinates | null;
  status: LocationStatus;
  errorCode: LocationErrorCode;
  hasUsableLocation: boolean;
  requestLocation: () => void;
}

const LOCATION_STORAGE_KEY = "baramiz.utility.currentLocation";
const MAX_LOCATION_AGE_MS = 10 * 60_000;

function isStoredLocation(value: unknown): value is StoredLocation {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  const coords = candidate.coords;

  return (
    typeof candidate.timestamp === "number" &&
    coords !== null &&
    typeof coords === "object" &&
    !Array.isArray(coords) &&
    typeof (coords as Record<string, unknown>).lat === "number" &&
    typeof (coords as Record<string, unknown>).lng === "number"
  );
}

function readCachedLocation() {
  const value = readSessionValue<unknown>(LOCATION_STORAGE_KEY);

  if (!isStoredLocation(value)) {
    clearSessionValue(LOCATION_STORAGE_KEY);
    return null;
  }

  if (Date.now() - value.timestamp > MAX_LOCATION_AGE_MS) {
    clearSessionValue(LOCATION_STORAGE_KEY);
    return null;
  }

  return value.coords;
}

function mapGeolocationErrorCode(error?: GeolocationPositionError): LocationErrorCode {
  if (!error) {
    return "unknown";
  }

  if (error.code === error.PERMISSION_DENIED) {
    return "permission_denied";
  }

  if (error.code === error.POSITION_UNAVAILABLE) {
    return "unavailable";
  }

  if (error.code === error.TIMEOUT) {
    return "timeout";
  }

  return "unknown";
}

export function useCurrentLocation(): UseCurrentLocationResult {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [errorCode, setErrorCode] = useState<LocationErrorCode>(null);

  useEffect(() => {
    const cachedLocation = readCachedLocation();

    if (!cachedLocation) {
      return;
    }

    setCoords(cachedLocation);
    setStatus("ready");
    setErrorCode(null);
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      setErrorCode("unsupported");
      return;
    }

    setStatus("locating");
    setErrorCode(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        } satisfies Coordinates;

        setCoords(nextCoords);
        setStatus("ready");
        setErrorCode(null);
        writeSessionValue<StoredLocation>(LOCATION_STORAGE_KEY, {
          coords: nextCoords,
          timestamp: Date.now(),
        });
      },
      (error) => {
        const nextErrorCode = mapGeolocationErrorCode(error);
        setCoords(null);
        setErrorCode(nextErrorCode);
        setStatus(nextErrorCode === "permission_denied" ? "denied" : nextErrorCode === "unsupported" ? "unsupported" : "error");

        if (nextErrorCode === "permission_denied") {
          clearSessionValue(LOCATION_STORAGE_KEY);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60_000,
      },
    );
  }, []);

  return useMemo(
    () => ({
      coords,
      status,
      errorCode,
      hasUsableLocation: status === "ready" && Boolean(coords),
      requestLocation,
    }),
    [coords, errorCode, requestLocation, status],
  );
}
