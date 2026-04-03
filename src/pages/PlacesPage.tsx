import { useDeferredValue, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
import { PlaceCard } from "@/components/places/PlaceCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useCategoriesQuery, useCitiesQuery, usePlacesQuery } from "@/hooks/usePublicData";
import type { CategoryId, PublicCategory, PublicCitySummary, PublicPlace } from "@/types/api";

export function PlacesPage() {
  const [searchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [search, setSearch] = useState("");
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
      <div className="screen screen--center">
        <LoadingState title="Loading places" copy="Fetching destinations..." />
      </div>
    );
  }

  if (placesQuery.isError) {
    return (
      <div className="screen screen--center">
        <ErrorState />
      </div>
    );
  }

  const places = ensureArray<PublicPlace>(placesQuery.data).filter((place) => {
    const value = deferredSearch.trim().toLowerCase();
    if (!value) return true;
    return [place.name, place.city, place.region, place.description].some((field) =>
      field.toLowerCase().includes(value),
    );
  });

  return (
    <>
      <AppHeader title="Explore" subtitle={`${places.length} destinations`} />
      <div className="screen" style={{ paddingTop: 0 }}>
        {/* Search */}
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <Search size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destinations..."
          />
        </div>

        {/* Category chips — horizontal scroll */}
        {categories.length > 0 && (
          <div className="category-scroll" style={{ marginBottom: 16 }}>
            <button
              type="button"
              className={`chip ${!category ? "is-active" : ""}`}
              onClick={() => setCategory("")}
            >
              All
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
                  {item.name}
                </button>
              ))}
          </div>
        )}

        {/* Filter row */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120 }}>
            <select
              className="select-input"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ minHeight: 42, fontSize: "0.85rem", borderRadius: 12 }}
            >
              <option value="">All cities</option>
              {cities.map((item) => (
                <option key={item.city} value={item.city}>{item.city}</option>
              ))}
            </select>
          </div>
          <label className="check-row">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
            />
            Featured
          </label>
        </div>

        {/* Places list */}
        {places.length ? (
          <div className="stack-list">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No places found"
            copy="Try adjusting your filters."
            action={
              <Link className="button accent" to="/route-generator">
                Generate a route
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
