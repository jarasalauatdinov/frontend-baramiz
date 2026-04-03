import type { CategoryId, ServiceCategoryGroup, ServiceCategorySlug, ServiceHubCategory, ServiceItemKind } from "@/shared/types/api";
import type { TranslationKey } from "./en";
import type { TranslateFn } from "./provider";

const interestKeyMap: Record<CategoryId, TranslationKey> = {
  history: "category.history",
  culture: "category.culture",
  museum: "category.museum",
  nature: "category.nature",
  adventure: "category.adventure",
  food: "category.food",
};

function getServiceCategoryKey(
  slug: ServiceCategorySlug,
  field: "title" | "subtitle" | "description",
): TranslationKey {
  return `service.categories.${slug}.${field}` as TranslationKey;
}

export function getInterestLabel(categoryId: CategoryId, t: TranslateFn) {
  return t(interestKeyMap[categoryId]);
}

export function getServiceCategoryTitle(category: Pick<ServiceHubCategory, "slug" | "name">, t: TranslateFn) {
  return t(getServiceCategoryKey(category.slug, "title")) || category.name;
}

export function getServiceCategorySubtitle(category: Pick<ServiceHubCategory, "slug" | "subtitle">, t: TranslateFn) {
  return t(getServiceCategoryKey(category.slug, "subtitle")) || category.subtitle || "";
}

export function getServiceCategoryDescription(
  category: Pick<ServiceHubCategory, "slug" | "description">,
  t: TranslateFn,
) {
  return t(getServiceCategoryKey(category.slug, "description")) || category.description || "";
}

export function getServiceGroupBadge(group: ServiceCategoryGroup, t: TranslateFn) {
  return group === "utility" ? t("service.category.badge.utility") : t("service.category.badge.travel");
}

const serviceItemKindKeyMap: Record<ServiceItemKind, TranslationKey> = {
  contact: "service.item.kind.contact",
  hotel: "service.item.kind.hotel",
  restaurant: "service.item.kind.restaurant",
  service: "service.item.kind.service",
  utility: "service.item.kind.utility",
};

export function getServiceItemKindLabel(kind: ServiceItemKind, t: TranslateFn) {
  return t(serviceItemKindKeyMap[kind]);
}
