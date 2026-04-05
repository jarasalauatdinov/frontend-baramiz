import type { TranslationKey } from "@/shared/i18n/en";

export interface CityCardSeed {
  id: "nukus" | "moynaq" | "ellikqala" | "qonirat";
  name: string;
  descriptorKey: TranslationKey;
  fallbackImage: string;
}

export interface CityCardItem {
  id: CityCardSeed["id"];
  name: string;
  descriptor: string;
  image: string;
  href: string;
  meta?: string;
}
