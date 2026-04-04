import { appConfig } from "@/shared/lib/config";
import { formatDurationMinutes, uniqueBy } from "@/shared/lib/utils";
import type {
  AdminPlace,
  AdminPlaceInput,
  ApiHealth,
  AuthPayload,
  AuthUser,
  CategoryId,
  ChatInput,
  ChatResponse,
  DeletePlaceResponse,
  EventMoment,
  GeneratedRoute,
  GenerateRouteInput,
  GuideProfile,
  Language,
  PublicCategory,
  PublicCitySummary,
  PublicContentItem,
  PublicPlace,
  PublicServiceItem,
  PublicServiceSection,
  ServiceDirectoryEntry,
  ServiceHubCategory,
  ServiceCategoryItem,
  ServiceCategorySlug,
  TranslationResult,
} from "@/shared/types/api";
import { ApiRequestError, apiRequest } from "./client";
import {
  extractItems,
  normalizeAdminPlace,
  normalizeAuthPayload,
  normalizeAuthUser,
  normalizeGeneratedRoute,
  normalizePublicCategory,
  normalizePublicCitySummary,
  normalizePublicContentItem,
  normalizePublicPlace,
  normalizePublicServiceItem,
  normalizePublicServiceSection,
  normalizeTranslationResult,
} from "./normalize";

export interface PlaceFilters {
  city?: string;
  category?: CategoryId;
  featured?: boolean;
  language?: Language;
}

export interface ContentFilters {
  type?: PublicContentItem["type"];
  city?: string;
  region?: string;
  category?: string;
  featured?: boolean;
  bookable?: boolean;
  search?: string;
  language?: Language;
}

export interface AdminPlaceFilters extends PlaceFilters {}
export interface ServiceSectionItemsFilters {
  language?: Language;
  lat?: number;
  lng?: number;
  radiusKm?: number;
}

function normalizeList<TOutput>(payload: unknown, mapper: (item: unknown) => TOutput | null) {
  return extractItems(payload)
    .map(mapper)
    .filter((item): item is TOutput => item !== null);
}

function normalizeGallery(item: Pick<PublicContentItem, "image_gallery" | "image_cover">) {
  const primary = item.image_cover ? [item.image_cover] : [];
  return uniqueBy([...primary, ...item.image_gallery].filter(Boolean), (value) => value);
}

function deriveCitiesFromPlaces(places: PublicPlace[]): PublicCitySummary[] {
  const groupedCities = new Map<string, PublicCitySummary>();

  places.forEach((place) => {
    const existing = groupedCities.get(place.city);

    if (!existing) {
      groupedCities.set(place.city, {
        city: place.city,
        region: place.region,
        count: 1,
        featured_image: place.image || undefined,
        types: ["place"],
      });
      return;
    }

    existing.count += 1;
    if (!existing.featured_image && place.image) {
      existing.featured_image = place.image;
    }
  });

  return Array.from(groupedCities.values()).sort((left, right) => left.city.localeCompare(right.city));
}

async function requestOptionalList<TOutput>(
  path: string,
  parser: (payload: unknown) => TOutput[],
) {
  try {
    const payload = await apiRequest<unknown>(path);
    return parser(payload);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return [];
    }

    return [];
  }
}

function toServiceHubCategory(section: PublicServiceSection): ServiceHubCategory {
  return {
    ...section,
    path: `/service/${section.slug}`,
  };
}

function sortServiceSections(items: PublicServiceSection[]) {
  return [...items].sort((left, right) => left.order - right.order || left.title.localeCompare(right.title));
}

function sortServiceItems(items: PublicServiceItem[]) {
  return [...items]
    .filter((item) => item.isActive)
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      return left.title.localeCompare(right.title);
    });
}

function toGuideProfile(item: PublicContentItem): GuideProfile {
  return {
    ...item,
    normalizedGallery: normalizeGallery(item),
  };
}

function toServiceDirectoryEntry(item: PublicContentItem): ServiceDirectoryEntry {
  return {
    ...item,
    normalizedGallery: normalizeGallery(item),
  };
}

function toEventMoment(item: PublicContentItem): EventMoment {
  return {
    ...item,
    normalizedGallery: normalizeGallery(item),
    source: "events-endpoint",
  };
}

export async function getHealth() {
  const payload = await apiRequest<unknown>("/health");
  const response = payload && typeof payload === "object" ? (payload as ApiHealth) : null;
  return {
    status: response?.status === "ok" ? "ok" : "ok",
  } satisfies ApiHealth;
}

export async function getCategories(language = appConfig.defaultLanguage) {
  const payload = await apiRequest<unknown>("/categories", {
    query: { language },
  });
  return normalizeList(payload, normalizePublicCategory);
}

