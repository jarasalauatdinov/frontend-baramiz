import type { TranslationKey } from "@/shared/i18n/en";
import type { PublicPlace } from "@/shared/types/api";

export interface MockPlace extends PublicPlace {
  fallbackDescriptionKey?: TranslationKey;
}

export const mockPlaces: MockPlace[] = [
  {
    id: "savitsky-museum",
    slug: "savitsky-museum",
    name: "Savitsky Museum",
    description: "",
    shortDescription: "",
    fallbackDescriptionKey: "home.experiences.fallback.savitsky",
    city: "Nukus",
    region: "Karakalpakstan",
    category: "museum",
    duration: 120,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["museum", "culture"],
    coordinates: { lat: 42.4602, lng: 59.6177 },
    featured: true,
  },
  {
    id: "mizdakhan",
    slug: "mizdakhan",
    name: "Mizdakhan",
    description: "",
    shortDescription: "",
    fallbackDescriptionKey: "home.experiences.fallback.mizdakhan",
    city: "Qonirat",
    region: "Karakalpakstan",
    category: "history",
    duration: 140,
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["history", "architecture"],
    coordinates: { lat: 42.7616, lng: 59.9875 },
    featured: true,
  },
  {
    id: "ayaz-kala",
    slug: "ayaz-kala",
    name: "Ayaz Kala",
    description: "",
    shortDescription: "",
    fallbackDescriptionKey: "home.experiences.fallback.ayazkala",
    city: "Ellikqala",
    region: "Karakalpakstan",
    category: "culture",
    duration: 180,
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80",
    gallery: [],
    tags: ["culture", "history"],
    coordinates: { lat: 42.1179, lng: 61.0282 },
    featured: true,
  },
];
