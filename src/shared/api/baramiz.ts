import { appConfig } from "@/shared/lib/config";
import { formatDurationMinutes, formatPrice, titleCase, uniqueBy } from "@/shared/lib/utils";
import type {
  AdminPlace,
  AdminPlaceInput,
  ApiHealth,
  CategoryId,
  ChatInput,
  ChatResponse,
  DeletePlaceResponse,
  EventMoment,
  GeneratedRoute,
  GenerateRouteInput,
  GuideProfile,
  HotelItem,
  Language,
  PublicCategory,
  PublicCitySummary,
  PublicContentItem,
  PublicPlace,
  RestaurantItem,
  ServiceCategoryItem,
  ServiceCategorySlug,
  ServiceDirectoryEntry,
  ServiceHubCategory,
  ServiceItem,
  ServiceItemBase,
  TranslationResult,
} from "@/shared/types/api";
import { ApiRequestError, apiRequest } from "./client";
import {
  fallbackServiceHubCategories,
  fallbackServiceItems,
  placeCategoryGroups,
  serviceCategorySlugValues,
} from "./service-hub-data";
import {
  extractItems,
  normalizeAdminPlace,
  normalizeGeneratedRoute,
  normalizePublicCategory,
  normalizePublicCitySummary,
  normalizePublicContentItem,
  normalizePublicPlace,
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

const fallbackCategories: PublicCategory[] = [
  { id: "history", slug: "history", name: "History", icon: "landmark", type: "interest", sort_order: 1, is_active: true },
  { id: "culture", slug: "culture", name: "Culture", icon: "theater", type: "interest", sort_order: 2, is_active: true },
  { id: "museum", slug: "museum", name: "Museum", icon: "museum", type: "interest", sort_order: 3, is_active: true },
  { id: "nature", slug: "nature", name: "Nature", icon: "mountain", type: "interest", sort_order: 4, is_active: true },
  { id: "adventure", slug: "adventure", name: "Adventure", icon: "route", type: "interest", sort_order: 5, is_active: true },
  { id: "food", slug: "food", name: "Food", icon: "chef-hat", type: "interest", sort_order: 6, is_active: true },
];

function normalizeList<TOutput>(
  payload: unknown,
  mapper: (item: unknown) => TOutput | null,
) {
  return extractItems(payload)
    .map(mapper)
    .filter((item): item is TOutput => item !== null);
}

function normalizeGallery(item: Pick<PublicContentItem, "image_gallery" | "image_cover">) {
  const gallery = Array.isArray(item.image_gallery)
    ? item.image_gallery
    : typeof item.image_gallery === "string" && item.image_gallery.length > 0
      ? [item.image_gallery]
      : [];

  const primary = item.image_cover ? [item.image_cover] : [];
  return uniqueBy([...primary, ...gallery].filter(Boolean), (value) => value);
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
        featured_image: place.imageUrl || undefined,
        types: ["place"],
      });
      return;
    }

    existing.count += 1;
    if (!existing.featured_image && place.imageUrl) {
      existing.featured_image = place.imageUrl;
    }
  });

  return Array.from(groupedCities.values()).sort((left, right) => left.city.localeCompare(right.city));
}

async function requestOptionalList<TOutput>(
  path: string,
  parser: (payload: unknown) => TOutput[],
  fallback?: () => Promise<TOutput[]>,
) {
  try {
    const payload = await apiRequest<unknown>(path);
    return parser(payload);
  } catch (error) {
    if (fallback) {
      try {
        return await fallback();
      } catch {
        return [];
      }
    }

    if (error instanceof ApiRequestError && error.status === 404) {
      return [];
    }

    return [];
  }
}

function sortServiceCategoryItems(items: ServiceCategoryItem[]) {
  return [...items].sort((left, right) => {
    const leftBadge = left.badge ? 1 : 0;
    const rightBadge = right.badge ? 1 : 0;

    if (leftBadge !== rightBadge) {
      return rightBadge - leftBadge;
    }

    if ((left.rating ?? 0) !== (right.rating ?? 0)) {
      return (right.rating ?? 0) - (left.rating ?? 0);
    }

    return left.name.localeCompare(right.name);
  });
}

function toCategorySlug(slug: string): ServiceCategorySlug | null {
  return serviceCategorySlugValues.includes(slug as ServiceCategorySlug)
    ? (slug as ServiceCategorySlug)
    : null;
}

function withBaseServiceFields(
  categorySlug: ServiceCategorySlug,
  source: ServiceItemBase["source"],
  item: Omit<ServiceItemBase, "categorySlug" | "source">,
): ServiceItemBase {
  return {
    ...item,
    categorySlug,
    source,
  };
}

function toPlaceServiceItem(
  place: PublicPlace,
  categorySlug: ServiceCategorySlug,
  source: ServiceItemBase["source"] = "backend",
): ServiceItem {
  return {
    ...withBaseServiceFields(categorySlug, source, {
      id: place.id,
      kind: "service",
      name: place.name,
      shortDescription: place.description,
      fullDescription: place.description,
      city: place.city,
      region: place.region,
      image: place.imageUrl,
      gallery: place.imageUrl ? [place.imageUrl] : [],
      tags: [titleCase(place.category), "Destination"],
      badge: place.featured ? "Featured" : undefined,
      meta: `${place.region} · ${formatDurationMinutes(place.durationMinutes)}`,
      mapUrl: buildMapsLink(place.coordinates.lat, place.coordinates.lng),
      detailPath: `/places/${place.id}`,
    }),
    kind: "service",
    serviceType: place.category,
  };
}

