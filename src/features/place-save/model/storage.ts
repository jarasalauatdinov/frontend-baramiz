export const SAVED_PLACE_IDS_KEY = "baramiz_saved_place_ids";
export const SAVED_PLACES_EVENT = "baramiz:saved-places-changed";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeSavedPlaceIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

export function readSavedPlaceIds(): string[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(SAVED_PLACE_IDS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return normalizeSavedPlaceIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

function writeSavedPlaceIds(placeIds: string[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SAVED_PLACE_IDS_KEY, JSON.stringify(normalizeSavedPlaceIds(placeIds)));
}

export function isPlaceSaved(placeId: string) {
  return readSavedPlaceIds().includes(placeId);
}

export function toggleSavedPlace(placeId: string) {
  const normalizedPlaceId = placeId.trim();
  if (!normalizedPlaceId) {
    return false;
  }

  const savedPlaceIds = readSavedPlaceIds();
  const nextSaved =
    savedPlaceIds.includes(normalizedPlaceId)
      ? savedPlaceIds.filter((item) => item !== normalizedPlaceId)
      : [...savedPlaceIds, normalizedPlaceId];

  writeSavedPlaceIds(nextSaved);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(SAVED_PLACES_EVENT, {
        detail: {
          placeId: normalizedPlaceId,
          isSaved: nextSaved.includes(normalizedPlaceId),
        },
      }),
    );
  }

  return nextSaved.includes(normalizedPlaceId);
}