export async function getCities(language = appConfig.defaultLanguage) {
  try {
    const places = await getPlaces({ language });
    return deriveCitiesFromPlaces(places);
  } catch {
    return [];
  }
}

export async function getPlaces(filters: PlaceFilters = {}) {
  const payload = await apiRequest<unknown>("/places", {
    query: filters,
  });
  return normalizeList(payload, normalizePublicPlace);
}

export async function getPlaceById(placeId: string, language = appConfig.defaultLanguage) {
  const payload = await apiRequest<unknown>(`/places/${placeId}`, {
    query: { language },
  });
  const item = normalizePublicPlace(payload);

  if (!item) {
    throw new ApiRequestError(500, `Place response for "${placeId}" could not be normalized.`);
  }

  return item;
}

export async function getContent(filters: ContentFilters = {}) {
  try {
    const payload = await apiRequest<unknown>("/content", {
      query: filters,
    });
    return normalizeList(payload, normalizePublicContentItem);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function getContentById(contentId: string, language = appConfig.defaultLanguage) {
  const payload = await apiRequest<unknown>(`/content/${contentId}`, {
    query: { language },
  });
  const item = normalizePublicContentItem(payload);

  if (!item) {
    throw new ApiRequestError(500, `Content response for "${contentId}" could not be normalized.`);
  }

  return item;
}

export async function getRelatedContent(contentId: string, language = appConfig.defaultLanguage) {
  try {
    const payload = await apiRequest<unknown>(`/content/${contentId}/related`, {
      query: { language },
    });
    return normalizeList(payload, normalizePublicContentItem);
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return [];
    }

    throw error;
  }
}

export async function generateRoute(input: GenerateRouteInput) {
  const payload = await apiRequest<unknown>("/routes/generate", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const route = normalizeGeneratedRoute(payload);

  if (!route) {
    throw new ApiRequestError(500, "Route response could not be normalized.");
  }

  return route;
}

export async function sendChatMessage(input: ChatInput) {
  return apiRequest<ChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function registerWithBackend(input: { name: string; email: string; password: string }) {
  const payload = await apiRequest<unknown>("/auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const authPayload = normalizeAuthPayload(payload);

  if (!authPayload) {
    throw new ApiRequestError(500, "Register response could not be normalized.");
  }

  return authPayload;
}

export async function loginWithBackend(input: { email: string; password: string }) {
  const payload = await apiRequest<unknown>("/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const authPayload = normalizeAuthPayload(payload);

  if (!authPayload) {
    throw new ApiRequestError(500, "Login response could not be normalized.");
  }

  return authPayload;
}

export async function getCurrentAuthenticatedUser() {
  const payload = await apiRequest<unknown>("/auth/me");
  const user = normalizeAuthUser(payload);

  if (!user) {
    throw new ApiRequestError(500, "Authenticated user response could not be normalized.");
  }

  return user;
}

export async function logoutCurrentUser(token?: string) {
  return apiRequest<{ message: string }>("/auth/logout", {
    method: "POST",
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : undefined,
  });
}

export async function getAdminPlaces(filters: AdminPlaceFilters = {}) {
  const payload = await apiRequest<unknown>("/admin/places", {
    query: filters,
  });
  return normalizeList(payload, normalizeAdminPlace);
}

export async function createAdminPlace(input: AdminPlaceInput) {
  const payload = await apiRequest<unknown>("/admin/places", {
    method: "POST",
    body: JSON.stringify(input),
  });
  const place = normalizeAdminPlace(payload);

  if (!place) {
    throw new ApiRequestError(500, "Admin place create response could not be normalized.");
  }

  return place;
}

export async function updateAdminPlace(placeId: string, input: AdminPlaceInput) {
  const payload = await apiRequest<unknown>(`/admin/places/${placeId}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
  const place = normalizeAdminPlace(payload);

  if (!place) {
    throw new ApiRequestError(500, `Admin place update response for "${placeId}" could not be normalized.`);
  }

  return place;
}

export async function deleteAdminPlace(placeId: string) {
  return apiRequest<DeletePlaceResponse>(`/admin/places/${placeId}`, {
    method: "DELETE",
  });
}

export async function translateAdminPlace(name_uz: string, description_uz: string) {
  const payload = await apiRequest<unknown>("/admin/translate", {
    method: "POST",
    body: JSON.stringify({ name_uz, description_uz }),
  });
  const translation = normalizeTranslationResult(payload);

  if (!translation) {
    throw new ApiRequestError(500, "Translation response could not be normalized.");
  }

  return translation;
}

export async function getGuides(language = appConfig.defaultLanguage) {
  return requestOptionalList<GuideProfile>(
    `/guides?language=${language}`,
    (payload) => normalizeList(payload, normalizePublicContentItem).map(toGuideProfile),
  );
}

export async function getServices(language = appConfig.defaultLanguage) {
  return requestOptionalList<ServiceDirectoryEntry>(
    `/services?language=${language}`,
    (payload) =>
      normalizeList(payload, normalizePublicContentItem)
        .map(toServiceDirectoryEntry)
        .sort((left, right) => {
          if (left.featured !== right.featured) {
            return Number(right.featured) - Number(left.featured);
          }

          return left.name.localeCompare(right.name);
        }),
  );
}

export async function getEvents(language = appConfig.defaultLanguage) {
  return requestOptionalList<EventMoment>(
    `/events?language=${language}`,
    (payload) =>
      normalizeList(payload, normalizePublicContentItem)
        .map(toEventMoment)
        .sort((left, right) => {
          if (left.city !== right.city) {
            return left.city.localeCompare(right.city);
          }

          return (left.duration_minutes ?? 0) - (right.duration_minutes ?? 0);
        }),
  );
}

export async function getServiceSections(language = appConfig.defaultLanguage): Promise<ServiceHubCategory[]> {
  const payload = await apiRequest<unknown>("/service/sections", {
    query: { language },
  });
  return sortServiceSections(normalizeList(payload, normalizePublicServiceSection)).map(toServiceHubCategory);
}

export async function getServiceSectionBySlug(
  slug: ServiceCategorySlug,
  language = appConfig.defaultLanguage,
): Promise<ServiceHubCategory> {
  const payload = await apiRequest<unknown>(`/service/sections/${slug}`, {
    query: { language },
  });
  const section = normalizePublicServiceSection(payload);

  if (!section) {
    throw new ApiRequestError(500, `Service section response for "${slug}" could not be normalized.`);
  }

  return toServiceHubCategory(section);
}

export async function getServiceSectionItems(
  slug: ServiceCategorySlug,
  filters: ServiceSectionItemsFilters = {},
): Promise<ServiceCategoryItem[]> {
  const query = {
    language: filters.language ?? appConfig.defaultLanguage,
    lat: filters.lat,
    lng: filters.lng,
    radiusKm: filters.radiusKm,
  };
  const payload = await apiRequest<unknown>(`/service/sections/${slug}/items`, {
    query,
  });
  return sortServiceItems(normalizeList(payload, normalizePublicServiceItem));
}

export async function getServiceSectionItemBySlug(
  sectionSlug: ServiceCategorySlug,
  itemSlug: string,
  language = appConfig.defaultLanguage,
): Promise<PublicServiceItem> {
  const payload = await apiRequest<unknown>(`/service/sections/${sectionSlug}/items/${itemSlug}`, {
    query: { language },
  });
  const item = normalizePublicServiceItem(payload);

  if (!item) {
    throw new ApiRequestError(
      500,
      `Service section item response for "${sectionSlug}/${itemSlug}" could not be normalized.`,
    );
  }

  return item;
}

export function buildMapsLink(latitude?: number, longitude?: number) {
  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function getServiceMeta(item: PublicContentItem) {
  const parts = [
    item.city,
    item.working_hours,
    item.price_from ? `From ${item.price_from} ${item.currency ?? "USD"}` : undefined,
  ].filter(Boolean);

  return parts.join(" · ");
}

export function getPlaceHeroMetrics(place: PublicPlace, detail?: PublicContentItem) {
  return [
    {
      label: "Estimated visit",
      value: formatDurationMinutes(detail?.duration_minutes ?? place.duration),
    },
    {
      label: "Region",
      value: place.region,
    },
    {
      label: "Travel mode",
      value: detail?.route_eligible ? "Route-ready" : "Flexible",
    },
  ];
}

export function getDefaultRouteInput(
  city = "",
  language = appConfig.defaultLanguage,
): GenerateRouteInput {
  return {
    city,
    interests: [],
    language,
  };
}

export function getSavedBookingHighlights() {
  return [
    {
      title: "Stay options",
      copy: "Compare bookable stays, polished hotel picks, and central areas for an easy demo flow.",
      to: "/service/hotels",
    },
    {
      title: "Dining picks",
      copy: "Keep lunch and dinner moments visible in the planning flow without leaving the app shell.",
      to: "/service/restaurants",
    },
    {
      title: "Travel support",
      copy: "Save practical contacts and service cards to support your route presentation.",
      to: "/service/services",
    },
  ];
}

export type { AuthPayload, AuthUser };
