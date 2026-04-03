import { startTransition, useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/shared/api/normalize";
import { getDefaultRouteInput } from "@/shared/api/baramiz";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { Button } from "@/shared/ui/shared/Button";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { writeStoredRouteResult } from "@/features/route/route-storage";
import { useCategoriesQuery, useCitiesQuery } from "@/hooks/usePublicData";
import { useGenerateRouteMutation } from "@/hooks/useRouteGeneration";
import type { CategoryId, PublicCategory, PublicCitySummary, RouteDuration } from "@/shared/types/api";



export function RouteGeneratorPage() {
  const { language, t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriesQuery = useCategoriesQuery();
  const citiesQuery = useCitiesQuery();
  const generateRouteMutation = useGenerateRouteMutation();
  const [form, setForm] = useState(getDefaultRouteInput(searchParams.get("city") ?? "", language));
  const [localError, setLocalError] = useState<string | null>(null);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data).filter(
    (category) => category.type === "interest",
  );
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);

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
      <div className="screen screen--center">
        <LoadingState title={t("route.generator.loading.title")} copy={t("route.generator.loading.copy")} />
      </div>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <div className="screen screen--center">
        <ErrorState title={t("route.generator.error.title")} copy={t("route.generator.error.copy")} />
      </div>
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
    if (!form.city.trim()) {
      setLocalError(t("route.generator.validation.city"));
      return;
    }
    if (!form.interests.length) {
      setLocalError(t("route.generator.validation.interests"));
      return;
    }
    setLocalError(null);
    const apiPayload = { ...form, duration: "half_day" as const };
    const route = await generateRouteMutation.mutateAsync(apiPayload);
    writeStoredRouteResult({
      input: apiPayload,
      route,
      createdAt: new Date().toISOString(),
    });
    navigate("/route-result");
  };

  return (
    <>
      <AppHeader title={t("route.generator.header.title")} showLanguageSwitcher />
      <div className="screen" style={{ paddingTop: 0 }}>
        {/* City selector */}
        <div style={{ marginBottom: 20 }}>
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
        </div>

        {/* Interest chips */}
        <div style={{ marginBottom: 20 }}>
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
        </div>



        {/* Current selection summary */}
        {(form.city || form.interests.length > 0) && (
          <div
            style={{
              padding: 16,
              background: "var(--accent-soft)",
              borderRadius: 16,
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent-strong)", marginBottom: 8 }}>
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle" }} /> {t("route.generator.summary.label")}
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700 }}>
              {form.city || t("route.generator.summary.emptyCity")}
            </div>
            {form.interests.length > 0 && (
              <div className="meta-row" style={{ marginTop: 8 }}>
                {form.interests.map((interest) => (
                  <span className="tag" key={interest}>
                    {getInterestLabel(interest, t)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Errors */}
        {localError ? <div className="field-error" style={{ marginBottom: 12 }}>{localError}</div> : null}
        {generateRouteMutation.error ? (
          <div className="field-error" style={{ marginBottom: 12 }}>{generateRouteMutation.error.message}</div>
        ) : null}

        {/* CTA */}
        <div className="button-row" style={{ marginTop: 32 }}>
          <Button
            variant="accent"
            type="button"
            className="button--full"
            style={{ padding: '16px 0', fontSize: '1.05rem', minHeight: 56, borderRadius: 16 }}
            disabled={generateRouteMutation.isPending}
            onClick={() => void submit()}
          >
            <Sparkles size={18} />
            {generateRouteMutation.isPending ? t("route.generator.submit.loading") : t("route.generator.submit.idle")}
          </Button>
        </div>
      </div>
    </>
  );
}
