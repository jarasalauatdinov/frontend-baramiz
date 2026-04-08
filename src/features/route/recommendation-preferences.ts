import type { TranslationKey } from "@/shared/i18n/en";
import type { TranslateFn } from "@/shared/i18n/provider";
import type { RouteStop } from "@/shared/types/api";

export const recommendationPreferenceIds = [
  "popular_places",
  "hidden_gems",
  "easy_to_reach",
  "family_friendly",
  "solo_friendly",
  "scenic_views",
  "quiet_places",
  "cultural_spots",
] as const;

export type RecommendationPreferenceId = (typeof recommendationPreferenceIds)[number];

const preferenceKeyMap: Record<RecommendationPreferenceId, TranslationKey> = {
  popular_places: "route.generator.preference.popular_places",
  hidden_gems: "route.generator.preference.hidden_gems",
  easy_to_reach: "route.generator.preference.easy_to_reach",
  family_friendly: "route.generator.preference.family_friendly",
  solo_friendly: "route.generator.preference.solo_friendly",
  scenic_views: "route.generator.preference.scenic_views",
  quiet_places: "route.generator.preference.quiet_places",
  cultural_spots: "route.generator.preference.cultural_spots",
};

type ReasonContext = {
  item: RouteStop;
  preferences: RecommendationPreferenceId[];
  t: TranslateFn;
};

function pickMatchingPreference(preferences: RecommendationPreferenceId[]) {
  if (preferences.includes("cultural_spots")) {
    return "cultural_spots";
  }

  return preferences[0] ?? null;
}

export function getRecommendationPreferenceLabel(preference: RecommendationPreferenceId, t: TranslateFn) {
  return t(preferenceKeyMap[preference]);
}

export function buildRecommendationReason({ item, preferences, t }: ReasonContext) {
  const matchingPreference = pickMatchingPreference(preferences);

  if (matchingPreference) {
    return t("route.result.reason.preference", {
      preference: getRecommendationPreferenceLabel(matchingPreference, t).toLowerCase(),
    });
  }

  return t("route.result.reason.city", { city: item.city });
}
