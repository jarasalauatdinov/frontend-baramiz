import { Clock3, MapPin } from "lucide-react";
import type { RouteItem } from "@/types/api";
import { formatDurationMinutes } from "@/lib/utils";

interface RouteStopCardProps {
  item: RouteItem;
  index: number;
}

export function RouteStopCard({ item, index }: RouteStopCardProps) {
  return (
    <article className="route-stop panel">
      <div className="route-stop__index">{String(index + 1).padStart(2, "0")}</div>
      <div className="route-stop__content">
        <div className="route-stop__heading">
          <div>
            <span className="eyebrow">Stop {index + 1}</span>
            <h3>{item.place.name}</h3>
          </div>
          <span className="pill">{item.time}</span>
        </div>
        <p>{item.reason}</p>
        <div className="route-stop__meta">
          <span>
            <MapPin size={16} />
            {item.place.city}
          </span>
          <span>
            <Clock3 size={16} />
            {formatDurationMinutes(item.estimatedDurationMinutes)}
          </span>
        </div>
      </div>
      <div className="route-stop__media">
        <img src={item.place.imageUrl} alt={item.place.name} />
      </div>
    </article>
  );
}
