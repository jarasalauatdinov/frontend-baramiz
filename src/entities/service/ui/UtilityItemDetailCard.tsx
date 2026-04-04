import { Clock3, ExternalLink, Instagram, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceKm, getDistanceLabel } from "@/shared/lib/location";
import { useI18n } from "@/shared/i18n/provider";
import type { PublicServiceItem } from "@/shared/types/api";

interface UtilityItemDetailCardProps {
  item: PublicServiceItem;
  categoryTitle: string;
  categoryPath: string;
  distanceKm?: number;
}

export function UtilityItemDetailCard({
  item,
  categoryTitle,
  categoryPath,
  distanceKm,
}: UtilityItemDetailCardProps) {
  const { language, t } = useI18n();
  const distanceLabel = getDistanceLabel(
    { distanceKm: item.distanceKm ?? distanceKm, distanceText: item.distanceText },
    language,
  ) ?? formatDistanceKm(distanceKm, language);
  const gallery = item.gallery.length ? item.gallery : item.image ? [item.image] : [];
  const isOpenNow = item.metadata.openNow === true;
  const contactLinks = [
    item.phoneNumbers[0]
      ? { href: `tel:${item.phoneNumbers[0]}`, label: t("common.actions.callNow"), icon: Phone, external: false }
      : null,
    item.mapLink
      ? { href: item.mapLink, label: t("service.item.actions.openMap"), icon: ExternalLink, external: true }
      : null,
    item.websiteLink
      ? { href: item.websiteLink, label: t("service.item.actions.openWebsite"), icon: ExternalLink, external: true }
      : null,
    item.telegramLink
      ? { href: item.telegramLink, label: t("service.item.actions.openTelegram"), icon: ExternalLink, external: true }
      : null,
    item.instagramLink
      ? { href: item.instagramLink, label: t("service.item.actions.openInstagram"), icon: Instagram, external: true }
      : null,
  ].filter(Boolean) as Array<{
    href: string;
    label: string;
    icon: LucideIcon;
    external: boolean;
  }>;

  return (
    <div className="utility-detail">
      {gallery[0] ? (
        <div className="utility-detail__hero">
          <img src={gallery[0]} alt={item.title} />
        </div>
      ) : null}

      <section className="panel utility-detail__card">
        <div className="utility-detail__header">
          <div>
            <span className="eyebrow">{categoryTitle}</span>
            <h1>{item.title}</h1>
          </div>
          <div className="utility-detail__header-badges">
            {isOpenNow ? <span className="utility-detail__status">{t("service.item.status.openNow")}</span> : null}
            {distanceLabel ? <span className="utility-detail__distance">{distanceLabel}</span> : null}
          </div>
        </div>

        {item.shortDescription ? <p className="utility-detail__summary">{item.shortDescription}</p> : null}

        <div className="utility-detail__facts">
          {item.address || item.city ? (
            <span>
              <MapPin size={15} />
              {item.address || item.city}
            </span>
          ) : null}
          {item.workingHours ? (
            <span>
              <Clock3 size={15} />
              {item.workingHours}
            </span>
          ) : null}
        </div>
      </section>

      <section className="panel utility-detail__card">
        <h2>{t("service.item.section.contact")}</h2>
        <dl className="detail-data-list">
          <div>
            <dt>{t("service.item.facts.distance")}</dt>
            <dd>{distanceLabel || t("common.status.unavailable")}</dd>
          </div>
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
      </section>

      {item.description ? (
        <section className="panel utility-detail__card">
          <h2>{t("service.item.section.about")}</h2>
          <p className="utility-detail__body-copy">{item.description}</p>
        </section>
      ) : null}

      <div className="button-row">
        {contactLinks.map((link) =>
          link.external ? (
            <a
              key={`${item.id}-${link.href}`}
              className="button secondary button--full"
              href={link.href}
              target="_blank"
              rel="noreferrer"
            >
              <link.icon size={16} />
              {link.label}
            </a>
          ) : (
            <a key={`${item.id}-${link.href}`} className="button secondary button--full" href={link.href}>
              <link.icon size={16} />
              {link.label}
            </a>
          ),
        )}

        <Link className="button accent button--full" to={categoryPath}>
          {t("common.actions.backToService")}
        </Link>
      </div>
    </div>
  );
}
