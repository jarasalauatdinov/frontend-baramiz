import { useDeferredValue, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
import { PlaceCard } from "@/components/places/PlaceCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
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
      <div className="page">
        <LoadingState title="Loading places" copy="Fetching public destinations from the backend." />
      </div>
    );
  }

  if (placesQuery.isError) {
    return (
      <div className="page">
        <ErrorState />
      </div>
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

  return (
    <div className="page">
      <section className="page-hero panel">
        <SectionHeading
          eyebrow="Destination Catalog"
          title="Browse places with clean filters and mobile-friendly cards."
          copy="Use city and category filters from the backend, then refine with a lightweight local search for fast scanning."
        />
      </section>

      <section className="section">
        <div className="filters-bar panel">
          <div className="filters-bar__search">
            <Search size={16} />
            <input
              className="text-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by destination, city, or description"
            />
          </div>
          <div className="filters-bar__controls">
            <label className="input-label">
              <span className="inline-label">
                <Filter size={14} />
                City
              </span>
              <select className="select-input" value={city} onChange={(event) => setCity(event.target.value)}>
                <option value="">All cities</option>
                {cities.map((item) => (
                  <option key={item.city} value={item.city}>
                    {item.city}
                  </option>
                ))}
              </select>
            </label>
            <label className="input-label">
              Category
              <select className="select-input" value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">All categories</option>
                {categories
                  .filter((item) => item.type === "interest")
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </label>
            <label className="check-row">
              <input
                type="checkbox"
                checked={featuredOnly}
                onChange={(event) => setFeaturedOnly(event.target.checked)}
              />
              Featured only
            </label>
          </div>
        </div>
      </section>

      <section className="section">
        {places.length ? (
          <div className="grid-auto">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No places match the current filters"
            copy="Try a different city or category, or clear the featured filter to widen the search."
            action={
              <Link className="button secondary" to="/route-generator">
                Generate a route instead
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
