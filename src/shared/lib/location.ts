import type { Coordinates, Language, PublicServiceItem, ServiceCategorySlug } from "@/shared/types/api";

const LOCATION_AWARE_UTILITY_SLUGS: ServiceCategorySlug[] = ["pharmacies", "hospitals", "atms"];

export interface NearbyServiceItem extends PublicServiceItem {
  distanceKm?: number;
  distanceText?: string;
}

export function isLocationAwareUtilityCategory(slug?: ServiceCategorySlug | null) {
  return Boolean(slug && LOCATION_AWARE_UTILITY_SLUGS.includes(slug));
}

export function hasCoordinates(value?: Coordinates | null): value is Coordinates {
  return Boolean(
    value &&
      Number.isFinite(value.lat) &&
      Number.isFinite(value.lng) &&
      !(value.lat === 0 && value.lng === 0),
  );
}

export function calculateDistanceKm(from: Coordinates, to?: Coordinates | null) {
  if (!hasCoordinates(to)) {
    return undefined;
  }

  const earthRadiusKm = 6371;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const fromLat = toRadians(from.lat);
  const toLat = toRadians(to.lat);

  const haversine =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2) * Math.cos(fromLat) * Math.cos(toLat);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function attachDistanceToItems(items: PublicServiceItem[], origin?: Coordinates | null): NearbyServiceItem[] {
  return items.map((item) => ({
    ...item,
    distanceKm: item.distanceKm ?? (origin ? calculateDistanceKm(origin, item.coordinates) : undefined),
    distanceText: item.distanceText,
  }));
}

export function sortItemsByDistance(items: NearbyServiceItem[]) {
  return [...items].sort((left, right) => {
    if (left.distanceKm === undefined && right.distanceKm === undefined) {
      return left.title.localeCompare(right.title);
    }

    if (left.distanceKm === undefined) {
      return 1;
    }

    if (right.distanceKm === undefined) {
      return -1;
    }

    if (left.distanceKm !== right.distanceKm) {
      return left.distanceKm - right.distanceKm;
    }

    return left.title.localeCompare(right.title);
  });
}

export function formatDistanceKm(distanceKm: number | undefined, language: Language) {
  if (distanceKm === undefined || Number.isNaN(distanceKm)) {
    return null;
  }

  const locale = getLanguageLocale(language);
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: distanceKm < 3 ? 1 : 0,
  });

  return `${formatter.format(distanceKm)} km`;
}

export function getDistanceLabel(
  item: Pick<NearbyServiceItem, "distanceText" | "distanceKm">,
  language: Language,
) {
  return item.distanceText || formatDistanceKm(item.distanceKm, language);
}

export function getNearbyItems(items: NearbyServiceItem[]) {
  return items.filter((item) => item.distanceKm !== undefined);
}

function getLanguageLocale(language: Language) {
  switch (language) {
    case "ru":
      return "ru-RU";
    case "uz":
      return "uz-Latn-UZ";
    case "kaa":
      return "uz-Latn-UZ";
    case "en":
    default:
      return "en-US";
  }
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
