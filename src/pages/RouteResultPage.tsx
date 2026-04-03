import { Compass, Map, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { ensureArray } from "@/shared/api/normalize";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { RouteStopCard } from "@/entities/route/ui/RouteStopCard";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { usePlacesQuery } from "@/hooks/usePublicData";
import { readStoredRouteResult } from "@/features/route/route-storage";

import type { PublicPlace, RouteItem } from "@/shared/types/api";

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
  const routeItems = ensureArray<RouteItem>(route.items);
  const relatedPlaces = ensureArray<PublicPlace>(relatedPlacesQuery.data);

  if (routeItems.length === 0) {
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

  return (
    <>
      <AppHeader title={t("route.result.header.title")} back showLanguageSwitcher />
      <div className="screen" style={{ paddingTop: 0 }}>
        {/* Map preview placeholder */}
        <div
          style={{
            height: 160,
            borderRadius: 20,
            background: "linear-gradient(135deg, #1a2332 0%, #2d4a3e 50%, #3d5a4e 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.7)",
            fontSize: "0.82rem",
            fontWeight: 600,
            gap: 8,
            marginBottom: 16,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Map size={20} />
          {t("route.result.mapPreview")}
          <div
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              background: "var(--accent)",
              color: "white",
              padding: "6px 12px",
              borderRadius: 20,
              fontSize: "0.72rem",
              fontWeight: 700,
            }}
          >
            {t("route.result.stopsCount", { count: routeItems.length })}
          </div>
        </div>

        {/* Route summary */}
        <div className="route-result-hero" style={{ marginBottom: 16 }}>
          <span className="eyebrow">{t("route.result.generatedEyebrow")}</span>
          <h1 className="display" style={{ fontSize: "1.3rem" }}>
            {route.city}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
            {t("route.result.stopsCount", { count: route.summary.stopCount })}
          </p>
          <div className="route-result-hero__stats">
            <div className="detail-metric">
              <span>{t("route.result.metric.interests")}</span>
              <strong>{route.summary.interests.length}</strong>
            </div>
            <div className="detail-metric">
              <span>{t("route.result.metric.stops")}</span>
              <strong>{routeItems.length}</strong>
            </div>
          </div>
        </div>

        {/* Route stops */}
        <div className="section-label" style={{ marginBottom: 12 }}>{t("route.result.section.stops")}</div>
        <div className="route-stop-list" style={{ marginBottom: 20 }}>
          {routeItems.map((item, index) => (
            <RouteStopCard key={`${item.place.id}-${item.time}`} item={item} index={index} />
          ))}
        </div>

        {/* Related places */}
        {relatedPlaces.filter((p) => !routeItems.some((i) => i.place.id === p.id)).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>{t("route.result.section.nearby")}</div>
            <div className="related-link-list">
              {relatedPlaces
                .filter((place) => !routeItems.some((item) => item.place.id === place.id))
                .slice(0, 4)
                .map((place) => (
                  <Link key={place.id} className="related-link" to={`/places/${place.id}`}>
                    <img src={place.imageUrl} alt={place.name} />
                    <span>
                      <strong>{place.name}</strong>
                      <small>{place.description}</small>
                    </span>
                  </Link>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
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
