import { startTransition, useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
import { getDefaultRouteInput } from "@/api/baramiz";
import { AiConciergePanel } from "@/components/route/AiConciergePanel";
import { Button } from "@/components/shared/Button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { writeStoredRouteResult } from "@/features/route/route-storage";
import { useCategoriesQuery, useCitiesQuery } from "@/hooks/usePublicData";
import { useGenerateRouteMutation } from "@/hooks/useRouteGeneration";
import type { CategoryId, PublicCategory, PublicCitySummary, RouteDuration } from "@/types/api";

const durationOptions: Array<{ value: RouteDuration; label: string; copy: string }> = [
  { value: "3_hours", label: "3 hours", copy: "A compact route for short visits or jury demos." },
  { value: "half_day", label: "Half day", copy: "Balanced between focus and variety." },
  { value: "1_day", label: "1 day", copy: "A fuller route with more movement and stop variety." },
];

export function RouteGeneratorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoriesQuery = useCategoriesQuery();
  const citiesQuery = useCitiesQuery();
  const generateRouteMutation = useGenerateRouteMutation();
  const [form, setForm] = useState(getDefaultRouteInput(searchParams.get("city") ?? ""));
  const [localError, setLocalError] = useState<string | null>(null);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data).filter((category) => category.type === "interest");
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
      <div className="page">
        <LoadingState title="Preparing the generator" copy="Loading route categories and configuration." />
      </div>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <div className="page">
        <ErrorState title="Route builder is unavailable" copy="The route categories could not be loaded." />
      </div>
    );
  }

  const toggleInterest = (interest: CategoryId) => {
    setForm((current) => {
      const exists = current.interests.includes(interest);
      const nextInterests = exists
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest];

      return {
        ...current,
        interests: nextInterests,
      };
    });
  };

  const submit = async () => {
    if (!form.city.trim()) {
      setLocalError("Choose a city before generating a route.");
      return;
    }

    if (!form.interests.length) {
      setLocalError("Choose at least one interest for the route.");
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
    <div className="page">
      <section className="page-hero panel">
        <SectionHeading
          eyebrow="AI Route Generator"
          title="A premium planning flow with a simple, credible backend contract."
          copy="The frontend only collects intent and presentation state; route intelligence comes from the backend."
        />
      </section>

      <section className="section split-layout">
        <div className="panel generator-panel">
          <div className="generator-panel__header">
            <div>
              <span className="eyebrow">Step-by-step</span>
              <h2>Build your route</h2>
            </div>
            <span className="pill">
              <Sparkles size={16} />
              Backend-generated results
            </span>
          </div>

          <div className="form-grid">
            {cities.length ? (
              <label className="input-label">
                City
                <select
                  className="select-input"
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                >
                  <option value="">Choose a city</option>
                  {cities.map((city) => (
                    <option key={city.city} value={city.city}>
                      {city.city}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <label className="input-label">
                City
                <input
                  className="text-input"
                  value={form.city}
                  onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))}
                  placeholder="Enter a city like Nukus or Moynaq"
                />
              </label>
            )}

            <div className="input-label">
              Interests
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
                        {isSelected ? <Check size={16} /> : null}
                        {category.name}
                      </button>
                    );
                  })}
              </div>
            </div>

            <div className="input-label">
              Route duration
              <div className="duration-grid">
                {durationOptions.map((option) => {
                  const isSelected = form.duration === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`duration-option panel ${isSelected ? "is-selected" : ""}`}
                      onClick={() => setForm((current) => ({ ...current, duration: option.value }))}
                    >
                      <strong>{option.label}</strong>
                      <span>{option.copy}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {localError ? <div className="field-error">{localError}</div> : null}
            {generateRouteMutation.error ? (
              <div className="field-error">{generateRouteMutation.error.message}</div>
            ) : null}

            <div className="button-row">
              <Button variant="accent" type="button" disabled={generateRouteMutation.isPending} onClick={() => void submit()}>
                {generateRouteMutation.isPending ? "Generating..." : "Generate route"}
              </Button>
              <Link className="button secondary" to="/places">
                Browse places first
              </Link>
            </div>
          </div>
        </div>

        <div className="generator-side">
          <section className="panel generator-side__summary">
            <span className="eyebrow">Current selections</span>
            <h3>{form.city || "Choose a city to begin"}</h3>
            <div className="meta-row">
              {form.interests.map((interest) => (
                <span className="tag" key={interest}>
                  {interest.replace(/_/g, " ")}
                </span>
              ))}
              <span className="tag">{form.duration.replace(/_/g, " ")}</span>
            </div>
            <p>
              The resulting screen will show ordered stops, timings, visit durations, and clear next
              actions to regenerate or explore destination details.
            </p>
          </section>
          <AiConciergePanel />
        </div>
      </section>
    </div>
  );
}
