import { resolveBackendAssetUrl } from "@/shared/lib/config";
import { getServiceSectionCover } from "@/shared/lib/service-section-covers";
import type {
  AdminPlace,
  AuthPayload,
  AuthUser,
  CategoryId,
  ContentType,
  Coordinates,
  GeneratedRoute,
  GuideProfile,
  Language,
  PublicCategory,
  PublicCitySummary,
  PublicContentItem,
  PublicPlace,
  PublicServiceItem,
  PublicServiceSection,
  RouteDuration,
  ServiceDirectoryEntry,
  ServiceCategorySlug,
  ServiceMetadata,
  ServiceMetadataValue,
  ServiceSectionType,
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
const serviceCategorySlugs: ServiceCategorySlug[] = [
  "services",
  "history-and-culture",
  "nature",
  "museums-and-exhibitions",
  "restaurants",
  "sightseeing",
  "hotels",
  "taxi",
  "hospitals",
  "pharmacies",
  "atms",
];
const serviceSectionTypes: ServiceSectionType[] = ["discovery", "utility"];

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
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
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
  return ensureArray<unknown>(value).filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0);
}

function asAssetString(value: unknown) {
  return resolveBackendAssetUrl(value) ?? "";
}

function asOptionalAssetString(value: unknown) {
  return resolveBackendAssetUrl(value);
}

function asAssetStringArray(value: unknown) {
  return asStringArray(value)
    .map((entry) => resolveBackendAssetUrl(entry) ?? "")
    .filter(Boolean);
}

function asCoordinates(value: unknown): Coordinates {
  const coordinates = extractItem<Record<string, unknown>>(value);

  return {
    lat: asNumber(coordinates?.lat, 0),
    lng: asNumber(coordinates?.lng, 0),
  };
}

function asOptionalCoordinates(value: unknown) {
  const coordinates = extractItem<Record<string, unknown>>(value);
  if (!coordinates) {
    return undefined;
  }

  return {
    lat: asNumber(coordinates.lat, 0),
    lng: asNumber(coordinates.lng, 0),
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

function asServiceCategorySlug(value: unknown) {
  return serviceCategorySlugs.includes(value as ServiceCategorySlug)
    ? (value as ServiceCategorySlug)
    : null;
}

function asServiceSectionType(value: unknown, fallback: ServiceSectionType = "discovery"): ServiceSectionType {
  if (serviceSectionTypes.includes(value as ServiceSectionType)) {
    return value as ServiceSectionType;
  }

  if (value === "core") {
    return "discovery";
  }

  return fallback;
}

function normalizeMetadataValue(value: unknown): ServiceMetadataValue {
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }

  return null;
}

function asMetadata(value: unknown): ServiceMetadata {
  if (!isRecord(value)) {
    return {};
  }

  return Object.entries(value).reduce<ServiceMetadata>((result, [key, entry]) => {
    result[key] = normalizeMetadataValue(entry);
    return result;
  }, {});
}

function pickMetadataString(metadata: unknown, keys: string[]) {
  if (!isRecord(metadata)) {
    return undefined;
  }

  for (const key of keys) {
    const value = asOptionalString(metadata[key]);
    if (value) {
      return value;
    }
  }

  return undefined;
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
    slug: asString(item.slug, id),
    name: asString(item.name, "Untitled place"),
    description: asString(item.description, asString(item.shortDescription ?? item.short_description, "")),
    shortDescription: asString(item.shortDescription ?? item.short_description, ""),
    city: asString(item.city, ""),
    region: asString(item.region, ""),
    category: asCategoryId(item.category),
    address: asOptionalString(item.address),
    duration: asNumber(item.duration ?? item.durationMinutes ?? item.duration_minutes, 60),
    image: asAssetString(item.image ?? item.image_cover),
    gallery: asAssetStringArray(item.gallery ?? item.image_gallery),
    tags: asStringArray(item.tags),
    coordinates:
      isRecord(item.coordinates) || item.coordinates
        ? asCoordinates(item.coordinates)
        : {
            lat: asNumber(item.latitude, 0),
            lng: asNumber(item.longitude, 0),
          },
    featured: asBoolean(item.featured),
    rating: asOptionalNumber(item.rating),
    workingHours: asOptionalString(item.workingHours ?? item.working_hours),
    price: asOptionalString(item.price),
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
    featured_image: asOptionalAssetString(item.featured_image),
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
    image_cover: asOptionalAssetString(item.image_cover),
    image_gallery: asAssetStringArray(item.image_gallery),
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

export function normalizePublicServiceSection(payload: unknown): PublicServiceSection | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const slug = asServiceCategorySlug(item.slug);
  if (!slug) {
    return null;
  }

  return {
    id: asString(item.id, slug),
    slug,
    title: asString(item.title, slug),
    image: getServiceSectionCover(slug),
    order: asNumber(item.order, 0),
    isActive: asBoolean(item.isActive, true),
    shortDescription: asOptionalString(item.shortDescription),
    description: asOptionalString(item.description),
    icon: asOptionalString(item.icon),
    type: asServiceSectionType(item.type),
  };
}

export function normalizePublicServiceItem(payload: unknown): PublicServiceItem | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  const sectionSlug = asServiceCategorySlug(item.sectionSlug ?? item.section_slug);
  const slug = asString(item.slug);

  if (!id || !sectionSlug || !slug) {
    return null;
  }

  const image = asOptionalAssetString(item.image);
  const gallery = asAssetStringArray(item.gallery);
  const rawMetadata = isRecord(item.metadata) ? item.metadata : undefined;

  return {
    id,
    sectionSlug,
    slug,
    title: asString(item.title, slug),
    shortDescription: asOptionalString(item.shortDescription ?? item.short_description),
    description: asOptionalString(item.description),
    image: image ?? gallery[0],
    gallery,
    address: asOptionalString(item.address),
    city: asOptionalString(item.city),
    phoneNumbers: asStringArray(item.phoneNumbers ?? item.phone_numbers),
    workingHours: asOptionalString(item.workingHours ?? item.working_hours),
    district: asOptionalString(item.district),
    mapLink: asOptionalString(item.mapLink ?? item.map_link),
    websiteLink:
      asOptionalString(item.websiteLink) ??
      asOptionalString(item.website) ??
      asOptionalString(item.contactWebsite) ??
      pickMetadataString(rawMetadata, ["website", "websiteLink", "site"]),
    telegramLink:
      asOptionalString(item.telegramLink) ??
      asOptionalString(item.telegram) ??
      asOptionalString(item.contactTelegram) ??
      pickMetadataString(rawMetadata, ["telegram", "telegramLink", "telegramUrl"]),
    instagramLink:
      asOptionalString(item.instagramLink) ??
      asOptionalString(item.instagram) ??
      pickMetadataString(rawMetadata, ["instagram", "instagramLink", "instagramUrl"]),
    emergencyNote: asOptionalString(item.emergencyNote),
    serviceType: asOptionalString(item.serviceType ?? item.service_type),
    coordinates: asOptionalCoordinates(item.coordinates),
    distanceKm: asOptionalNumber(item.distanceKm ?? item.distance_km),
    distanceText: asOptionalString(item.distanceText ?? item.distance_text),
    tags: asStringArray(item.tags),
    featured: asBoolean(item.featured),
    isActive: asBoolean(item.isActive ?? item.is_active, true),
    metadata: asMetadata(item.metadata),
    detailPath: `/service/${sectionSlug}/${slug}`,
  };
}

