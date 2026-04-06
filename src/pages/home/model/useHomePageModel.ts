import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { mockCitySeeds } from "@/entities/city";
import { mockPlaces } from "@/entities/place";
import { getEvents, getGuides, getPlaces } from "@/shared/api/baramiz";
import { ensureArray } from "@/shared/api/normalize";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import type { FeaturedPlaceItem, FeaturedTourItem } from "@/shared/types/home";
import type { EventMoment, GuideProfile, PublicPlace } from "@/shared/types/api";

export function useHomePageModel() {
  const { language, t } = useI18n();

  const placesQuery = useQuery({
    queryKey: ["home", "places", language],
    queryFn: () => getPlaces({ language, featured: true }),
  });
  const guidesQuery = useQuery({
    queryKey: ["home", "guides", language],
    queryFn: () => getGuides(language),
  });
  const eventsQuery = useQuery({
    queryKey: ["home", "events", language],
    queryFn: () => getEvents(language),
  });

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);
  const guides = ensureArray<GuideProfile>(guidesQuery.data);
  const events = ensureArray<EventMoment>(eventsQuery.data);

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

  const heroImage = places[0]?.image || mockCitySeeds[0].fallbackImage;

  const featuredTourItems = useMemo<FeaturedTourItem[]>(() => {
    const durationLabels = {
      flexible: t("common.duration.flexible"),
      hourShort: t("common.units.hourShort"),
      minuteShort: t("common.units.minuteShort"),
    };
    const contentItems = [
      ...[...events]
        .sort((left, right) => Number(right.featured) - Number(left.featured))
        .slice(0, 2)
        .map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: item.short_description || item.full_description,
          image: item.image_cover || item.normalizedGallery[0] || heroImage,
          location: item.city || item.region,
          duration: item.duration_minutes ? formatDurationMinutes(item.duration_minutes, durationLabels) : undefined,
          badge: t("events.header.title"),
          to: "/events",
        })),
      ...[...guides]
        .sort((left, right) => Number(right.featured) - Number(left.featured))
        .slice(0, 2)
        .map((item) => ({
          id: item.id,
          title: item.name,
          subtitle: item.short_description || item.full_description,
          image: item.image_cover || item.normalizedGallery[0] || heroImage,
          location: item.city || item.region,
          badge: t("guides.header.title"),
          to: "/guides",
        })),
    ].slice(0, 3);

    if (contentItems.length > 0) {
      return contentItems;
    }

    return [
      {
        id: "route-fallback",
        title: t("home.tours.fallback.routeTitle"),
        subtitle: t("home.tours.fallback.routeCopy"),
        image: heroImage,
        location: places[0]?.city || places[0]?.region,
        badge: t("route.generator.hero.eyebrow"),
        to: "/route-generator",
      },
      {
        id: "guide-fallback",
        title: t("home.tours.fallback.guideTitle"),
        subtitle: t("home.tours.fallback.guideCopy"),
        image: places[1]?.image || heroImage,
        location: places[1]?.city || places[1]?.region,
        badge: t("guides.header.title"),
        to: "/guides",
      },
    ];
  }, [events, guides, heroImage, places, t]);

  return {
    featuredPlaceItems,
    featuredTourItems,
    heroImage,
    isInitialLoading: placesQuery.isPending && featuredPlaces.length === 0,
  };
}
