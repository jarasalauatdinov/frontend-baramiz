import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  BriefcaseBusiness,
  ChefHat,
  Compass,
  Landmark,
  Mountain,
  Route,
  Theater,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  bed: BedDouble,
  "briefcase-business": BriefcaseBusiness,
  briefcase: BriefcaseBusiness,
  "chef-hat": ChefHat,
  compass: Compass,
  landmark: Landmark,
  mountain: Mountain,
  museum: Landmark,
  route: Route,
  theater: Theater,
};

export function resolveCategoryIcon(iconName?: string) {
  if (!iconName) {
    return Compass;
  }

  return iconMap[iconName] || Compass;
}
