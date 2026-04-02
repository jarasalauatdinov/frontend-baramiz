import { Compass, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { ensureArray } from "@/api/normalize";
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
      <div className="page">
        <EmptyState
          title="No generated route yet"
          copy="Generate a route first, then this page will display the stored result with ordered stops and CTA options."
          action={
            <Link className="button accent" to="/route-generator">
              Open route generator
            </Link>
          }
        />
      </div>
    );
  }

  const { route } = storedResult;
  const routeItems = ensureArray<RouteItem>(route.items);
  const relatedPlaces = ensureArray<PublicPlace>(relatedPlacesQuery.data);

  if (routeItems.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="This stored route has no stops"
          copy="Generate a fresh route to rebuild the result screen from live backend output."
          action={
            <Link className="button accent" to="/route-generator">
              Generate new route
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="page route-result-page">
      <section className="route-result-hero panel">
        <div>
          <span className="eyebrow">Generated route</span>
          <h1 className="display">
            {route.city} {route.duration.replace(/_/g, " ")} route
          </h1>
          <p>
            {route.summary.stopCount} planned stops from {route.summary.estimatedStartTime} to{" "}
            {route.summary.estimatedEndTime}, generated from backend route logic and stored locally for quick review.
          </p>
        </div>
        <div className="route-result-hero__stats">
          <div className="detail-metric">
            <span>Total time</span>
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
      </section>

      <section className="section">
        <div className="route-stop-list">
          {routeItems.map((item, index) => (
            <RouteStopCard key={`${item.place.id}-${item.time}`} item={item} index={index} />
          ))}
        </div>
      </section>

      <section className="section split-layout">
        <div className="panel detail-section">
          <h2>Why this result works well in demos</h2>
          <p>
            The result screen turns backend output into a clear product moment: a title, time range,
            ordered stops, duration, and practical actions to continue the flow.
          </p>
          <div className="button-row">
            <Link className="button accent" to="/route-generator">
              <RefreshCw size={16} />
              Regenerate route
            </Link>
            <Link className="button secondary" to="/places">
              <Compass size={16} />
              Explore more places
            </Link>
          </div>
        </div>

        <div className="panel detail-section">
          <h2>Same-city discovery</h2>
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
      </section>
    </div>
  );
}
