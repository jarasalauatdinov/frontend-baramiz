import { Clock3, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { PublicPlace } from "@/shared/types/api";
import { formatDurationMinutes } from "@/shared/lib/utils";

interface PlaceCardProps {
  place: PublicPlace;
}

export function PlaceCard({ place }: PlaceCardProps) {
  const { t } = useI18n();

  return (
    <Link className="place-card panel" to={`/places/${place.id}`}>
      <div className="place-card__media">
        <img src={place.imageUrl} alt={place.name} />
      </div>
      <div className="place-card__body">
        <div className="meta-row">
          <span className="tag">{place.city}</span>
          <span className="tag">{getInterestLabel(place.category, t)}</span>
          {place.featured ? (
            <span className="tag tag-featured">
              <Star size={14} />
              {t("common.featured")}
            </span>
          ) : null}
        </div>
        <h3>{place.name}</h3>
        <p>{place.description}</p>
        <div className="place-card__meta">
          <span>
            <MapPin size={16} />
            {place.region}
          </span>
          <span>
            <Clock3 size={16} />
            {formatDurationMinutes(place.durationMinutes)}
          </span>
        </div>
      </div>
    </Link>
  );
}
