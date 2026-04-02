import { Clock3, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { PublicPlace } from "@/types/api";
import { formatDurationMinutes, titleCase } from "@/lib/utils";

interface PlaceCardProps {
  place: PublicPlace;
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Link className="place-card panel" to={`/places/${place.id}`}>
      <div className="place-card__media">
        <img src={place.imageUrl} alt={place.name} />
      </div>
      <div className="place-card__body">
        <div className="meta-row">
          <span className="tag">{place.city}</span>
          <span className="tag">{titleCase(place.category)}</span>
          {place.featured ? (
            <span className="tag tag-featured">
              <Star size={14} />
              Featured
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
