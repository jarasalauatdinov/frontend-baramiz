import { Clock3, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { getDistanceLabel, type NearbyServiceItem } from "@/shared/lib/location";
import { useI18n } from "@/shared/i18n/provider";

interface NearbyResultCardProps {
  item: NearbyServiceItem;
}

export function NearbyResultCard({ item }: NearbyResultCardProps) {
  const { language, t } = useI18n();
  const distanceLabel = getDistanceLabel(item, language);
  const primaryPhone = item.phoneNumbers[0];
  const subtitle = item.address || item.shortDescription || item.city || item.workingHours || "";

  return (
    <Link className="nearby-result-card panel" to={item.detailPath || `/service/${item.sectionSlug}/${item.slug}`}>
      <div className="nearby-result-card__header">
        <div className="nearby-result-card__copy">
          <h3>{item.title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {distanceLabel ? <span className="nearby-result-card__distance">{distanceLabel}</span> : null}
      </div>

      <div className="nearby-result-card__facts">
        {item.workingHours ? (
          <span>
            <Clock3 size={14} />
            {item.workingHours}
          </span>
        ) : null}
        {item.address || item.city ? (
          <span>
            <MapPin size={14} />
            {item.address || item.city}
          </span>
        ) : null}
        {primaryPhone ? (
          <span>
            <Phone size={14} />
            {primaryPhone}
          </span>
        ) : null}
      </div>

      <div className="nearby-result-card__footer">
        <span className="nearby-result-card__cta">{t("service.item.actions.openDetails")}</span>
      </div>
    </Link>
  );
}
