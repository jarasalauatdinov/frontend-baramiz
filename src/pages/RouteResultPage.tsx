import { Compass, Map, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { RouteStopCard } from "@/entities/route/ui/RouteStopCard";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { usePlacesQuery } from "@/hooks/usePublicData";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { formatDurationMinutes } from "@/shared/lib/utils";
import type { PublicPlace } from "@/shared/types/api";
import { ensureArray } from "@/shared/api/normalize";

export function RouteResultPage() {
  const { t } = useI18n();
  const storedResult = readStoredRouteResult();
  const relatedPlacesQuery = usePlacesQuery({
    city: storedResult?.route.city,
  });

  if (!storedResult) {
    return (
      <>
        <AppHeader title={t("route.result.header.empty")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("route.result.empty.title")}
            copy={t("route.result.empty.copy")}
            action={
              <Link className="button accent" to="/route-generator">
                {t("route.result.empty.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const { route } = storedResult;
  const routeStops = route.stops;
  const relatedPlaces = ensureArray<PublicPlace>(relatedPlacesQuery.data);

  if (routeStops.length === 0) {
    return (
      <>
        <AppHeader title={t("route.result.header.empty")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("route.result.emptyRoute.title")}
            copy={t("route.result.emptyRoute.copy")}
            action={
              <Link className="button accent" to="/route-generator">
                {t("route.result.emptyRoute.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const relatedSuggestions = relatedPlaces
    .filter((place) => !routeStops.some((stop) => stop.id === place.id))
    .slice(0, 4);
  const heroImage = routeStops[0]?.image;
  const durationLabel = formatDurationMinutes(route.totalDurationMinutes, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });

  return (
    <>
      <AppHeader title={t("route.result.header.title")} back showLanguageSwitcher />
      <div className="screen route-result-screen" style={{ paddingTop: 0 }}>
        <div
          className={`route-result-hero ${heroImage ? "route-result-hero--visual" : ""}`}
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
        >
          <div className="route-result-hero__overlay" />
          <div className="route-result-hero__body">
            <span className="eyebrow">{t("route.result.generatedEyebrow")}</span>
            <h1 className="display">{route.title}</h1>
            <p>{route.summary || route.city}</p>
            <div className="meta-row">
              <span className="tag">{route.city}</span>
              <span className="tag">{durationLabel}</span>
              <span className="tag">{t("route.result.stopsCount", { count: routeStops.length })}</span>
            </div>
          </div>
        </div>

        <div className="section-label route-result-section-label">
          <Map size={12} style={{ display: "inline", verticalAlign: "middle" }} /> {t("route.result.section.stops")}
        </div>
        <div className="route-stop-list">
          {routeStops.map((item, index) => (
            <RouteStopCard key={`${item.id}-${item.order}`} item={item} index={index} />
          ))}
        </div>

        {relatedPlacesQuery.isPending && relatedPlaces.length === 0 ? (
          <LoadingState />
        ) : null}

        {relatedPlacesQuery.isError ? (
          <ErrorState />
        ) : null}

        {relatedSuggestions.length > 0 ? (
          <div>
            <div className="section-label route-result-section-label">
              {t("route.result.section.nearby")}
            </div>
            <div className="related-link-list">
              {relatedSuggestions.map((place) => (
                <Link key={place.id} className="related-link" to={`/places/${place.id}`}>
                  <img src={place.image} alt={place.name} loading="lazy" />
                  <span>
                    <strong>{place.name}</strong>
                    <small>{place.shortDescription || place.description}</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="button-row">
          <Link className="button accent button--full" to="/route-generator">
            <RefreshCw size={16} />
            {t("route.result.actions.regenerate")}
          </Link>
          <Link className="button secondary button--full" to="/places">
            <Compass size={16} />
            {t("route.result.actions.browse")}
          </Link>
        </div>
      </div>
    </>
  );
}
