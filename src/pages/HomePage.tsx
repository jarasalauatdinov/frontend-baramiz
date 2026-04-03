import { motion } from "framer-motion";
import { ArrowRight, MapPin, Route as RouteIcon, ShieldCheck, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { useI18n } from "@/shared/i18n/provider";
import { PlaceCard } from "@/entities/place/ui/PlaceCard";
import type { PublicCitySummary, PublicPlace } from "@/shared/types/api";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useHomePageQueries } from "@/hooks/usePublicData";
import { ensureArray } from "@/shared/api/normalize";

export function HomePage() {
  const { t } = useI18n();
  const { placesQuery, citiesQuery } = useHomePageQueries();

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);

  const isLoading = placesQuery.isPending && featuredPlaces.length === 0;
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
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";

  return (
    <>
      <AppHeader
        title={t("home.header.title")}
        subtitle={t("home.header.subtitle")}
        showLanguageSwitcher
      />
      <div className="screen home-screen" style={{ padding: 0 }}>
        <div style={{ padding: "20px 20px 0" }}>
          <motion.div
            className="screen-greeting"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span>{t("home.greeting.label")}</span>
            {t("home.greeting.title")}
          </motion.div>
        </div>

        <div style={{ padding: "0 20px" }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <Link
              to="/route-generator"
              className="hero-card"
              style={{
                backgroundImage: `url(${heroImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="hero-card__overlay" />
              <div className="hero-card__content">
                <div className="hero-card__eyebrow">{t("home.hero.eyebrow")}</div>
                <div className="hero-card__title">{t("home.hero.title")}</div>
                <div className="hero-card__text">{t("home.hero.copy")}</div>
                <span className="button accent" style={{ minHeight: 40, fontSize: "0.82rem", padding: "0 16px", marginTop: 12 }}>
                  <RouteIcon size={16} />
                  {t("home.hero.cta")}
                </span>
              </div>
            </Link>
          </motion.div>
        </div>

        {cities.length > 0 ? (
          <div style={{ padding: "20px 20px 0" }}>
            <div className="section-label" style={{ marginBottom: 12 }}>
              <MapPin size={12} style={{ display: "inline", verticalAlign: "middle" }} /> {t("home.cityHighlights")}
            </div>
            <div className="city-grid">
              {cities.slice(0, 6).map((city) => (
                <motion.div
                  key={city.city}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="city-card">
                    <div className="city-card__media">
                      {city.featured_image ? <img src={city.featured_image} alt={city.city} /> : null}
                    </div>
                    <div className="city-card__body">
                      <h3>{city.city}</h3>
                      <p>{t("home.cityCount", { count: city.count })}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : null}

        <div style={{ padding: "20px 20px 0" }}>
          <div className="section-label" style={{ marginBottom: 12 }}>
            <Star size={12} style={{ display: "inline", verticalAlign: "middle" }} /> {t("home.featuredPlaces")}
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
            <EmptyState title={t("home.empty.title")} copy={t("home.empty.copy")} />
          )}
        </div>

        <div style={{ padding: "16px 20px 0" }}>
          <div className="panel home-highlight-card">
            <div className="home-highlight-card__icon">
              <ShieldCheck size={22} />
            </div>
            <div>
              <strong>{t("home.highlight.title")}</strong>
              <p>{t("home.highlight.copy")}</p>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px 20px 20px" }}>
          <div className="section-label">{t("home.quickActions")}</div>
          <div className="button-row">
            <Link to="/route-generator" className="button accent button--full">
              <RouteIcon size={18} />
              {t("home.quick.route")}
            </Link>
            <Link to="/service" className="button secondary button--full">
              {t("home.quick.service")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
