import { Clock3, ExternalLink, MapPin, Phone, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getServiceItemKindLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { ServiceCategoryItem } from "@/shared/types/api";

interface ServiceItemCardProps {
  item: ServiceCategoryItem;
}

function getPrimaryAction(item: ServiceCategoryItem) {
  if (item.detailPath) {
    return {
      kind: "internal" as const,
      labelKey: "service.item.actions.openDetails" as const,
      to: item.detailPath,
    };
  }

  if (item.website) {
    return {
      kind: "external" as const,
      labelKey: "service.item.actions.openWebsite" as const,
      href: item.website,
    };
  }

  if (item.mapUrl) {
    return {
      kind: "external" as const,
      labelKey: "service.item.actions.openMap" as const,
      href: item.mapUrl,
    };
  }

  return null;
}

export function ServiceItemCard({ item }: ServiceItemCardProps) {
  const { t } = useI18n();
  const primaryAction = getPrimaryAction(item);

  return (
    <article className="service-item-card panel">
      <div className="service-item-card__media">
        {item.image ? <img src={item.image} alt={item.name} /> : <div className="service-item-card__placeholder">{item.name}</div>}
      </div>
      <div className="service-item-card__body">
        <div className="meta-row">
          {item.city ? <span className="tag">{item.city}</span> : null}
          {item.badge ? <span className="tag tag-featured">{item.badge}</span> : null}
          <span className="tag">{getServiceItemKindLabel(item.kind, t)}</span>
        </div>
        <h3>{item.name}</h3>
        <p>{item.shortDescription}</p>
        <div className="service-item-card__facts">
          {item.address ? (
            <span>
              <MapPin size={15} />
              {item.address}
            </span>
          ) : null}
          {item.workingHours ? (
            <span>
              <Clock3 size={15} />
              {item.workingHours}
            </span>
          ) : null}
          {item.rating ? (
            <span>
              <Star size={15} />
              {item.rating.toFixed(1)}
            </span>
          ) : null}
        </div>
        {item.tags.length ? (
          <div className="meta-row">
            {item.tags.slice(0, 3).map((tag) => (
              <span key={`${item.id}-${tag}`} className="tag">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
        <div className="button-row">
          {primaryAction?.kind === "internal" ? (
            <Link className="button accent button--full" to={primaryAction.to}>
              {t(primaryAction.labelKey)}
            </Link>
          ) : null}
          {primaryAction?.kind === "external" ? (
            <a className="button accent button--full" href={primaryAction.href} target="_blank" rel="noreferrer">
              <ExternalLink size={16} />
              {t(primaryAction.labelKey)}
            </a>
          ) : null}
          {item.phone ? (
            <a className="button secondary button--full" href={`tel:${item.phone}`}>
              <Phone size={16} />
              {item.phone}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
