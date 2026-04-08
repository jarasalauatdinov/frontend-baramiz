import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { SavePlaceButton } from "@/features/place-save/ui/SavePlaceButton";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { RouteStop } from "@/shared/types/api";

interface RouteStopCardProps {
  item: RouteStop;
  index: number;
  reason?: string;
}

export function RouteStopCard({ item, index, reason }: RouteStopCardProps) {
  const { t } = useI18n();
  const fallbackReason =
    item.description || t("route.result.reason.city", { city: item.city });

  return (
    <article className="route-stop panel">
      <div className="route-stop__media">
        {item.image ? (
          <img src={item.image} alt={item.name} loading="lazy" />
        ) : (
          <div className="route-stop__placeholder">
            <span className="eyebrow">{t("route.stop.eyebrow", { index: index + 1 })}</span>
            <strong>{item.city}</strong>
          </div>
        )}
      </div>

      <div className="route-stop__content">
        <div className="meta-row route-stop__badges">
          <span className="tag tag-featured">{getInterestLabel(item.category, t)}</span>
          <span className="tag">{item.city}</span>
        </div>

        <div className="route-stop__heading">
          <h3>{item.name}</h3>
        </div>

        <p>{reason || fallbackReason}</p>

        <div className="route-stop__meta">
          <span>
            <MapPin size={16} />
            {item.city}
          </span>
        </div>

        <div className="route-stop__actions">
          <Link className="button secondary route-stop__view-action" to={`/places/${item.id}`}>
            {t("route.result.actions.viewPlace")}
          </Link>
          <SavePlaceButton placeId={item.id} />
        </div>
      </div>
    </article>
  );
}
