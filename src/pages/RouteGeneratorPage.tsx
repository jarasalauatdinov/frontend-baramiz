import { startTransition, useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  Camera,
  Check,
  Compass,
  Gem,
  MapPinned,
  Sparkles,
  Trees,
  Users,
  UserRound,
} from "lucide-react";
import {
  Badge,
  Box,
  Paper,
  Skeleton,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Link, useSearchParams } from "react-router-dom";
import { RouteStopCard } from "@/entities/route/ui/RouteStopCard";
import {
  buildRecommendationReason,
  getRecommendationPreferenceLabel,
  recommendationPreferenceIds,
  type RecommendationPreferenceId,
} from "@/features/route/recommendation-preferences";
import {
  readStoredRouteResult,
  writeStoredRouteResult,
  type StoredRouteResult,
} from "@/features/route/route-storage";
import { ensureArray } from "@/shared/api/normalize";
import { getDefaultRouteInput } from "@/shared/api/baramiz";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { Button } from "@/shared/ui/shared/Button";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { usePlacesQuery } from "@/hooks/usePublicData";
import { useGenerateRouteMutation } from "@/hooks/useRouteGeneration";
import type { GenerateRouteInput, PublicCitySummary } from "@/shared/types/api";

function deriveCitiesFromPlaces(placeCities: Array<{ city: string; region: string; image: string }>) {
  const grouped = new Map<string, PublicCitySummary>();

  placeCities.forEach((place) => {
    const normalizedCity = place.city.trim();
    if (!normalizedCity) {
      return;
    }

    const existing = grouped.get(normalizedCity);

    if (!existing) {
      grouped.set(normalizedCity, {
        city: normalizedCity,
        region: place.region,
        count: 1,
        featured_image: place.image || undefined,
        types: ["place"],
      });
      return;
    }

    existing.count += 1;
    if (!existing.featured_image && place.image) {
      existing.featured_image = place.image;
    }
  });

  return Array.from(grouped.values()).sort((left, right) => left.city.localeCompare(right.city));
}

const preferenceIconMap: Record<RecommendationPreferenceId, typeof Sparkles> = {
  popular_places: Sparkles,
  hidden_gems: Gem,
  easy_to_reach: Compass,
  family_friendly: Users,
  solo_friendly: UserRound,
  scenic_views: Camera,
  quiet_places: Trees,
  cultural_spots: MapPinned,
};

function RouteGeneratorSkeleton() {
  return (
    <div className="screen route-builder-screen">
      <Stack gap="md">
        <Skeleton height={116} radius={28} />
        <Skeleton height={196} radius={28} />
        <Skeleton height={184} radius={28} />
        <Skeleton height={56} radius={18} />
      </Stack>
    </div>
  );
}

interface InlineResultSectionProps {
  result: StoredRouteResult;
}

