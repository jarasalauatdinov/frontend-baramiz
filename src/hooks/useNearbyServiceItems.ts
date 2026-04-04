import { useMemo } from "react";
import { ensureArray } from "@/shared/api/normalize";
import {
  attachDistanceToItems,
  getNearbyItems,
  sortItemsByDistance,
  type NearbyServiceItem,
} from "@/shared/lib/location";
import type { Coordinates, PublicServiceItem } from "@/shared/types/api";

interface UseNearbyServiceItemsOptions {
  items: PublicServiceItem[] | undefined;
  currentLocation?: Coordinates | null;
}

export function useNearbyServiceItems({ items, currentLocation }: UseNearbyServiceItemsOptions) {
  return useMemo(() => {
    const baseItems = ensureArray(items);
    const itemsWithDistance = currentLocation
      ? sortItemsByDistance(attachDistanceToItems(baseItems, currentLocation))
      : attachDistanceToItems(baseItems, currentLocation);
    const nearbyItems = getNearbyItems(itemsWithDistance);

    return {
      itemsWithDistance,
      nearbyItems,
      hasNearbyCoordinates: nearbyItems.length > 0,
      hasAnyCoordinates: itemsWithDistance.some((item) => item.coordinates),
      hasAnyDistance: itemsWithDistance.some((item) => item.distanceKm !== undefined || Boolean(item.distanceText)),
    } satisfies {
      itemsWithDistance: NearbyServiceItem[];
      nearbyItems: NearbyServiceItem[];
      hasNearbyCoordinates: boolean;
      hasAnyCoordinates: boolean;
      hasAnyDistance: boolean;
    };
  }, [currentLocation, items]);
}