function toContentBackedServiceItem(
  item: PublicContentItem,
  categorySlug: ServiceCategorySlug,
  source: ServiceItemBase["source"] = "backend",
): ServiceCategoryItem {
  const gallery = normalizeGallery(item);
  const base = withBaseServiceFields(categorySlug, source, {
    id: item.id,
    kind: "service",
    name: item.name,
    shortDescription: item.short_description,
    fullDescription: item.full_description,
    city: item.city,
    region: item.region,
    address: item.address,
    image: gallery[0],
    gallery,
    tags: uniqueBy([...item.tags, ...item.category_ids].filter(Boolean), (entry) => entry).slice(0, 4),
    badge: item.featured ? "Featured" : item.bookable ? "Bookable" : undefined,
    meta: getServiceMeta(item),
    priceLabel: formatPrice(item.price_from, item.price_to, item.currency),
    rating: item.rating,
    reviewCount: item.review_count,
    workingHours: item.working_hours,
    phone: item.contact_phone,
    telegram: item.contact_telegram,
    website: item.contact_website,
    mapUrl: item.map_url || buildMapsLink(item.latitude, item.longitude),
  });

  if (item.type === "hotel") {
    const hotel: HotelItem = {
      ...base,
      kind: "hotel",
      amenities: item.amenities,
    };
    return hotel;
  }

  if (item.type === "restaurant") {
    const restaurant: RestaurantItem = {
      ...base,
      kind: "restaurant",
      cuisine: item.category || item.tags[0],
    };
    return restaurant;
  }

  const serviceItem: ServiceItem = {
    ...base,
    kind: "service",
    serviceType: item.service_kind || item.type,
  };

  return serviceItem;
}

export async function getHealth() {
  const payload = await apiRequest<unknown>("/health");
  const response = payload && typeof payload === "object" ? (payload as ApiHealth) : null;
  return {
    status: response?.status === "ok" ? "ok" : "ok",
  } satisfies ApiHealth;
}

