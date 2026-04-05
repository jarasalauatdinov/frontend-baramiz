import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockCitySeeds } from "@/entities/city";
import { mockPlaces } from "@/entities/place";
import { getPlaces } from "@/shared/api/baramiz";
import { ensureArray } from "@/shared/api/normalize";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import type { FeaturedPlaceItem } from "@/shared/types/home";
import type { PublicPlace } from "@/shared/types/api";

export function useHomePageModel() {
  const { language, t } = useI18n();

  const placesQuery = useQuery({
    queryKey: ["home", "places", language],
    queryFn: () => getPlaces({ language, featured: true }),
  });

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);

  const places = useMemo<PublicPlace[]>(() => {
    if (featuredPlaces.length > 0) {
      return featuredPlaces.slice(0, 3);
    }

    return mockPlaces.slice(0, 3).map((place) => ({
      ...place,
      description: place.fallbackDescriptionKey ? t(place.fallbackDescriptionKey) : place.description,
      shortDescription: place.fallbackDescriptionKey ? t(place.fallbackDescriptionKey) : place.shortDescription,
    }));
  }, [featuredPlaces, t]);

  const featuredPlaceItems = useMemo<FeaturedPlaceItem[]>(() => {
    return places.map((place) => ({
      id: place.id,
      title: place.name,
      subtitle: place.shortDescription || place.description,
      image: place.image,
      location: place.city || place.region,
      duration: formatDurationMinutes(place.duration, {
        flexible: t("common.duration.flexible"),
        hourShort: t("common.units.hourShort"),
        minuteShort: t("common.units.minuteShort"),
      }),
      tag: getInterestLabel(place.category, t),
      to: `/places/${place.id}`,
    }));
  }, [places, t]);

  return {
    featuredPlaceItems,
    heroFallbackImage: mockCitySeeds[0].fallbackImage,
    isInitialLoading: placesQuery.isPending && featuredPlaces.length === 0,
  };
}
