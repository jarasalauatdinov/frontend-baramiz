export type Language = "kaa" | "uz" | "ru" | "en";
export type CategoryId = "history" | "culture" | "museum" | "nature" | "adventure" | "food";
export type RouteDuration = "3_hours" | "half_day" | "1_day";
export type ContentType =
  | "place"
  | "hotel"
  | "restaurant"
  | "museum"
  | "sightseeing"
  | "nature"
  | "history_culture"
  | "service";

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export interface ApiErrorResponse {
  message: string;
  errors?: ApiErrorDetail[];
}

export interface ApiHealth {
  status: "ok";
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface PublicCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  type: string;
  sort_order: number;
  is_active: boolean;
}

export interface PublicPlace {
  id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  category: CategoryId;
  durationMinutes: number;
  imageUrl: string;
  coordinates: Coordinates;
  featured: boolean;
}

export interface PublicContentItem {
  id: string;
  slug: string;
  source_kind: "place" | "content";
  source_id: string;
  type: ContentType;
  featured: boolean;
  bookable: boolean;
  name: string;
  short_description: string;
  full_description: string;
  city: string;
  region: string;
  address?: string;
  category?: string;
  category_ids: string[];
  tags: string[];
  image_cover?: string;
  image_gallery: string[] | string;
  latitude?: number;
  longitude?: number;
  map_url?: string;
  rating?: number;
  review_count?: number;
  price_from?: number;
  price_to?: number;
  currency?: string;
  contact_phone?: string;
  contact_telegram?: string;
  contact_website?: string;
  working_hours?: string;
  duration_minutes?: number;
  amenities: string[];
  languages: string[];
  meta?: string;
  note?: string;
  available_cities: string[];
  service_kind?: string;
  recommended_trip_styles: string[];
  recommended_budgets: string[];
  nearby_keywords: string[];
  route_eligible: boolean;
}

export interface PublicCitySummary {
  city: string;
  region: string;
  count: number;
  featured_image?: string;
  types: ContentType[];
}

export interface RoutePlaceSummary {
  id: string;
  name: string;
  city: string;
  category: CategoryId;
  imageUrl: string;
  coordinates: Coordinates;
  description: string;
}

export interface RouteItem {
  time: string;
  place: RoutePlaceSummary;
  reason: string;
  estimatedDurationMinutes: number;
}

export interface RouteSummary {
  stopCount: number;
  estimatedStartTime: string;
  estimatedEndTime: string;
  usedDuration: RouteDuration;
  interests: CategoryId[];
}

export interface GeneratedRoute {
  city: string;
  duration: RouteDuration;
  language: Language;
  totalMinutes: number;
  items: RouteItem[];
  summary: RouteSummary;
}

export interface GenerateRouteInput {
  city: string;
  duration: RouteDuration;
  interests: CategoryId[];
  language: Language;
}

export interface ChatInput {
  message: string;
  language: Language;
}

export interface ChatResponse {
  reply: string;
  source: "fallback" | "openai";
  suggestions?: string[];
}

export interface AdminPlace {
  id: string;
  name: string;
  name_kaa: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  city: string;
  region: string;
  category: CategoryId;
  durationMinutes: number;
  description: string;
  description_kaa: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  image: string;
  coordinates: Coordinates;
  featured: boolean;
}

export interface AdminPlaceInput {
  name_kaa: string;
  name_uz: string;
  name_ru?: string;
  name_en?: string;
  description_kaa: string;
  description_uz: string;
  description_ru?: string;
  description_en?: string;
  image: string;
  city: string;
  region: string;
  category: CategoryId;
  featured: boolean;
  coordinates: Coordinates;
  durationMinutes: number;
  autoTranslate?: boolean;
}

export interface TranslationResult {
  name_ru: string;
  name_en: string;
  description_ru: string;
  description_en: string;
}

export interface DeletePlaceResponse {
  id: string;
  message: string;
}

export interface ServiceDirectoryEntry extends PublicContentItem {
  normalizedGallery: string[];
}

export interface GuideProfile extends PublicContentItem {
  normalizedGallery: string[];
}

export interface EventMoment extends PublicContentItem {
  normalizedGallery: string[];
  source: "events-endpoint" | "content-fallback";
}
