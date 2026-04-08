export const VISITED_PLACE_IDS_KEY = "baramiz_visited_place_ids";
export const VISITED_PLACES_EVENT = "baramiz:visited-places-changed";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeVisitedPlaceIds(value: unknown): string[] {
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

export function readVisitedPlaceIds(): string[] {
  if (!canUseStorage()) {
    return [];
  }

  const raw = window.localStorage.getItem(VISITED_PLACE_IDS_KEY);
  if (!raw) {
    return [];
  }

  try {
    return normalizeVisitedPlaceIds(JSON.parse(raw));
  } catch {
    return [];
  }
}

function writeVisitedPlaceIds(placeIds: string[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(VISITED_PLACE_IDS_KEY, JSON.stringify(normalizeVisitedPlaceIds(placeIds)));
}

export function recordVisitedPlace(placeId: string) {
  const normalizedPlaceId = placeId.trim();
  if (!normalizedPlaceId) {
    return;
  }

  const nextVisitedPlaceIds = [
    normalizedPlaceId,
    ...readVisitedPlaceIds().filter((item) => item !== normalizedPlaceId),
  ].slice(0, 12);

  writeVisitedPlaceIds(nextVisitedPlaceIds);

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent(VISITED_PLACES_EVENT, {
        detail: {
          placeId: normalizedPlaceId,
          visitedPlaceIds: nextVisitedPlaceIds,
        },
      }),
    );
  }
}
