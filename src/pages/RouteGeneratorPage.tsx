import { startTransition, useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
import { getDefaultRouteInput } from "@/api/baramiz";
import { AppHeader } from "@/components/layout/AppHeader";
import { Button } from "@/components/shared/Button";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { writeStoredRouteResult } from "@/features/route/route-storage";
import { useCategoriesQuery, useCitiesQuery } from "@/hooks/usePublicData";
import { useGenerateRouteMutation } from "@/hooks/useRouteGeneration";
import type { CategoryId, PublicCategory, PublicCitySummary, RouteDuration } from "@/types/api";

const durationOptions: Array<{ value: RouteDuration; label: string; copy: string }> = [
  { value: "3_hours", label: "3 hours", copy: "Quick city tour" },
  { value: "half_day", label: "Half day", copy: "Balanced exploration" },
  { value: "1_day", label: "Full day", copy: "Complete experience" },
];

export function RouteGeneratorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriesQuery = useCategoriesQuery();
  const citiesQuery = useCitiesQuery();
  const generateRouteMutation = useGenerateRouteMutation();
  const [form, setForm] = useState(getDefaultRouteInput(searchParams.get("city") ?? ""));
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

  if (categoriesQuery.isPending && categories.length === 0) {
    return (
      <div className="screen screen--center">
        <LoadingState title="Preparing" copy="Loading route options..." />
      </div>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <div className="screen screen--center">
        <ErrorState title="Unavailable" copy="Route categories could not be loaded." />
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
      setLocalError("Choose a city first.");
      return;
    }
    if (!form.interests.length) {
      setLocalError("Pick at least one interest.");
      return;
    }
    setLocalError(null);
    const route = await generateRouteMutation.mutateAsync(form);
    writeStoredRouteResult({
      input: form,
      route,
      createdAt: new Date().toISOString(),
    });
    navigate("/route-result");
  };

  return (
    <>
      <AppHeader title="Route Builder" />
      <div className="screen" style={{ paddingTop: 0 }}>
        {/* City selector */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Select City</div>
          {cities.length ? (
            <select
              className="select-input"
              value={form.city}
              onChange={(e) => setForm((c) => ({ ...c, city: e.target.value }))}
            >
              <option value="">Choose a city</option>
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
              placeholder="Enter city name (e.g. Nukus)"
            />
          )}
        </div>

        {/* Interest chips */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Your Interests</div>
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
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label">Route Duration</div>
          <div className="duration-grid">
            {durationOptions.map((option) => {
              const isSelected = form.duration === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`duration-option ${isSelected ? "is-selected" : ""}`}
                  onClick={() => setForm((c) => ({ ...c, duration: option.value }))}
                >
                  <strong>{option.label}</strong>
                  <span>{option.copy}</span>
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
              <Sparkles size={14} style={{ display: "inline", verticalAlign: "middle" }} /> Your Route
            </div>
            <div style={{ fontSize: "0.92rem", fontWeight: 700 }}>
              {form.city || "No city selected"}
            </div>
            {form.interests.length > 0 && (
              <div className="meta-row" style={{ marginTop: 8 }}>
                {form.interests.map((interest) => (
                  <span className="tag" key={interest}>
                    {interest.replace(/_/g, " ")}
                  </span>
                ))}
                <span className="tag">{form.duration.replace(/_/g, " ")}</span>
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
        <div className="button-row">
          <Button
            variant="accent"
            type="button"
            className="button--full"
            disabled={generateRouteMutation.isPending}
            onClick={() => void submit()}
          >
            <Sparkles size={18} />
            {generateRouteMutation.isPending ? "Generating..." : "Generate Route"}
          </Button>
        </div>
      </div>
    </>
  );
}
