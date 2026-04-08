import { useDeferredValue, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Compass, Search } from "lucide-react";
import { ensureArray } from "@/shared/api/normalize";
import { PlaceCard } from "@/entities/place/ui/PlaceCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { useCategoriesQuery, useCitiesQuery, usePlacesQuery } from "@/hooks/usePublicData";
import type { CategoryId, PublicCategory, PublicCitySummary, PublicPlace } from "@/shared/types/api";

export function PlacesPage() {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const deferredSearch = useDeferredValue(search);

  const categoriesQuery = useCategoriesQuery();
  const citiesQuery = useCitiesQuery();
  const placesQuery = usePlacesQuery({
    city: city || undefined,
    category: (category as CategoryId) || undefined,
    featured: featuredOnly || undefined,
  });
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data);

  if (placesQuery.isPending && !placesQuery.data) {
    return (
      <>
        <AppHeader title={t("places.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("places.loading.title")} copy={t("places.loading.copy")} />
        </div>
      </>
    );
  }

  if (placesQuery.isError && !placesQuery.data) {
    return (
      <>
        <AppHeader title={t("places.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("places.error.title")} copy={t("places.error.copy")} />
        </div>
      </>
    );
  }

  const places = ensureArray<PublicPlace>(placesQuery.data).filter((place) => {
    const value = deferredSearch.trim().toLowerCase();
    if (!value) {
      return true;
    }

    return [place.name, place.city, place.region, place.description].some((field) =>
      field.toLowerCase().includes(value),
    );
  });
  const hasActiveFilters = Boolean(deferredSearch.trim() || city || category || featuredOnly);

  return (
    <>
      <AppHeader
        title={t("places.header.title")}
        subtitle={t("places.header.subtitle", { count: places.length })}
        showLanguageSwitcher
      />
      <div className="screen" style={{ paddingTop: 0 }}>
        <div className="filters-bar" style={{ marginBottom: 16 }}>
          <div className="search-bar">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("places.search.placeholder")}
            />
          </div>

          {categories.length > 0 ? (
            <div className="category-scroll">
              <button
                type="button"
                className={`chip ${!category ? "is-active" : ""}`}
                onClick={() => setCategory("")}
              >
                {t("places.filters.all")}
              </button>
              {categories
                .filter((item) => item.type === "interest")
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`chip ${category === item.id ? "is-active" : ""}`}
                    onClick={() => setCategory(item.id)}
                  >
                    {getInterestLabel(item.id as CategoryId, t)}
                  </button>
                ))}
            </div>
          ) : null}

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 120 }}>
              <select
                className="select-input"
                value={city}
                onChange={(event) => setCity(event.target.value)}
                style={{ minHeight: 44, fontSize: "0.85rem", borderRadius: 12 }}
              >
                <option value="">{t("places.filters.allCities")}</option>
                {cities.map((item) => (
                  <option key={item.city} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
              />
              {t("places.filters.featured")}
            </label>
          </div>
        </div>

        {places.length ? (
          <div className="stack-list">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <EmptyState
            align="start"
            icon={<Compass size={20} />}
            title={hasActiveFilters ? t("places.empty.filtered.title") : t("places.empty.title")}
            copy={hasActiveFilters ? t("places.empty.filtered.copy") : t("places.empty.copy")}
            action={
              hasActiveFilters ? (
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => {
                    setSearch("");
                    setCity("");
                    setCategory("");
                    setFeaturedOnly(false);
                  }}
                >
                  {t("common.actions.clearFilters")}
                </button>
              ) : (
                <Link className="button accent" to="/route">
                  {t("common.actions.buildRoute")}
                </Link>
              )
            }
          />
        )}
      </div>
    </>
  );
}
