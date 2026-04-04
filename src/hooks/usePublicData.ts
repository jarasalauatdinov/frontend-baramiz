import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCities,
  getContent,
  getContentById,
  getCurrentAuthenticatedUser,
  getEvents,
  getGuides,
  getHealth,
  getPlaceById,
  getPlaces,
  getRelatedContent,
  getServiceSectionBySlug,
  getServiceSectionItems,
  getServiceSectionItemBySlug,
  getServiceSections,
  getServices,
  type ServiceSectionItemsFilters,
  type ContentFilters,
  type PlaceFilters,
} from "@/shared/api/baramiz";
import { useI18n } from "@/shared/i18n/provider";
import type { Coordinates, ServiceCategorySlug } from "@/shared/types/api";

export function useHealthQuery() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 2 * 60_000,
  });
}

export function useCategoriesQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["categories", language],
    queryFn: () => getCategories(language),
  });
}

export function useCitiesQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["cities", language],
    queryFn: () => getCities(language),
  });
}

export function usePlacesQuery(filters: PlaceFilters = {}, options?: { enabled?: boolean }) {
  const { language } = useI18n();
  const requestLanguage = filters.language ?? language;

  return useQuery({
    queryKey: ["places", requestLanguage, filters],
    queryFn: () =>
      getPlaces({
        ...filters,
        language: requestLanguage,
      }),
    enabled: options?.enabled ?? true,
  });
}

export function usePlaceQuery(placeId?: string) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["place", placeId, language],
    queryFn: () => getPlaceById(placeId!, language),
    enabled: Boolean(placeId),
  });
}

export function useContentQuery(filters: ContentFilters = {}) {
  const { language } = useI18n();
  const requestLanguage = filters.language ?? language;

  return useQuery({
    queryKey: ["content", requestLanguage, filters],
    queryFn: () =>
      getContent({
        ...filters,
        language: requestLanguage,
      }),
  });
}

export function useContentDetailQuery(contentId?: string) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["content-detail", contentId, language],
    queryFn: () => getContentById(contentId!, language),
    enabled: Boolean(contentId),
  });
}

export function useRelatedContentQuery(contentId?: string) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["content-related", contentId, language],
    queryFn: () => getRelatedContent(contentId!, language),
    enabled: Boolean(contentId),
  });
}

export function useGuidesQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["guides", language],
    queryFn: () => getGuides(language),
  });
}

export function useServicesQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["services", language],
    queryFn: () => getServices(language),
  });
}

export function useEventsQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["events", language],
    queryFn: () => getEvents(language),
  });
}

export function useServiceSectionsQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["service-sections", language],
    queryFn: () => getServiceSections(language),
    staleTime: 5 * 60_000,
  });
}

export function useServiceSectionQuery(categorySlug?: ServiceCategorySlug) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["service-section", categorySlug, language],
    queryFn: () => getServiceSectionBySlug(categorySlug!, language),
    enabled: Boolean(categorySlug),
    staleTime: 5 * 60_000,
  });
}

export function useServiceCategoryItemsQuery(
  categorySlug?: ServiceCategorySlug,
  filters: Omit<ServiceSectionItemsFilters, "language"> = {},
) {
  const { language } = useI18n();
  const requestFilters = {
    ...filters,
    language,
  } satisfies ServiceSectionItemsFilters;

  return useQuery({
    queryKey: ["service-category-items", categorySlug, requestFilters],
    queryFn: () => getServiceSectionItems(categorySlug!, requestFilters),
    enabled: Boolean(categorySlug),
  });
}

export function useNearbyServiceCategoryItemsQuery(
  categorySlug?: ServiceCategorySlug,
  currentLocation?: Coordinates | null,
  radiusKm = 5,
) {
  const { language } = useI18n();
  const hasLocation = Boolean(
    currentLocation &&
      Number.isFinite(currentLocation.lat) &&
      Number.isFinite(currentLocation.lng),
  );

  return useQuery({
    queryKey: [
      "service-category-nearby-items",
      categorySlug,
      language,
      currentLocation?.lat,
      currentLocation?.lng,
      radiusKm,
    ],
    queryFn: () =>
      getServiceSectionItems(categorySlug!, {
        language,
        lat: currentLocation?.lat,
        lng: currentLocation?.lng,
        radiusKm,
      }),
    enabled: Boolean(categorySlug && hasLocation),
  });
}

export function useServiceCategoryItemQuery(categorySlug?: ServiceCategorySlug, itemSlug?: string) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["service-category-item", categorySlug, itemSlug, language],
    queryFn: () => getServiceSectionItemBySlug(categorySlug!, itemSlug!, language),
    enabled: Boolean(categorySlug && itemSlug),
  });
}

export function useHomePageQueries() {
  const { language } = useI18n();

  const placesQuery = useQuery({
    queryKey: ["home", "places", language],
    queryFn: () => getPlaces({ language, featured: true }),
  });

  const citiesQuery = useQuery({
    queryKey: ["home", "cities", language],
    queryFn: () => getCities(language),
  });

  const guidesQuery = useQuery({
    queryKey: ["home", "guides", language],
    queryFn: () => getGuides(language),
  });

  const servicesQuery = useQuery({
    queryKey: ["home", "services", language],
    queryFn: () => getServices(language),
  });

  return {
    placesQuery,
    citiesQuery,
    guidesQuery,
    servicesQuery,
  };
}

export function useAuthMeQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentAuthenticatedUser,
    enabled,
    retry: false,
  });
}
