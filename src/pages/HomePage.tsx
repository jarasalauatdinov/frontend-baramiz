import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Route as RouteIcon,
  Search,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PlaceCard } from "@/components/places/PlaceCard";
import type { PublicCategory, PublicCitySummary, PublicPlace } from "@/types/api";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useHomePageQueries } from "@/hooks/usePublicData";
import { ensureArray } from "@/api/normalize";

export function HomePage() {
  const { placesQuery, citiesQuery, categoriesQuery } = useHomePageQueries();

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data);

  const isLoading =
    (placesQuery.isPending && featuredPlaces.length === 0) ||
    (categoriesQuery.isPending && categories.length === 0);
  const isError = placesQuery.isError && featuredPlaces.length === 0;

  if (isLoading) {
    return (
      <div className="screen screen--center">
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="screen screen--center">
        <ErrorState />
      </div>
    );
  }

  const heroImage =
    featuredPlaces[0]?.imageUrl ||
    cities[0]?.featured_image ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="screen" style={{ padding: 0 }}>
      {/* Greeting */}
      <div style={{ padding: "20px 20px 0" }}>
        <motion.div
          className="screen-greeting"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span>Welcome to Baramiz</span>
          Hello, Traveler 👋
        </motion.div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "16px 20px" }}>
        <Link to="/places" className="search-bar">
          <Search size={18} />
          <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Search destinations...
          </span>
        </Link>
      </div>

      {/* Hero Card */}
      <div style={{ padding: "0 20px" }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <Link to="/route-generator" className="hero-card" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="hero-card__overlay" />
            <div className="hero-card__content">
              <div className="hero-card__eyebrow">AI-Powered Routes</div>
              <div className="hero-card__title">Build your perfect route</div>
              <div className="hero-card__text">
                Choose a city, pick interests, and let AI generate the ideal travel plan.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 12 }}>
                <span className="button accent" style={{ minHeight: 40, fontSize: "0.82rem", padding: "0 16px" }}>
                  <RouteIcon size={16} />
                  Start Planning
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Categories — horizontal scroll */}
      {categories.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div className="section-label">Categories</div>
          <div className="category-scroll">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category.id}
                to={`/places?category=${category.id}`}
                className="chip"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Cities — horizontal scroll */}
      {cities.length > 0 && (
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div className="section-label" style={{ margin: 0 }}>Explore Cities</div>
            <Link to="/places" style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600 }}>
              See All
            </Link>
          </div>
          <div className="city-grid">
            {cities.slice(0, 6).map((city) => (
              <motion.div
                key={city.city}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/places?city=${encodeURIComponent(city.city)}`} className="city-card">
                  <div className="city-card__media">
                    {city.featured_image ? (
                      <img src={city.featured_image} alt={city.city} />
                    ) : null}
                  </div>
                  <div className="city-card__body">
                    <h3>{city.city}</h3>
                    <p>
                      <MapPin size={12} style={{ display: "inline", verticalAlign: "middle" }} />{" "}
                      {city.count} places
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Places */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div className="section-label" style={{ margin: 0 }}>
            <Star size={12} style={{ display: "inline", verticalAlign: "middle" }} /> Featured
          </div>
          <Link to="/places" style={{ fontSize: "0.78rem", color: "var(--accent)", fontWeight: 600 }}>
            See All
          </Link>
        </div>
        {featuredPlaces.length ? (
          <div className="stack-list">
            {featuredPlaces.slice(0, 4).map((place) => (
              <motion.div
                key={place.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
              >
                <PlaceCard place={place} />
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No featured places"
            copy="Featured destinations will appear here."
          />
        )}
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "24px 20px 20px" }}>
        <div className="section-label">Quick Actions</div>
        <div className="stack-list">
          <Link to="/route-generator" className="button accent button--full">
            <Sparkles size={18} />
            Generate AI Route
            <ArrowRight size={16} />
          </Link>
          <Link to="/services" className="button secondary button--full">
            Browse Hotels & Services
          </Link>
        </div>
      </div>
    </div>
  );
}
