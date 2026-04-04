import type { NearbyServiceItem } from "@/shared/lib/location";
import { NearbyResultCard } from "./NearbyResultCard";

interface NearbyResultsListProps {
  items: NearbyServiceItem[];
}

export function NearbyResultsList({ items }: NearbyResultsListProps) {
  return (
    <div className="nearby-results-list">
      {items.map((item) => (
        <NearbyResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
