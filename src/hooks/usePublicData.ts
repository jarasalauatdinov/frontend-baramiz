import { useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getCities,
  getContent,
  getContentById,
  getEvents,
  getGuides,
  getHealth,
  getPlaceById,
  getPlaces,
  getRelatedContent,
  getServiceCategoryItems,
  getServiceHubCategories,
  getServices,
  type ContentFilters,
  type PlaceFilters,
} from "@/shared/api/baramiz";
import { useI18n } from "@/shared/i18n/provider";
import type { ServiceCategorySlug } from "@/shared/types/api";

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

export function usePlacesQuery(filters: PlaceFilters = {}) {
  const { language } = useI18n();
  const requestLanguage = filters.language ?? language;

  return useQuery({
    queryKey: ["places", requestLanguage, filters],
    queryFn: () =>
      getPlaces({
        ...filters,
        language: requestLanguage,
      }),
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

export function useServiceHubCategoriesQuery() {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["service-hub", language],
    queryFn: () => getServiceHubCategories(language),
    staleTime: 5 * 60_000,
  });
}

export function useServiceCategoryItemsQuery(categorySlug?: ServiceCategorySlug) {
  const { language } = useI18n();

  return useQuery({
    queryKey: ["service-category-items", categorySlug, language],
    queryFn: () => getServiceCategoryItems(categorySlug!, language),
    enabled: Boolean(categorySlug),
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

  const categoriesQuery = useQuery({
    queryKey: ["home", "categories", language],
    queryFn: () => getCategories(language),
  });

  return {
    placesQuery,
    citiesQuery,
    categoriesQuery,
  };
}
