import type { ServiceCategorySlug } from "@/shared/types/api";

export const serviceCategorySlugList: readonly ServiceCategorySlug[] = [
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
] as const;

export function isServiceCategorySlug(value: string | null | undefined): value is ServiceCategorySlug {
  return Boolean(value && serviceCategorySlugList.includes(value as ServiceCategorySlug));
}
