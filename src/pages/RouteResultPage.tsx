import { Compass, Map, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
import { AppHeader } from "@/components/layout/AppHeader";
import { RouteStopCard } from "@/components/route/RouteStopCard";
import { EmptyState } from "@/components/state/EmptyState";
import { usePlacesQuery } from "@/hooks/usePublicData";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { formatDurationMinutes } from "@/lib/utils";
import type { PublicPlace, RouteItem } from "@/types/api";

export function RouteResultPage() {
  const storedResult = readStoredRouteResult();
  const relatedPlacesQuery = usePlacesQuery({
    city: storedResult?.route.city,
  });

  if (!storedResult) {
    return (
      <>
        <AppHeader title="Route Result" back />
        <div className="screen screen--center">
          <EmptyState
            title="No route yet"
            copy="Generate a route first to see results here."
            action={
              <Link className="button accent" to="/route-generator">
                Build a Route
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
        <AppHeader title="Route Result" back />
        <div className="screen screen--center">
          <EmptyState
            title="Empty route"
            copy="This route has no stops. Generate a new one."
            action={
              <Link className="button accent" to="/route-generator">
                Generate New Route
              </Link>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title="Your Route" back />
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
          Route Map Preview
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
            {routeItems.length} stops
          </div>
        </div>

        {/* Route summary */}
        <div className="route-result-hero" style={{ marginBottom: 16 }}>
          <span className="eyebrow">Generated Route</span>
          <h1 className="display" style={{ fontSize: "1.3rem" }}>
            {route.city} — {route.duration.replace(/_/g, " ")}
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: 4 }}>
            {route.summary.stopCount} stops · {route.summary.estimatedStartTime} to{" "}
            {route.summary.estimatedEndTime}
          </p>
          <div className="route-result-hero__stats">
            <div className="detail-metric">
              <span>Duration</span>
              <strong>{formatDurationMinutes(route.totalMinutes)}</strong>
            </div>
            <div className="detail-metric">
              <span>Interests</span>
              <strong>{route.summary.interests.length}</strong>
            </div>
            <div className="detail-metric">
              <span>Stops</span>
              <strong>{routeItems.length}</strong>
            </div>
          </div>
        </div>

        {/* Route stops */}
        <div className="section-label" style={{ marginBottom: 12 }}>Route Stops</div>
        <div className="route-stop-list" style={{ marginBottom: 20 }}>
          {routeItems.map((item, index) => (
            <RouteStopCard key={`${item.place.id}-${item.time}`} item={item} index={index} />
          ))}
        </div>

        {/* Related places */}
        {relatedPlaces.filter((p) => !routeItems.some((i) => i.place.id === p.id)).length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Nearby Places</div>
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
            Regenerate Route
          </Link>
          <Link className="button secondary button--full" to="/places">
            <Compass size={16} />
            Explore More Places
          </Link>
        </div>
      </div>
    </>
  );
}
