import { Clock3, ExternalLink, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiRequestError } from "@/api/client";
import { ensureArray } from "@/api/normalize";
import { buildMapsLink, getPlaceHeroMetrics } from "@/api/baramiz";
import { AppHeader } from "@/components/layout/AppHeader";
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
      <>
        <AppHeader title="Place" back />
        <div className="screen screen--center">
          <LoadingState title="Loading" copy="Fetching details..." />
        </div>
      </>
    );
  }

  if (placeQuery.isError || !placeQuery.data) {
    return (
      <>
        <AppHeader title="Place" back />
        <div className="screen screen--center">
          <ErrorState title="Not found" copy="This place could not be loaded." />
        </div>
      </>
    );
  }

  if (detailQuery.isError && !detailMissing) {
    return (
      <>
        <AppHeader title="Place" back />
        <div className="screen screen--center">
          <ErrorState title="Content error" copy="Rich content failed to load." />
        </div>
      </>
    );
  }

  const place = placeQuery.data;
  const detail = detailMissing ? undefined : detailQuery.data;
  const gallery = normalizeGallery(detail?.image_cover, detail?.image_gallery, place.imageUrl);
  const relatedItems = ensureArray<PublicContentItem>(relatedQuery.data);
  const mapHref =
    detail?.map_url || buildMapsLink(detail?.latitude ?? place.coordinates.lat, detail?.longitude ?? place.coordinates.lng);

  return (
    <>
      <AppHeader title={place.name} back />
      <div className="screen" style={{ paddingTop: 0 }}>
        {/* Hero image */}
        <div
          style={{
            height: 220,
            borderRadius: 20,
            overflow: "hidden",
            marginBottom: 16,
            boxShadow: "var(--shadow-md)",
          }}
        >
          <img
            src={gallery[0]}
            alt={place.name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Title & meta */}
        <div style={{ marginBottom: 16 }}>
          <span className="eyebrow">{place.city}</span>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.15, marginTop: 4 }}>
            {place.name}
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
            {detail?.full_description ?? place.description}
          </p>
          <div className="meta-row" style={{ marginTop: 12 }}>
            <span className="tag">{titleCase(place.category)}</span>
            <span className="tag">{place.region}</span>
            {place.featured ? (
              <span className="tag tag-featured">
                <Star size={12} /> Featured
              </span>
            ) : null}
          </div>
        </div>

        {/* Metrics */}
        <div className="detail-metric-grid" style={{ marginBottom: 16 }}>
          {getPlaceHeroMetrics(place, detail).map((metric) => (
            <div className="detail-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        {/* Quick facts */}
        <div className="detail-section" style={{ marginBottom: 16 }}>
          <h2>Details</h2>
          <div className="detail-facts">
            <span><MapPin size={14} /> {detail?.address || `${place.city}, ${place.region}`}</span>
            <span><Clock3 size={14} /> {formatDurationMinutes(detail?.duration_minutes ?? place.durationMinutes)}</span>
            {detail?.rating ? <span><Star size={14} /> {detail.rating}</span> : null}
          </div>
          <dl className="detail-data-list">
            <div>
              <dt>Coordinates</dt>
              <dd>{formatCoordinate(detail?.latitude ?? place.coordinates.lat)}, {formatCoordinate(detail?.longitude ?? place.coordinates.lng)}</dd>
            </div>
            <div>
              <dt>Pricing</dt>
              <dd>{formatPrice(detail?.price_from, detail?.price_to, detail?.currency) ?? "Free"}</dd>
            </div>
            <div>
              <dt>Languages</dt>
              <dd>{detail?.languages?.join(", ") || "KAA, UZ, RU, EN"}</dd>
            </div>
          </dl>
        </div>

        {/* Gallery */}
        {gallery.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>Gallery</div>
            <div className="detail-gallery">
              {gallery.slice(0, 4).map((image, index) => (
                <div className="detail-gallery__item" key={`${image}-${index}`}>
                  <img src={image} alt={`${place.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Related</div>
          {relatedItems.length ? (
            <div className="stack-list">
              {relatedItems.slice(0, 3).map((item) => (
                <DirectoryCard
                  key={item.id}
                  item={{ ...item, normalizedGallery: normalizeGallery(item.image_cover, item.image_gallery) }}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No suggestions yet"
              copy="Related places will appear as the catalog grows."
              action={<Link className="button secondary" to="/places">Browse All</Link>}
            />
          )}
        </div>

        {/* Actions */}
        <div className="button-row">
          <Link className="button accent button--full" to={`/route-generator?city=${encodeURIComponent(place.city)}`}>
            Generate Route from {place.city}
          </Link>
          {mapHref ? (
            <a className="button secondary button--full" href={mapHref} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> Open Map
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
