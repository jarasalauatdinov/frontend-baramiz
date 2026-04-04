import { Clock3, ExternalLink, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ApiRequestError } from "@/shared/api/client";
import { ensureArray } from "@/shared/api/normalize";
import { buildMapsLink } from "@/shared/api/baramiz";
import { getLocaleForLanguage } from "@/shared/i18n";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useContentDetailQuery, usePlaceQuery, useRelatedContentQuery } from "@/hooks/usePublicData";
import { formatCoordinate, formatDurationMinutes, formatPrice } from "@/shared/lib/utils";
import type { PublicContentItem } from "@/shared/types/api";

function normalizeGallery(image_cover?: string, image_gallery?: string[] | string, fallback?: string) {
  const gallery = Array.isArray(image_gallery)
    ? image_gallery
    : typeof image_gallery === "string" && image_gallery.length > 0
      ? [image_gallery]
      : [];
  return Array.from(new Set([image_cover, ...gallery, fallback].filter(Boolean))) as string[];
}

export function PlaceDetailPage() {
  const { language, t } = useI18n();
  const { placeId } = useParams();
  const placeQuery = usePlaceQuery(placeId);
  const detailQuery = useContentDetailQuery(placeId);
  const relatedQuery = useRelatedContentQuery(detailQuery.data?.id);
  const detailMissing = detailQuery.error instanceof ApiRequestError && detailQuery.error.status === 404;
  const locale = getLocaleForLanguage(language);

  if (placeQuery.isPending && !placeQuery.data) {
    return (
      <>
        <AppHeader title={t("places.detail.headerFallback")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("places.detail.loading.title")} copy={t("places.detail.loading.copy")} />
        </div>
      </>
    );
  }

  if (placeQuery.isError || !placeQuery.data) {
    return (
      <>
        <AppHeader title={t("places.detail.headerFallback")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("places.detail.error.title")} copy={t("places.detail.error.copy")} />
        </div>
      </>
    );
  }

  if (detailQuery.isError && !detailMissing) {
    return (
      <>
        <AppHeader title={placeQuery.data.name} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState
            title={t("places.detail.contentError.title")}
            copy={t("places.detail.contentError.copy")}
          />
        </div>
      </>
    );
  }

  const place = placeQuery.data;
  const detail = detailMissing ? undefined : detailQuery.data;
  const placeGallery = place.gallery.length ? place.gallery : [place.image];
  const gallery = normalizeGallery(detail?.image_cover, detail?.image_gallery, placeGallery[0] ?? place.image);
  const combinedGallery = Array.from(new Set([...gallery, ...placeGallery].filter(Boolean)));
  const relatedItems = ensureArray<PublicContentItem>(relatedQuery.data);
  const mapHref =
    detail?.map_url || buildMapsLink(detail?.latitude ?? place.coordinates.lat, detail?.longitude ?? place.coordinates.lng);
  const durationLabel = formatDurationMinutes(detail?.duration_minutes ?? place.duration, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });
  const metricItems = [
    {
      label: t("places.detail.facts.estimatedVisit"),
      value: durationLabel,
    },
    {
      label: t("places.detail.facts.region"),
      value: place.region,
    },
    {
      label: t("places.detail.facts.travelMode"),
      value: detail?.route_eligible ? t("places.detail.values.routeReady") : t("places.detail.values.flexible"),
    },
  ];
  const priceLabel =
    formatPrice(detail?.price_from, detail?.price_to, detail?.currency, locale) ??
    place.price ??
    t("places.detail.values.free");
  const languageLabel = detail?.languages?.length ? detail.languages.join(", ") : t("common.status.unavailable");
  const hasCoordinates =
    detail?.latitude !== undefined ||
    detail?.longitude !== undefined ||
    (place.coordinates.lat !== undefined && place.coordinates.lng !== undefined);
  const coordinatesLabel = hasCoordinates
    ? `${formatCoordinate(detail?.latitude ?? place.coordinates.lat)}, ${formatCoordinate(detail?.longitude ?? place.coordinates.lng)}`
    : t("common.status.unavailable");

  return (
    <>
      <AppHeader title={place.name} back showLanguageSwitcher />
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
            <span className="tag">{getInterestLabel(place.category, t)}</span>
            <span className="tag">{place.region}</span>
            {place.tags.slice(0, 2).map((tag) => (
              <span className="tag" key={`${place.id}-${tag}`}>{tag}</span>
            ))}
            {place.featured ? (
              <span className="tag tag-featured">
                <Star size={12} /> {t("common.featured")}
              </span>
            ) : null}
          </div>
        </div>

        {/* Metrics */}
        <div className="detail-metric-grid" style={{ marginBottom: 16 }}>
          {metricItems.map((metric) => (
            <div className="detail-metric" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          ))}
        </div>

        {/* Quick facts */}
        <div className="detail-section" style={{ marginBottom: 16 }}>
          <h2>{t("places.detail.sections.details")}</h2>
          <div className="detail-facts">
            <span><MapPin size={14} /> {detail?.address || place.address || `${place.city}, ${place.region}`}</span>
            <span><Clock3 size={14} /> {durationLabel}</span>
            {detail?.rating || place.rating ? <span><Star size={14} /> {(detail?.rating ?? place.rating)?.toFixed(1)}</span> : null}
          </div>
          <dl className="detail-data-list">
            <div>
              <dt>{t("places.detail.facts.coordinates")}</dt>
              <dd>{coordinatesLabel}</dd>
            </div>
            <div>
              <dt>{t("places.detail.facts.pricing")}</dt>
              <dd>{priceLabel}</dd>
            </div>
            <div>
              <dt>{t("places.detail.facts.languages")}</dt>
              <dd>{languageLabel}</dd>
            </div>
          </dl>
        </div>

        {/* Gallery */}
        {combinedGallery.length > 1 && (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>
              {t("places.detail.sections.gallery")}
            </div>
            <div className="detail-gallery">
              {combinedGallery.slice(0, 4).map((image, index) => (
                <div className="detail-gallery__item" key={`${image}-${index}`}>
                  <img src={image} alt={`${place.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        <div style={{ marginBottom: 20 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>
            {t("places.detail.sections.related")}
          </div>
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
              title={t("places.detail.emptyRelated.title")}
              copy={t("places.detail.emptyRelated.copy")}
              action={
                <Link className="button secondary" to="/places">
                  {t("common.actions.browseAll")}
                </Link>
              }
            />
          )}
        </div>

        {/* Actions */}
        <div className="button-row">
          <Link className="button accent button--full" to={`/route-generator?city=${encodeURIComponent(place.city)}`}>
            {t("places.detail.actions.route", { city: place.city })}
          </Link>
          {mapHref ? (
            <a className="button secondary button--full" href={mapHref} target="_blank" rel="noreferrer">
              <ExternalLink size={16} /> {t("places.detail.actions.map")}
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
