import type {
  AdminPlace,
  CategoryId,
  ContentType,
  Coordinates,
  GeneratedRoute,
  Language,
  PublicCategory,
  PublicCitySummary,
  PublicContentItem,
  PublicPlace,
  RouteDuration,
  TranslationResult,
} from "@/shared/types/api";

const categoryIds: CategoryId[] = ["history", "culture", "museum", "nature", "adventure", "food"];
const languages: Language[] = ["kaa", "uz", "ru", "en"];
const contentTypes: ContentType[] = [
  "place",
  "hotel",
  "restaurant",
  "museum",
  "sightseeing",
  "nature",
  "history_culture",
  "service",
];
const routeDurations: RouteDuration[] = ["3_hours", "half_day", "1_day"];

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function ensureArray<TValue>(
  payload: TValue[] | { items?: TValue[]; data?: TValue[] } | undefined | null,
): TValue[];
export function ensureArray<TValue = unknown>(payload: unknown): TValue[];
export function ensureArray<TValue = unknown>(payload: unknown): TValue[] {
  if (Array.isArray(payload)) {
    return payload as TValue[];
  }

  if (isRecord(payload) && Array.isArray(payload.items)) {
    return payload.items as TValue[];
  }

  if (isRecord(payload) && Array.isArray(payload.data)) {
    return payload.data as TValue[];
  }

  return [];
}

export function extractItems<TValue = unknown>(payload: unknown): TValue[] {
  return ensureArray<TValue>(payload);
}

export function extractItem<TValue = Record<string, unknown>>(payload: unknown): TValue | null {
  if (isRecord(payload) && isRecord(payload.item)) {
    return payload.item as TValue;
  }

  if (isRecord(payload) && isRecord(payload.data)) {
    return payload.data as TValue;
  }

  if (isRecord(payload)) {
    return payload as TValue;
  }

  return null;
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function asNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function asOptionalNumber(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  return asNumber(value, 0);
}

function asBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return fallback;
}

function asStringArray(value: unknown) {
  return ensureArray<unknown>(value).filter((entry): entry is string => typeof entry === "string");
}

function asCoordinates(value: unknown): Coordinates {
  const coordinates = extractItem<Record<string, unknown>>(value);

  return {
    lat: asNumber(coordinates?.lat, 0),
    lng: asNumber(coordinates?.lng, 0),
  };
}

function asCategoryId(value: unknown, fallback: CategoryId = "culture"): CategoryId {
  return categoryIds.includes(value as CategoryId) ? (value as CategoryId) : fallback;
}

function asLanguage(value: unknown, fallback: Language = "en"): Language {
  return languages.includes(value as Language) ? (value as Language) : fallback;
}

function asContentType(value: unknown, fallback: ContentType = "place"): ContentType {
  return contentTypes.includes(value as ContentType) ? (value as ContentType) : fallback;
}

function asRouteDuration(value: unknown, fallback: RouteDuration = "half_day"): RouteDuration {
  return routeDurations.includes(value as RouteDuration) ? (value as RouteDuration) : fallback;
}

export function normalizePublicCategory(payload: unknown): PublicCategory | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  return {
    id,
    slug: asString(item.slug, id),
    name: asString(item.name, id),
    icon: asOptionalString(item.icon),
    type: asString(item.type, "interest"),
    sort_order: asNumber(item.sort_order, 0),
    is_active: asBoolean(item.is_active, true),
  };
}

export function normalizePublicPlace(payload: unknown): PublicPlace | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  return {
    id,
    name: asString(item.name, "Untitled place"),
    description: asString(item.description, ""),
    city: asString(item.city, ""),
    region: asString(item.region, ""),
    category: asCategoryId(item.category),
    durationMinutes: asNumber(item.durationMinutes, 60),
    imageUrl: asString(item.imageUrl, ""),
    coordinates: asCoordinates(item.coordinates),
    featured: asBoolean(item.featured),
  };
}

export function normalizePublicCitySummary(payload: unknown): PublicCitySummary | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const city = asString(item.city);
  if (!city) {
    return null;
  }

  return {
    city,
    region: asString(item.region, ""),
    count: asNumber(item.count, 0),
    featured_image: asOptionalString(item.featured_image),
    types: asStringArray(item.types).map((value) => asContentType(value)),
  };
}

