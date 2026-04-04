import { Link } from "react-router-dom";
import { Clock3, ExternalLink, MapPin, Phone, Star } from "lucide-react";
import type { PublicServiceItem } from "@/shared/types/api";
import { useI18n } from "@/shared/i18n/provider";

interface ServiceItemCardProps {
  item: PublicServiceItem;
}

export function ServiceItemCard({ item }: ServiceItemCardProps) {
  const { t } = useI18n();
  const primaryPhone = item.phoneNumbers[0];
  const rating = typeof item.metadata.rating === "number" ? item.metadata.rating : undefined;
  const summary = item.address || item.shortDescription || item.city || "";

  return (
    <article className="service-item-card panel">
      <div className="service-item-card__media">
        {item.image ? (
          <img src={item.image} alt={item.title} loading="lazy" />
        ) : (
          <div className="service-item-card__placeholder">{item.title}</div>
        )}
      </div>
      <div className="service-item-card__body">
        <div className="service-item-card__topline">
          {item.city ? <span className="tag">{item.city}</span> : null}
          {item.featured ? <span className="tag tag-featured">{t("common.featured")}</span> : null}
          {item.serviceType ? <span className="tag">{item.serviceType}</span> : null}
        </div>

        <h3>{item.title}</h3>
        {summary ? <p>{summary}</p> : null}

        <div className="service-item-card__facts">
          {item.workingHours ? (
            <span>
              <Clock3 size={15} />
              {item.workingHours}
            </span>
          ) : null}
          {item.address ? (
            <span>
              <MapPin size={15} />
              {item.address}
            </span>
          ) : null}
          {rating ? (
            <span>
              <Star size={15} />
              {rating.toFixed(1)}
            </span>
          ) : null}
        </div>

        <div className="service-item-card__actions">
          {item.detailPath ? (
            <Link className="button accent button--full" to={item.detailPath}>
              {t("service.item.actions.openDetails")}
            </Link>
          ) : null}
          {(item.mapLink || primaryPhone) ? (
            <div className="service-item-card__quick-actions">
              {item.mapLink ? (
                <a className="service-item-card__quick-link" href={item.mapLink} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} />
                  {t("service.item.actions.openMap")}
                </a>
              ) : null}
              {primaryPhone ? (
                <a className="service-item-card__quick-link" href={`tel:${primaryPhone}`}>
                  <Phone size={15} />
                  {primaryPhone}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
