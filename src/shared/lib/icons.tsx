import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Banknote,
  BedDouble,
  BriefcaseBusiness,
  Building2,
  Camera,
  CarTaxiFront,
  CircleDollarSign,
  ChefHat,
  Compass,
  CreditCard,
  Landmark,
  Mountain,
  Pill,
  Route,
  Theater,
  Utensils,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  activity: Activity,
  atm: CircleDollarSign,
  banknote: Banknote,
  bed: BedDouble,
  "briefcase-business": BriefcaseBusiness,
  briefcase: BriefcaseBusiness,
  building: Building2,
  camera: Camera,
  car: CarTaxiFront,
  "chef-hat": ChefHat,
  compass: Compass,
  "credit-card": CreditCard,
  hospital: Activity,
  landmark: Landmark,
  mountain: Mountain,
  pill: Pill,
  pharmacy: Pill,
  restaurants: Utensils,
  museum: Landmark,
  route: Route,
  theater: Theater,
  utensils: Utensils,
};

export function resolveCategoryIcon(iconName?: string) {
  if (!iconName) {
    return Compass;
  }

  return iconMap[iconName] || Compass;
}
