import { Clock3, ExternalLink, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiRequestError } from "@/api/client";
import { ensureArray } from "@/api/normalize";
import { buildMapsLink, getPlaceHeroMetrics } from "@/api/baramiz";
import { DirectoryCard } from "@/components/content/DirectoryCard";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useContentDetailQuery, usePlaceQuery, useRelatedContentQuery } from "@/hooks/usePublicData";
import { formatCoordinate, formatDurationMinutes, formatPrice, titleCase } from "@/lib/utils";
import type { PublicContentItem } from "@/types/api";

function normalizeGallery(image_cover?: string, image_gallery?: string[] | string, fallback?: string) {
  const gallery = Array.isArray(image_gallery)
    ? image_gallery
    : typeof image_gallery === "string" && image_gallery.length > 0
      ? [image_gallery]
      : [];

  return Array.from(new Set([image_cover, ...gallery, fallback].filter(Boolean))) as string[];
}

export function PlaceDetailPage() {
  const { placeId } = useParams();
  const placeQuery = usePlaceQuery(placeId);
  const detailQuery = useContentDetailQuery(placeId);
  const relatedQuery = useRelatedContentQuery(detailQuery.data?.id);
  const detailMissing = detailQuery.error instanceof ApiRequestError && detailQuery.error.status === 404;

  if (placeQuery.isPending && !placeQuery.data) {
    return (
      <div className="page">
        <LoadingState title="Loading place details" copy="Fetching the selected destination from the backend." />
      </div>
    );
  }

  if (placeQuery.isError || !placeQuery.data) {
    return (
      <div className="page">
        <ErrorState title="Place not found" copy="The requested place could not be loaded from the current catalog." />
      </div>
    );
  }

  if (detailQuery.isError && !detailMissing) {
    return (
      <div className="page">
        <ErrorState title="Extra place content failed to load" copy="The core place loaded, but the richer content entry failed." />
      </div>
    );
  }

  const place = placeQuery.data;
  const detail = detailMissing ? undefined : detailQuery.data;
  const gallery = normalizeGallery(detail?.image_cover, detail?.image_gallery, place.imageUrl);
  const relatedItems = ensureArray<PublicContentItem>(relatedQuery.data);
  const mapHref =
    detail?.map_url || buildMapsLink(detail?.latitude ?? place.coordinates.lat, detail?.longitude ?? place.coordinates.lng);

  return (
    <div className="page detail-page">
      <section className="detail-hero panel">
        <div className="detail-hero__media">
          <img src={gallery[0]} alt={place.name} />
        </div>
        <div className="detail-hero__content">
          <span className="eyebrow">{place.city}</span>
          <h1 className="display">{place.name}</h1>
          <p>{detail?.full_description ?? place.description}</p>

          <div className="meta-row">
            <span className="tag">{titleCase(place.category)}</span>
            <span className="tag">{place.region}</span>
            {place.featured ? (
              <span className="tag tag-featured">
                <Star size={14} />
                Featured
              </span>
            ) : null}
          </div>

          <div className="detail-metric-grid">
            {getPlaceHeroMetrics(place, detail).map((metric) => (
              <div className="detail-metric" key={metric.label}>
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
              </div>
            ))}
          </div>

          <div className="button-row">
            <Link className="button accent" to={`/route-generator?city=${encodeURIComponent(place.city)}`}>
              Generate a route from {place.city}
            </Link>
            {mapHref ? (
              <a className="button secondary" href={mapHref} target="_blank" rel="noreferrer">
                <ExternalLink size={16} />
                Open map
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section className="section split-layout">
        <div className="panel detail-section">
          <h2>Tourism details</h2>
          <div className="detail-facts">
            <span>
              <MapPin size={16} />
              {detail?.address || `${place.city}, ${place.region}`}
            </span>
            <span>
              <Clock3 size={16} />
              {formatDurationMinutes(detail?.duration_minutes ?? place.durationMinutes)}
            </span>
            {detail?.rating ? (
              <span>
                <Star size={16} />
                {detail.rating} rating
              </span>
            ) : null}
          </div>
          <p>{detail?.note || detail?.meta || "This destination is ready to appear in route generation and discovery flows."}</p>
          <div className="meta-row">
            {(detail?.tags ?? [place.category, place.city, place.region]).slice(0, 6).map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="panel detail-section">
          <h2>Quick facts</h2>
          <dl className="detail-data-list">
            <div>
              <dt>Latitude</dt>
              <dd>{formatCoordinate(detail?.latitude ?? place.coordinates.lat)}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{formatCoordinate(detail?.longitude ?? place.coordinates.lng)}</dd>
            </div>
            <div>
              <dt>Pricing</dt>
              <dd>{formatPrice(detail?.price_from, detail?.price_to, detail?.currency) ?? "Public location"}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{detail?.languages?.join(", ") || "KAA, UZ, RU, EN"}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section">
        <div className="detail-gallery">
          {gallery.slice(0, 4).map((image, index) => (
            <div className="detail-gallery__item panel" key={`${image}-${index}`}>
              <img src={image} alt={`${place.name} ${index + 1}`} />
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title display">Related suggestions</h2>
        {relatedItems.length ? (
          <div className="grid-auto">
            {relatedItems.slice(0, 3).map((item) => (
              <DirectoryCard
                key={item.id}
                item={{ ...item, normalizedGallery: normalizeGallery(item.image_cover, item.image_gallery) }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No related suggestions yet"
            copy="This place still works on its own, and related content will appear as the catalog grows."
            action={
              <Link className="button secondary" to="/places">
                Browse all places
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