export function normalizeGeneratedRoute(payload: unknown): GeneratedRoute | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const city = asString(item.city);
  const title = asString(item.title);
  if (!city || !title) {
    return null;
  }

  const stops = ensureArray<Record<string, unknown>>(item.stops ?? item.items)
    .map((stop) => {
      const id = asString(stop.id);
      if (!id) {
        return null;
      }

      return {
        id,
        order: asNumber(stop.order, 0),
        name: asString(stop.name, "Unknown stop"),
        city: asString(stop.city, city),
        category: asCategoryId(stop.category),
        description: asString(stop.description, ""),
        estimatedDurationMinutes: asNumber(
          stop.estimatedDurationMinutes ?? stop.estimated_duration_minutes,
          0,
        ),
        image: asAssetString(stop.image ?? stop.image_cover),
      };
    })
    .filter((stop): stop is GeneratedRoute["stops"][number] => stop !== null)
    .sort((left, right) => left.order - right.order);

  const metadata = isRecord(item.metadata)
    ? item.metadata
    : isRecord(item.meta)
      ? item.meta
      : null;
  const tips = ensureArray<unknown>(item.tips)
    .map((tip) => asOptionalString(tip))
    .filter((tip): tip is string => Boolean(tip));

  return {
    city,
    language: asLanguage(item.language),
    duration: asRouteDuration(item.duration),
    title,
    summary: asString(item.summary, ""),
    tips,
    mode: asOptionalString(item.mode ?? metadata?.mode),
    totalDurationMinutes: asNumber(item.totalDurationMinutes ?? item.total_duration_minutes, 0),
    stops,
  };
}

export function normalizeAuthUser(payload: unknown): AuthUser | null {
  const candidate = extractItem<Record<string, unknown>>(payload);
  if (!candidate) {
    return null;
  }

  const item = isRecord(candidate.user) ? (candidate.user as Record<string, unknown>) : candidate;

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  return {
    id,
    name: asString(item.name, "Traveler"),
    email: asString(item.email, ""),
    createdAt: asString(item.createdAt, ""),
  };
}

