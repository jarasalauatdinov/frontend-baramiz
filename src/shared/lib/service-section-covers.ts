import atmsCover from "@/shared/assets/service-sections/atms.svg";
import historyAndCultureCover from "@/shared/assets/service-sections/history-and-culture.jpg";
import hospitalsCover from "@/shared/assets/service-sections/hospitals.svg";
import hotelsCover from "@/shared/assets/service-sections/hotels.jpg";
import museumsAndExhibitionsCover from "@/shared/assets/service-sections/museums-and-exhibitions.webp";
import natureCover from "@/shared/assets/service-sections/nature.png";
import pharmaciesCover from "@/shared/assets/service-sections/pharmacies.svg";
import restaurantsCover from "@/shared/assets/service-sections/restaurants.webp";
import servicesCover from "@/shared/assets/service-sections/services.png";
import sightseeingCover from "@/shared/assets/service-sections/sightseeing.jpg";
import taxiCover from "@/shared/assets/service-sections/taxi.svg";
import type { ServiceCategorySlug } from "@/shared/types/api";

export const serviceSectionCoverBySlug: Record<ServiceCategorySlug, string> = {
  services: servicesCover,
  "history-and-culture": historyAndCultureCover,
  nature: natureCover,
  "museums-and-exhibitions": museumsAndExhibitionsCover,
  restaurants: restaurantsCover,
  sightseeing: sightseeingCover,
  hotels: hotelsCover,
  taxi: taxiCover,
  hospitals: hospitalsCover,
  pharmacies: pharmaciesCover,
  atms: atmsCover,
};

export function getServiceSectionCover(slug: ServiceCategorySlug) {
  return serviceSectionCoverBySlug[slug];
}