export async function getCategories(language = appConfig.defaultLanguage) {
  try {
    const payload = await apiRequest<unknown>("/categories", {
      query: { language },
    });
    const categories = normalizeList(payload, normalizePublicCategory);
    return categories.length ? categories : fallbackCategories;
  } catch {
    return fallbackCategories;
  }
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

function toEventMoment(item: PublicContentItem, source: EventMoment["source"]): EventMoment {
  return {
    ...item,
    normalizedGallery: normalizeGallery(item),
    source,
  };
}

export async function getGuides(language = appConfig.defaultLanguage) {
  return requestOptionalList<GuideProfile>(
    `/guides?language=${language}`,
    (payload) =>
      normalizeList(payload, normalizePublicContentItem)
        .filter((item) => Boolean(item.image_cover || normalizeGallery(item)[0]))
        .map(toGuideProfile),
    async () => {
      const items = await getContent({
        language,
        type: "service",
        featured: true,
      });

      return items
        .filter((item) => Boolean(item.image_cover || normalizeGallery(item)[0]))
        .map(toGuideProfile);
    },
  );
}

export async function getServices(language = appConfig.defaultLanguage) {
  return requestOptionalList<ServiceDirectoryEntry>(
    `/services?language=${language}`,
    (payload) =>
      normalizeList(payload, normalizePublicContentItem)
        .filter((item) => item.bookable || item.type === "hotel" || item.type === "restaurant" || item.type === "service")
        .map(toServiceDirectoryEntry)
        .sort((left, right) => {
          if (left.featured !== right.featured) {
            return Number(right.featured) - Number(left.featured);
          }

          return left.name.localeCompare(right.name);
        }),
    async () => {
      const items = await getContent({ language });

      return items
        .filter((item) => item.bookable || item.type === "hotel" || item.type === "restaurant" || item.type === "service")
        .map(toServiceDirectoryEntry)
        .sort((left, right) => {
          if (left.featured !== right.featured) {
            return Number(right.featured) - Number(left.featured);
          }

          return left.name.localeCompare(right.name);
        });
    },
  );
}

export async function getEvents(language = appConfig.defaultLanguage) {
  return requestOptionalList<EventMoment>(
    `/events?language=${language}`,
    (payload) =>
      normalizeList(payload, normalizePublicContentItem)
        .filter((item) => item.route_eligible || item.bookable)
        .map((item) => toEventMoment(item, "events-endpoint"))
        .sort((left, right) => {
          if (left.city !== right.city) {
            return left.city.localeCompare(right.city);
          }

          return (left.duration_minutes ?? 0) - (right.duration_minutes ?? 0);
        }),
    async () => {
      const items = await getContent({
        language,
        featured: true,
      });

      return items
        .filter((item) => item.route_eligible || item.bookable)
        .map((item) => toEventMoment(item, "content-fallback"))
        .sort((left, right) => {
          if (left.city !== right.city) {
            return left.city.localeCompare(right.city);
          }

          return (left.duration_minutes ?? 0) - (right.duration_minutes ?? 0);
        });
    },
  );
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
      value: formatDurationMinutes(detail?.duration_minutes ?? place.durationMinutes),
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
): Omit<GenerateRouteInput, "duration"> {
  return {
    city,
    interests: ["culture", "museum"],
    language,
  };
}

export async function getServiceHubCategories(language = appConfig.defaultLanguage): Promise<ServiceHubCategory[]> {
  try {
    const payload = await apiRequest<unknown>("/service-categories", {
      query: { language },
    });
    const fallbackBySlug = new Map(
      fallbackServiceHubCategories.map((category) => [category.slug, category]),
    );

    const categories = extractItems<Record<string, unknown>>(payload)
      .map((item): ServiceHubCategory | null => {
        const slug = typeof item.slug === "string" ? toCategorySlug(item.slug) : null;
        if (!slug) {
          return null;
        }

        const fallbackCategory = fallbackBySlug.get(slug);
        if (!fallbackCategory) {
          return null;
        }

        const category: ServiceHubCategory = {
          ...fallbackCategory,
          name:
            typeof item.title === "string" && item.title.trim()
              ? item.title
              : typeof item.name === "string" && item.name.trim()
                ? item.name
                : fallbackCategory.name,
          subtitle:
            typeof item.subtitle === "string" && item.subtitle.trim()
              ? item.subtitle
              : fallbackCategory.subtitle,
          description:
            typeof item.description === "string" && item.description.trim()
              ? item.description
              : fallbackCategory.description,
          image:
            typeof item.image === "string" && item.image.trim()
              ? item.image
              : fallbackCategory.image,
          accent:
            typeof item.accent === "string" && item.accent.trim()
              ? item.accent
              : fallbackCategory.accent,
          order:
            typeof item.order === "number" && Number.isFinite(item.order)
              ? item.order
              : typeof item.sort_order === "number" && Number.isFinite(item.sort_order)
                ? item.sort_order
                : fallbackCategory.order,
          isActive:
            typeof item.isActive === "boolean"
              ? item.isActive
              : typeof item.is_active === "boolean"
                ? item.is_active
                : fallbackCategory.isActive,
        };

        return category;
      })
      .filter((item): item is ServiceHubCategory => item !== null);

    return categories.length ? categories : fallbackServiceHubCategories;
  } catch {
    return fallbackServiceHubCategories;
  }
}

async function getCategoryItemsFromPlaces(
  slug: ServiceCategorySlug,
  language: Language,
): Promise<ServiceCategoryItem[]> {
  const places = await getPlaces({ language });
  const selectedCategories = placeCategoryGroups[slug] ?? [];

  const filteredPlaces =
    slug === "sightseeing"
      ? places
          .filter(
            (place) =>
              place.featured ||
              ["history", "culture", "museum", "nature", "adventure"].includes(place.category),
          )
          .slice(0, 12)
      : places.filter((place) => selectedCategories.includes(place.category));

  if (!filteredPlaces.length) {
    return sortServiceCategoryItems(fallbackServiceItems[slug] ?? []);
  }

  return sortServiceCategoryItems(filteredPlaces.map((place) => toPlaceServiceItem(place, slug)));
}

async function getCategoryItemsFromServices(
  slug: ServiceCategorySlug,
  language: Language,
): Promise<ServiceCategoryItem[]> {
  const serviceItems = await getServices(language);

  const filteredItems = serviceItems.filter((item) => {
    if (slug === "services") {
      return item.type === "service" || item.bookable;
    }

    if (slug === "hotels") {
      return item.type === "hotel";
    }

    if (slug === "restaurants") {
      return item.type === "restaurant";
    }

    return false;
  });

  if (!filteredItems.length) {
    return sortServiceCategoryItems(fallbackServiceItems[slug] ?? []);
  }

  return sortServiceCategoryItems(
    filteredItems.map((item) => toContentBackedServiceItem(item, slug)),
  );
}

export async function getServiceCategoryItems(
  slug: ServiceCategorySlug,
  language = appConfig.defaultLanguage,
): Promise<ServiceCategoryItem[]> {
  if (slug === "taxi" || slug === "hospitals" || slug === "pharmacies" || slug === "atms") {
    return sortServiceCategoryItems(fallbackServiceItems[slug] ?? []);
  }

  if (slug === "services" || slug === "hotels" || slug === "restaurants") {
    return getCategoryItemsFromServices(slug, language);
  }

  return getCategoryItemsFromPlaces(slug, language);
}

export function getFallbackServiceCategoryItems(slug: ServiceCategorySlug) {
  return fallbackServiceItems[slug] ?? [];
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

export function getServiceCategoryOrFallback(slug: string) {
  const serviceSlug = toCategorySlug(slug);
  if (!serviceSlug) {
    return null;
  }

  return fallbackServiceHubCategories.find((category) => category.slug === serviceSlug) ?? null;
}


