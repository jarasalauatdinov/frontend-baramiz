import { Clock3, ExternalLink, MapPin, Phone, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useServiceCategoryItemQuery, useServiceSectionQuery } from "@/hooks/usePublicData";
import { getServiceCategoryTitle } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { ServiceCategorySlug } from "@/shared/types/api";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";

export function ServiceItemDetailPage() {
  const { t } = useI18n();
  const { categorySlug, itemSlug } = useParams<{ categorySlug: string; itemSlug: string }>();
  const sectionSlug = categorySlug as ServiceCategorySlug | undefined;
  const sectionQuery = useServiceSectionQuery(sectionSlug);
  const itemQuery = useServiceCategoryItemQuery(sectionSlug, itemSlug);
  const section = sectionQuery.data;
  const item = itemQuery.data;
  const categoryPath = sectionSlug ? `/service/${sectionSlug}` : "/service";
  const headerTitle = item?.title ?? (section ? getServiceCategoryTitle(section, t) : t("service.header.title"));
  const gallery = item?.gallery.length ? item.gallery : item?.image ? [item.image] : [];

  if ((sectionQuery.isPending || itemQuery.isPending) && !item) {
    return (
      <>
        <AppHeader title={headerTitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("service.item.loading.title")} copy={t("service.item.loading.copy")} />
        </div>
      </>
    );
  }

  if (itemQuery.isError) {
    return (
      <>
        <AppHeader title={headerTitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.item.error.title")} copy={t("service.item.error.copy")} />
        </div>
      </>
    );
  }

  if (!item) {
    return (
      <>
        <AppHeader title={headerTitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("service.item.notFound.title")}
            copy={t("service.item.notFound.copy")}
            action={
              <Link className="button accent" to={categoryPath}>
                {t("common.actions.backToService")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={item.title} back showLanguageSwitcher />
      <div className="screen" style={{ paddingTop: 0 }}>
        {gallery[0] ? (
          <div
            style={{
              height: 220,
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 16,
              boxShadow: "var(--shadow-md)",
            }}
          >
            <img src={gallery[0]} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ) : null}

        <div style={{ marginBottom: 16 }}>
          <span className="eyebrow">{section ? getServiceCategoryTitle(section, t) : t("service.header.title")}</span>
          <h1 style={{ fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.15, marginTop: 4 }}>{item.title}</h1>
          {item.shortDescription ? (
            <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 8 }}>
              {item.shortDescription}
            </p>
          ) : null}
          <div className="meta-row" style={{ marginTop: 12 }}>
            {item.city ? <span className="tag">{item.city}</span> : null}
            {item.serviceType ? <span className="tag">{item.serviceType}</span> : null}
            {item.featured ? (
              <span className="tag tag-featured">
                <Star size={12} /> {t("common.featured")}
              </span>
            ) : null}
          </div>
        </div>

        {item.description ? (
          <div className="detail-section" style={{ marginBottom: 16 }}>
            <h2>{t("service.item.section.about")}</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>{item.description}</p>
          </div>
        ) : null}

        <div className="detail-section" style={{ marginBottom: 16 }}>
          <h2>{t("service.item.section.contact")}</h2>
          <div className="detail-facts">
            {item.address ? (
              <span>
                <MapPin size={14} /> {item.address}
              </span>
            ) : null}
            {item.workingHours ? (
              <span>
                <Clock3 size={14} /> {item.workingHours}
              </span>
            ) : null}
            {typeof item.metadata.rating === "number" ? (
              <span>
                <Star size={14} /> {item.metadata.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
          <dl className="detail-data-list">
            <div>
              <dt>{t("service.item.facts.phone")}</dt>
              <dd>{item.phoneNumbers.length ? item.phoneNumbers.join(", ") : t("common.status.unavailable")}</dd>
            </div>
            <div>
              <dt>{t("service.item.facts.address")}</dt>
              <dd>{item.address || item.city || t("common.status.unavailable")}</dd>
            </div>
            <div>
              <dt>{t("service.item.facts.hours")}</dt>
              <dd>{item.workingHours || t("common.status.unavailable")}</dd>
            </div>
          </dl>
        </div>

        {gallery.length > 1 ? (
          <div style={{ marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{t("service.item.section.gallery")}</div>
            <div className="detail-gallery">
              {gallery.slice(0, 4).map((image, index) => (
                <div className="detail-gallery__item" key={`${image}-${index}`}>
                  <img src={image} alt={`${item.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {item.tags.length ? (
          <div style={{ marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 8 }}>{t("service.item.facts.tags")}</div>
            <div className="meta-row">
              {item.tags.map((tag) => (
                <span className="tag" key={`${item.id}-${tag}`}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="button-row">
          <Link className="button secondary button--full" to={categoryPath}>
            {t("common.actions.backToService")}
          </Link>
          {item.mapLink ? (
            <a className="button accent button--full" href={item.mapLink} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {t("service.item.actions.openMap")}
            </a>
          ) : null}
          {item.phoneNumbers[0] ? (
            <a className="button secondary button--full" href={`tel:${item.phoneNumbers[0]}`}>
              <Phone size={16} />
              {item.phoneNumbers[0]}
            </a>
          ) : null}
        </div>
      </div>
    </>
  );
}