export function normalizePublicContentItem(payload: unknown): PublicContentItem | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  return {
    id,
    slug: asString(item.slug, id),
    source_kind: item.source_kind === "content" ? "content" : "place",
    source_id: asString(item.source_id, id),
    type: asContentType(item.type),
    featured: asBoolean(item.featured),
    bookable: asBoolean(item.bookable),
    name: asString(item.name, "Untitled entry"),
    short_description: asString(item.short_description, ""),
    full_description: asString(item.full_description, ""),
    city: asString(item.city, ""),
    region: asString(item.region, ""),
    address: asOptionalString(item.address),
    category: asOptionalString(item.category),
    category_ids: asStringArray(item.category_ids),
    tags: asStringArray(item.tags),
    image_cover: asOptionalString(item.image_cover),
    image_gallery: asStringArray(item.image_gallery),
    latitude: asOptionalNumber(item.latitude),
    longitude: asOptionalNumber(item.longitude),
    map_url: asOptionalString(item.map_url),
    rating: asOptionalNumber(item.rating),
    review_count: asOptionalNumber(item.review_count),
    price_from: asOptionalNumber(item.price_from),
    price_to: asOptionalNumber(item.price_to),
    currency: asOptionalString(item.currency),
    contact_phone: asOptionalString(item.contact_phone),
    contact_telegram: asOptionalString(item.contact_telegram),
    contact_website: asOptionalString(item.contact_website),
    working_hours: asOptionalString(item.working_hours),
    duration_minutes: asOptionalNumber(item.duration_minutes),
    amenities: asStringArray(item.amenities),
    languages: asStringArray(item.languages),
    meta: asOptionalString(item.meta),
    note: asOptionalString(item.note),
    available_cities: asStringArray(item.available_cities),
    service_kind: asOptionalString(item.service_kind),
    recommended_trip_styles: asStringArray(item.recommended_trip_styles),
    recommended_budgets: asStringArray(item.recommended_budgets),
    nearby_keywords: asStringArray(item.nearby_keywords),
    route_eligible: asBoolean(item.route_eligible),
  };
}

export function normalizeGeneratedRoute(payload: unknown): GeneratedRoute | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const items = ensureArray<Record<string, unknown>>(item.items).map((routeItem) => ({
    time: asString(routeItem.time, ""),
    place: {
      id: asString(extractItem<Record<string, unknown>>(routeItem.place)?.id, ""),
      name: asString(extractItem<Record<string, unknown>>(routeItem.place)?.name, "Unknown stop"),
      city: asString(extractItem<Record<string, unknown>>(routeItem.place)?.city, ""),
      category: asCategoryId(extractItem<Record<string, unknown>>(routeItem.place)?.category),
      imageUrl: asString(extractItem<Record<string, unknown>>(routeItem.place)?.imageUrl, ""),
      coordinates: asCoordinates(extractItem<Record<string, unknown>>(routeItem.place)?.coordinates),
      description: asString(extractItem<Record<string, unknown>>(routeItem.place)?.description, ""),
    },
    reason: asString(routeItem.reason, ""),
    estimatedDurationMinutes: asNumber(routeItem.estimatedDurationMinutes, 60),
  }));

  const summary = extractItem<Record<string, unknown>>(item.summary);

  return {
    city: asString(item.city, ""),
    duration: asRouteDuration(item.duration),
    language: asLanguage(item.language),
    totalMinutes: asNumber(item.totalMinutes, 0),
    items,
    summary: {
      stopCount: asNumber(summary?.stopCount, items.length),
      estimatedStartTime: asString(summary?.estimatedStartTime, ""),
      estimatedEndTime: asString(summary?.estimatedEndTime, ""),
      usedDuration: asRouteDuration(summary?.usedDuration),
      interests: asStringArray(summary?.interests).map((interest) => asCategoryId(interest)),
    },
  };
}

export function normalizeAdminPlace(payload: unknown): AdminPlace | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  return {
    id,
    name: asString(item.name, "Untitled place"),
    name_kaa: asString(item.name_kaa, ""),
    name_uz: asString(item.name_uz, ""),
    name_ru: asString(item.name_ru, ""),
    name_en: asString(item.name_en, ""),
    city: asString(item.city, ""),
    region: asString(item.region, ""),
    category: asCategoryId(item.category),
    durationMinutes: asNumber(item.durationMinutes, 60),
    description: asString(item.description, ""),
    description_kaa: asString(item.description_kaa, ""),
    description_uz: asString(item.description_uz, ""),
    description_ru: asString(item.description_ru, ""),
    description_en: asString(item.description_en, ""),
    image: asString(item.image, ""),
    coordinates: asCoordinates(item.coordinates),
    featured: asBoolean(item.featured),
  };
}

export function normalizeTranslationResult(payload: unknown): TranslationResult | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  return {
    name_ru: asString(item.name_ru, ""),
    name_en: asString(item.name_en, ""),
    description_ru: asString(item.description_ru, ""),
    description_en: asString(item.description_en, ""),
  };
}