export function normalizeAuthPayload(payload: unknown): AuthPayload | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const user = normalizeAuthUser(item.user);
  const token = asString(item.token);
  if (!user || !token) {
    return null;
  }

  return {
    user,
    token,
    expiresAt: asString(item.expiresAt, ""),
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

function mapServiceSectionToContentType(
  sectionSlug: ServiceCategorySlug,
  serviceType?: string,
): ContentType {
  if (sectionSlug === "hotels") {
    return "hotel";
  }

  if (sectionSlug === "restaurants") {
    return "restaurant";
  }

  if (sectionSlug === "museums-and-exhibitions") {
    return "museum";
  }

  if (sectionSlug === "nature") {
    return "nature";
  }

  if (sectionSlug === "history-and-culture") {
    return "history_culture";
  }

  if (sectionSlug === "sightseeing") {
    return "sightseeing";
  }

  if (serviceType === "museum") {
    return "museum";
  }

  return "service";
}

export function normalizeServiceDirectoryEntry(payload: unknown): ServiceDirectoryEntry | null {
  const item = normalizePublicServiceItem(payload);
  if (!item) {
    return null;
  }

  const imageCover = item.image;
  const imageGallery = ensureArray([imageCover, ...item.gallery]).filter(
    (entry): entry is string => typeof entry === "string" && entry.length > 0,
  );

  return {
    id: item.id,
    slug: item.slug,
    source_kind: "content",
    source_id: item.id,
    type: mapServiceSectionToContentType(item.sectionSlug, item.serviceType),
    featured: item.featured,
    bookable: item.sectionSlug === "hotels",
    name: item.title,
    short_description: item.shortDescription ?? item.description ?? "",
    full_description: item.description ?? item.shortDescription ?? "",
    city: item.city ?? "",
    region: item.district ?? item.city ?? "",
    address: item.address,
    category: item.serviceType ?? item.sectionSlug,
    category_ids: [],
    tags: item.tags,
    image_cover: imageCover,
    image_gallery: imageGallery,
    latitude: item.coordinates?.lat,
    longitude: item.coordinates?.lng,
    map_url: item.mapLink,
    rating: typeof item.metadata.rating === "number" ? item.metadata.rating : undefined,
    review_count: undefined,
    price_from: undefined,
    price_to: undefined,
    currency: undefined,
    contact_phone: item.phoneNumbers[0],
    contact_telegram: item.telegramLink,
    contact_website: item.websiteLink,
    working_hours: item.workingHours,
    duration_minutes:
      typeof item.metadata.recommendedVisitMinutes === "number"
        ? item.metadata.recommendedVisitMinutes
        : undefined,
    amenities: [],
    languages: [],
    meta: item.distanceText,
    note: item.emergencyNote,
    available_cities: item.city ? [item.city] : [],
    service_kind: item.serviceType,
    recommended_trip_styles: [],
    recommended_budgets: [],
    nearby_keywords: [],
    route_eligible: false,
    normalizedGallery: imageGallery,
  };
}

export function normalizeGuideProfile(payload: unknown): GuideProfile | null {
  const item = extractItem<Record<string, unknown>>(payload);
  if (!item) {
    return null;
  }

  const id = asString(item.id);
  if (!id) {
    return null;
  }

  const contactMethod = asOptionalString(item.contactMethod);
  const contactHref = asOptionalString(item.contactHref);
  const contactLabel = asOptionalString(item.contactLabel);
  const imageCover = asOptionalAssetString(item.image);
  const imageGallery = imageCover ? [imageCover] : [];
  const phoneLabel = contactMethod === "phone"
    ? (contactHref?.replace(/^tel:/i, "") || contactLabel)
    : undefined;

  return {
    id,
    slug: asString(item.slug, id),
    source_kind: "content",
    source_id: id,
    type: "service",
    featured: false,
    bookable: false,
    name: asString(item.name, "Guide"),
    short_description: asString(item.shortBio ?? item.short_description, ""),
    full_description: asString(item.shortBio ?? item.description ?? item.short_description, ""),
    city: asString(item.city, ""),
    region: asString(item.city, ""),
    address: undefined,
    category: "guide",
    category_ids: [],
    tags: asStringArray(item.specialties),
    image_cover: imageCover,
    image_gallery: imageGallery,
    latitude: undefined,
    longitude: undefined,
    map_url: undefined,
    rating: undefined,
    review_count: undefined,
    price_from: undefined,
    price_to: undefined,
    currency: undefined,
    contact_phone: phoneLabel,
    contact_telegram: contactMethod === "telegram" ? contactHref : undefined,
    contact_website:
      contactMethod === "email" || contactMethod === "website"
        ? contactHref
        : undefined,
    working_hours: undefined,
    duration_minutes: undefined,
    amenities: [],
    languages: asStringArray(item.languages),
    meta: contactLabel,
    note: undefined,
    available_cities: asStringArray(item.availableCities ?? item.available_cities),
    service_kind: "guide",
    recommended_trip_styles: [],
    recommended_budgets: [],
    nearby_keywords: [],
    route_eligible: false,
    normalizedGallery: imageGallery,
  };
}
