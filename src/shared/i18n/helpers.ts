import type { CategoryId, ServiceCategorySlug, ServiceHubCategory } from "@/shared/types/api";
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

export function getServiceCategoryTitle(category: Pick<ServiceHubCategory, "slug" | "title">, t: TranslateFn) {
  const translated = t(getServiceCategoryKey(category.slug, "title"));
  return translated || category.title;
}

export function getServiceCategorySubtitle(
  category: Pick<ServiceHubCategory, "slug" | "shortDescription">,
  t: TranslateFn,
) {
  const translated = t(getServiceCategoryKey(category.slug, "subtitle"));
  return translated || category.shortDescription || "";
}

export function getServiceCategoryDescription(
  category: Pick<ServiceHubCategory, "slug" | "description" | "shortDescription">,
  t: TranslateFn,
) {
  const translated = t(getServiceCategoryKey(category.slug, "description"));
  return translated || category.description || category.shortDescription || "";
}