function InlineResultSection({ result }: InlineResultSectionProps) {
  const { t } = useI18n();
  const [isRevealed, setIsRevealed] = useState(false);
  const selectedPreferenceLabels = result.input.preferences.map((preference) =>
    getRecommendationPreferenceLabel(preference, t),
  );

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setIsRevealed(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [result.createdAt]);

  if (!result.route.stops.length) {
    return (
      <section className={`route-inline-results${isRevealed ? " route-inline-results--revealed" : ""}`}>
        <div className="route-inline-results__head">
          <div>
            <div className="section-label">{t("route.result.header.title")}</div>
            <Title order={2} className="route-inline-results__title">
              {t("route.result.emptyRoute.title")}
            </Title>
          </div>
        </div>
        <Paper className="route-inline-results__empty" radius={24}>
          <Text>{t("route.result.emptyRoute.copy")}</Text>
        </Paper>
      </section>
    );
  }

  return (
    <section className={`route-inline-results${isRevealed ? " route-inline-results--revealed" : ""}`}>
      <div className="route-inline-results__head">
        <div>
          <div className="section-label">{t("route.result.generatedEyebrow")}</div>
          <Title order={2} className="route-inline-results__title">
            {t("route.result.hero.title", { city: result.route.city })}
          </Title>
        </div>
        <Badge color="baramizGold">{t("route.result.stopsCount", { count: result.route.stops.length })}</Badge>
      </div>

      <div className="route-inline-results__meta">
        <span className="tag">{result.route.city}</span>
        {selectedPreferenceLabels.map((label) => (
          <span className="tag" key={label}>
            {label}
          </span>
        ))}
      </div>

      <ol className="route-stop-list route-stop-list--inline" aria-label={t("route.result.section.stops")}>
        {result.route.stops.map((item, index) => (
          <li
            className="route-stop-list__item"
            key={`${item.id}-${item.order}`}
            style={{ "--route-reveal-index": index + 1 } as CSSProperties}
          >
            <RouteStopCard
              item={item}
              index={index}
              reason={buildRecommendationReason({
                item,
                preferences: result.input.preferences,
                t,
              })}
            />
          </li>
        ))}
      </ol>

      {result.route.tips.length ? (
        <div className="route-inline-results__tips">
          {result.route.tips.slice(0, 3).map((tip, index) => (
            <div
              className="route-inline-results__tip"
              key={`${tip}-${index}`}
              style={{ "--route-reveal-index": result.route.stops.length + index + 2 } as CSSProperties}
            >
              <Sparkles size={14} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export function RouteGeneratorPage() {
  const { language, t } = useI18n();
  const [searchParams] = useSearchParams();
  const placesQuery = usePlacesQuery();
  const generateRouteMutation = useGenerateRouteMutation();
  const [form, setForm] = useState(getDefaultRouteInput(searchParams.get("city") ?? "", language));
  const [localError, setLocalError] = useState<string | null>(null);
  const [inlineResult, setInlineResult] = useState<StoredRouteResult | null>(() => readStoredRouteResult());

  const cities = useMemo(
    () =>
      deriveCitiesFromPlaces(
        ensureArray(placesQuery.data).map((place) => ({
          city: place.city,
          region: place.region,
          image: place.image,
        })),
      ),
    [placesQuery.data],
  );

  const hasSelectedCity = form.city.trim().length > 0;
  const hasSelectedPreferences = form.preferences.length > 0;
  const canSubmit = hasSelectedCity && hasSelectedPreferences && !generateRouteMutation.isPending;

  useEffect(() => {
    if (!form.city && cities[0]?.city) {
      startTransition(() => {
        setForm((current) => ({
          ...current,
          city: cities[0]?.city ?? current.city,
        }));
      });
    }
  }, [cities, form.city]);

  useEffect(() => {
    setForm((current) => (current.language === language ? current : { ...current, language }));
  }, [language]);

  const togglePreference = (preference: RecommendationPreferenceId) => {
    setForm((current) => ({
      ...current,
      preferences: current.preferences.includes(preference)
        ? current.preferences.filter((item) => item !== preference)
        : [...current.preferences, preference],
    }));
  };

  const submit = async () => {
    const city = form.city.trim();

    if (!city) {
      setLocalError(t("route.generator.validation.city"));
      return;
    }

    if (!form.preferences.length) {
      setLocalError(t("route.generator.validation.preferences"));
      return;
    }

    const payload: GenerateRouteInput = {
      city,
      preferences: [...new Set(form.preferences)],
      language,
    };

    setLocalError(null);

    try {
      const route = await generateRouteMutation.mutateAsync(payload);
      const result = {
        input: payload,
        route,
        createdAt: new Date().toISOString(),
      } satisfies StoredRouteResult;

      writeStoredRouteResult(result);
      setInlineResult(result);
    } catch {
      return;
    }
  };

  if (placesQuery.isPending && cities.length === 0) {
    return (
      <>
        <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
        <RouteGeneratorSkeleton />
      </>
    );
  }

  if (placesQuery.isError && cities.length === 0) {
    return (
      <>
        <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("route.generator.error.title")} copy={t("route.generator.error.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
      <div className="screen route-builder-screen">
       

        <section className="panel route-builder-step">
          <div className="route-builder-step__head">
            <span className="route-builder-step__index">1</span>
            <div>
              <div className="section-label">{t("route.generator.city.label")}</div>
              <Text className="route-builder-step__hint">{t("route.generator.city.helper")}</Text>
            </div>
          </div>

          {cities.length ? (
            <div className="route-builder-city-grid">
              {cities.map((city) => {
                const isSelected = form.city === city.city;

                return (
                  <button
                    key={city.city}
                    type="button"
                    className={`route-builder-city-card ${isSelected ? "is-selected" : ""}`}
                    onClick={() => setForm((current) => ({ ...current, city: city.city }))}
                  >
                    {city.featured_image ? (
                      <img src={city.featured_image} alt="" loading="lazy" className="route-builder-city-card__image" />
                    ) : (
                      <div className="route-builder-city-card__image route-builder-city-card__image--fallback" />
                    )}
                    <div className="route-builder-city-card__overlay" />
                    <div className="route-builder-city-card__body">
                      <strong>{city.city}</strong>
                      <span>{t("route.result.stopsCount", { count: city.count })}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              className="text-input"
              value={form.city}
              onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
              placeholder={t("route.generator.city.manualPlaceholder")}
            />
          )}
        </section>

        <section className="panel route-builder-step">
          <div className="route-builder-step__head">
            <span className="route-builder-step__index">2</span>
            <div>
              <div className="section-label">{t("route.generator.preferences.label")}</div>
              <Text className="route-builder-step__hint">{t("route.generator.preferences.helper")}</Text>
            </div>
          </div>

          <div className="route-builder-chip-wrap">
            {recommendationPreferenceIds.map((preference) => {
              const isSelected = form.preferences.includes(preference);
              const Icon = preferenceIconMap[preference];

              return (
                <button
                  key={preference}
                  type="button"
                  className={`route-builder-interest-chip ${isSelected ? "is-selected" : ""}`}
                  aria-pressed={isSelected}
                  onClick={() => togglePreference(preference)}
                >
                  <span className="route-builder-interest-chip__icon" aria-hidden="true">
                    {isSelected ? <Check size={14} /> : <Icon size={14} />}
                  </span>
                  <span>{getRecommendationPreferenceLabel(preference, t)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {localError ? <div className="field-error route-builder-error">{localError}</div> : null}
        {generateRouteMutation.error ? (
          <div className="field-error route-builder-error">{generateRouteMutation.error.message}</div>
        ) : null}

        <Button
          variant="accent"
          type="button"
          className="button--full route-builder-submit route-builder-submit--inline"
          style={{ padding: "16px 0", fontSize: "1.05rem", minHeight: 56, borderRadius: 18 }}
          disabled={!canSubmit}
          onClick={() => void submit()}
        >
          <Sparkles size={18} />
          {generateRouteMutation.isPending ? t("route.generator.submit.loading") : t("route.generator.submit.idle")}
        </Button>

        {generateRouteMutation.isPending ? (
          <div className="route-builder-loading-inline">
            <LoadingState title={t("route.generator.loading.title")} copy={t("route.generator.submit.loading")} />
          </div>
        ) : inlineResult ? (
          <InlineResultSection result={inlineResult} />
        ) : (
          <section className="route-builder-anticipation panel">
            <div className="section-label">{t("route.result.header.title")}</div>
            <Title order={3}>{t("route.generator.submit.idle")}</Title>
            <Text>{t("route.result.empty.copy")}</Text>
          </section>
        )}
      </div>
    </>
  );
}
