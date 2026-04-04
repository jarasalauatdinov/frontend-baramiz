import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockCitySeeds, type CityCardItem } from "@/entities/city";
import { mockPlaces } from "@/entities/place";
import { getCities, getPlaces } from "@/shared/api/baramiz";
import { ensureArray } from "@/shared/api/normalize";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import type { FeaturedPlaceItem } from "@/shared/types/home";
import type { PublicCitySummary, PublicPlace } from "@/shared/types/api";

function normalizeLookup(value: string) {
  return value
    .toLocaleLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zа-я0-9]/gi, "");
}

export function useHomePageModel() {
  const { language, t } = useI18n();

  const placesQuery = useQuery({
    queryKey: ["home", "places", language],
    queryFn: () => getPlaces({ language, featured: true }),
  });

  const citiesQuery = useQuery({
    queryKey: ["home", "cities", language],
    queryFn: () => getCities(language),
  });

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);

  const places = useMemo<PublicPlace[]>(() => {
    if (featuredPlaces.length > 0) {
      return featuredPlaces.slice(0, 2);
    }

    return mockPlaces.map((place) => ({
      ...place,
      description: place.fallbackDescriptionKey ? t(place.fallbackDescriptionKey) : place.description,
      shortDescription: place.fallbackDescriptionKey ? t(place.fallbackDescriptionKey) : place.shortDescription,
    }));
  }, [featuredPlaces, t]);

  const cityCards = useMemo<CityCardItem[]>(() => {
    return mockCitySeeds.map((seed) => {
      const match = cities.find((city) => normalizeLookup(city.city) === normalizeLookup(seed.name));
      return {
        id: seed.id,
        name: seed.name,
        descriptor: t(seed.descriptorKey),
        image: match?.featured_image || seed.fallbackImage,
        href: `/route-generator?city=${encodeURIComponent(seed.name)}`,
        meta: match?.count ? t("home.cityMeta", { count: match.count }) : undefined,
      };
    });
  }, [cities, t]);

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
    cityCards,
    featuredPlaceItems,
    isInitialLoading:
      placesQuery.isPending &&
      featuredPlaces.length === 0 &&
      citiesQuery.isPending &&
      cities.length === 0,
  };
}
