import { Clock3, MapPin } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";
import type { RouteStop } from "@/shared/types/api";
import { formatDurationMinutes } from "@/shared/lib/utils";

interface RouteStopCardProps {
  item: RouteStop;
  index: number;
}

export function RouteStopCard({ item, index }: RouteStopCardProps) {
  const { t } = useI18n();
  const durationLabel = formatDurationMinutes(item.estimatedDurationMinutes, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });

  return (
    <article className="route-stop panel">
      <div className="route-stop__content">
        <div className="route-stop__heading">
          <div className="route-stop__heading-main">
            <div className="route-stop__index">{String(index + 1).padStart(2, "0")}</div>
            <div>
              <span className="eyebrow">{t("route.stop.eyebrow", { index: index + 1 })}</span>
              <h3>{item.name}</h3>
            </div>
          </div>
        </div>
        {item.description ? <p>{item.description}</p> : null}
        <div className="route-stop__meta">
          <span>
            <MapPin size={16} />
            {item.city}
          </span>
          <span>
            <Clock3 size={16} />
            {durationLabel}
          </span>
        </div>
      </div>
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
    </article>
  );
}
