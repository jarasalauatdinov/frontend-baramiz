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
  getServices,
  type ContentFilters,
  type PlaceFilters,
} from "@/api/baramiz";
import { appConfig } from "@/lib/config";

export function useHealthQuery() {
  return useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    staleTime: 2 * 60_000,
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: ["categories", appConfig.defaultLanguage],
    queryFn: () => getCategories(appConfig.defaultLanguage),
  });
}

export function useCitiesQuery() {
  return useQuery({
    queryKey: ["cities", appConfig.defaultLanguage],
    queryFn: () => getCities(appConfig.defaultLanguage),
  });
}

export function usePlacesQuery(filters: PlaceFilters = {}) {
  return useQuery({
    queryKey: ["places", filters],
    queryFn: () =>
      getPlaces({
        ...filters,
        language: filters.language ?? appConfig.defaultLanguage,
      }),
  });
}

export function usePlaceQuery(placeId?: string) {
  return useQuery({
    queryKey: ["place", placeId, appConfig.defaultLanguage],
    queryFn: () => getPlaceById(placeId!, appConfig.defaultLanguage),
    enabled: Boolean(placeId),
  });
}

export function useContentQuery(filters: ContentFilters = {}) {
  return useQuery({
    queryKey: ["content", filters],
    queryFn: () =>
      getContent({
        ...filters,
        language: filters.language ?? appConfig.defaultLanguage,
      }),
  });
}

export function useContentDetailQuery(contentId?: string) {
  return useQuery({
    queryKey: ["content-detail", contentId, appConfig.defaultLanguage],
    queryFn: () => getContentById(contentId!, appConfig.defaultLanguage),
    enabled: Boolean(contentId),
  });
}

export function useRelatedContentQuery(contentId?: string) {
  return useQuery({
    queryKey: ["content-related", contentId, appConfig.defaultLanguage],
    queryFn: () => getRelatedContent(contentId!, appConfig.defaultLanguage),
    enabled: Boolean(contentId),
  });
}

export function useGuidesQuery() {
  return useQuery({
    queryKey: ["guides", appConfig.defaultLanguage],
    queryFn: () => getGuides(appConfig.defaultLanguage),
  });
}

export function useServicesQuery() {
  return useQuery({
    queryKey: ["services", appConfig.defaultLanguage],
    queryFn: () => getServices(appConfig.defaultLanguage),
  });
}

export function useEventsQuery() {
  return useQuery({
    queryKey: ["events", appConfig.defaultLanguage],
    queryFn: () => getEvents(appConfig.defaultLanguage),
  });
}

export function useHomePageQueries() {
  const placesQuery = useQuery({
    queryKey: ["home", "places"],
    queryFn: () => getPlaces({ language: appConfig.defaultLanguage, featured: true }),
  });

  const citiesQuery = useQuery({
    queryKey: ["home", "cities"],
    queryFn: () => getCities(appConfig.defaultLanguage),
  });

  const categoriesQuery = useQuery({
    queryKey: ["home", "categories"],
    queryFn: () => getCategories(appConfig.defaultLanguage),
  });

  return {
    placesQuery,
    citiesQuery,
    categoriesQuery,
  };
}
