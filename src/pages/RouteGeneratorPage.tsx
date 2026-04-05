import { startTransition, useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/shared/api/normalize";
import { getDefaultRouteInput } from "@/shared/api/baramiz";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { Button } from "@/shared/ui/shared/Button";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { writeStoredRouteResult } from "@/features/route/route-storage";
import { useCategoriesQuery, usePlacesQuery } from "@/hooks/usePublicData";
import { useGenerateRouteMutation } from "@/hooks/useRouteGeneration";
import type { CategoryId, GenerateRouteInput, PublicCategory, PublicCitySummary } from "@/shared/types/api";

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

export function RouteGeneratorPage() {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriesQuery = useCategoriesQuery();
  const placesQuery = usePlacesQuery();
  const generateRouteMutation = useGenerateRouteMutation();
  const [form, setForm] = useState(getDefaultRouteInput(searchParams.get("city") ?? "", language));
  const [localError, setLocalError] = useState<string | null>(null);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data).filter(
    (category) => category.type === "interest",
  );
  const cities = deriveCitiesFromPlaces(
    ensureArray(placesQuery.data).map((place) => ({
      city: place.city,
      region: place.region,
      image: place.image,
    })),
  );
  const canSubmit = form.city.trim().length > 0 && form.interests.length > 0 && !generateRouteMutation.isPending;

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

  if (categoriesQuery.isPending && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("route.generator.loading.title")} copy={t("route.generator.loading.copy")} />
        </div>
      </>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("route.generator.error.title")} copy={t("route.generator.error.copy")} />
        </div>
      </>
    );
  }

  if (!categories.length) {
    return (
      <>
        <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState title={t("route.generator.error.title")} copy={t("route.generator.error.copy")} />
        </div>
      </>
    );
  }

  const toggleInterest = (interest: CategoryId) => {
    setForm((current) => {
      const exists = current.interests.includes(interest);
      const nextInterests = exists
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];
      return { ...current, interests: nextInterests };
    });
  };

  const submit = async () => {
    const city = form.city.trim();
    if (!city) {
      setLocalError(t("route.generator.validation.city"));
      return;
    }
    if (!form.interests.length) {
      setLocalError(t("route.generator.validation.interests"));
      return;
    }

    const payload: GenerateRouteInput = {
      city,
      interests: [...new Set(form.interests)],
      language,
    };

    setLocalError(null);

    try {
      const route = await generateRouteMutation.mutateAsync(payload);
      writeStoredRouteResult({
        input: payload,
        route,
        createdAt: new Date().toISOString(),
      });
      navigate("/route-result");
    } catch {
      return;
    }
  };

  return (
    <>
      <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
      <div className="screen route-builder-screen" style={{ paddingTop: 0 }}>
        <section className="panel route-builder-panel route-builder-panel--hero">
          <span className="eyebrow">{t("home.hero.eyebrow")}</span>
          <h1 className="route-builder-panel__title">{t("home.hero.title")}</h1>
        </section>

        <section className="panel route-builder-panel">
          <div className="section-label">{t("route.generator.city.label")}</div>
          {cities.length ? (
            <select
              className="select-input"
              value={form.city}
              onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
            >
              <option value="">{t("route.generator.city.placeholder")}</option>
              {cities.map((city) => (
                <option key={city.city} value={city.city}>
                  {city.city}
                </option>
              ))}
            </select>
          ) : (
            <input
              className="text-input"
              value={form.city}
              onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
              placeholder={t("route.generator.city.manualPlaceholder")}
            />
          )}
        </section>

        <section className="panel route-builder-panel">
          <div className="section-label">{t("route.generator.interests.label")}</div>
          <div className="choice-grid">
            {categories.map((category) => {
              const isSelected = form.interests.includes(category.id as CategoryId);
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`choice-chip ${isSelected ? "is-selected" : ""}`}
                  onClick={() => toggleInterest(category.id as CategoryId)}
                >
                  {isSelected ? <Check size={14} /> : null}
                  {getInterestLabel(category.id as CategoryId, t)}
                </button>
              );
            })}
          </div>
        </section>

        {(form.city || form.interests.length > 0) && (
          <section className="route-builder-summary panel">
            <div className="route-builder-summary__label">{t("route.generator.summary.label")}</div>
            <div className="route-builder-summary__city">{form.city || t("route.generator.summary.emptyCity")}</div>
            {form.interests.length ? (
              <div className="meta-row">
                {form.interests.map((interest) => (
                  <span className="tag" key={interest}>
                    {getInterestLabel(interest, t)}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {localError ? <div className="field-error route-builder-error">{localError}</div> : null}
        {generateRouteMutation.error ? (
          <div className="field-error route-builder-error">{generateRouteMutation.error.message}</div>
        ) : null}

        <section className="route-builder-cta panel">
          <Button
            variant="accent"
            type="button"
            className="button--full"
            style={{ padding: "16px 0", fontSize: "1.05rem", minHeight: 56, borderRadius: 16 }}
            disabled={!canSubmit}
            onClick={() => void submit()}
          >
            <Sparkles size={18} />
            {generateRouteMutation.isPending ? t("route.generator.submit.loading") : t("route.generator.submit.idle")}
          </Button>
        </section>
      </div>
    </>
  );
}
