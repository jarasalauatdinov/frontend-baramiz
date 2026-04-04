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

export type ServiceCategorySlug =
  | "services"
  | "history-and-culture"
  | "nature"
  | "museums-and-exhibitions"
  | "restaurants"
  | "sightseeing"
  | "hotels"
  | "taxi"
  | "hospitals"
  | "pharmacies"
  | "atms";

export type ServiceSectionType = "discovery" | "utility";
export type ServiceMetadataValue = string | number | boolean | string[] | null;
export type ServiceMetadata = Record<string, ServiceMetadataValue>;

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
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  city: string;
  region: string;
  category: CategoryId;
  address?: string;
  duration: number;
  image: string;
  gallery: string[];
  tags: string[];
  coordinates: Coordinates;
  featured: boolean;
  rating?: number;
  workingHours?: string;
  price?: string;
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
  image_gallery: string[];
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

export interface RouteStop {
  id: string;
  order: number;
  name: string;
  city: string;
  category: CategoryId;
  description: string;
  estimatedDurationMinutes: number;
  image: string;
}

export interface GeneratedRoute {
  city: string;
  language: Language;
  duration: RouteDuration;
  title: string;
  summary: string;
  totalDurationMinutes: number;
  stops: RouteStop[];
}

export interface GenerateRouteInput {
  city: string;
  duration?: RouteDuration;
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

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthPayload {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

export interface StoredAuthSession extends AuthPayload {}

export interface PublicServiceSection {
  id: string;
  slug: ServiceCategorySlug;
  title: string;
  image: string;
  order: number;
  isActive: boolean;
  shortDescription?: string;
  description?: string;
  icon?: string;
  type: ServiceSectionType;
}

export interface ServiceCategoryRoute {
  slug: ServiceCategorySlug;
  path: string;
}

export interface ServiceHubCategory extends PublicServiceSection, ServiceCategoryRoute {}

export interface PublicServiceItem {
  id: string;
  sectionSlug: ServiceCategorySlug;
  slug: string;
  title: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  gallery: string[];
  address?: string;
  city?: string;
  phoneNumbers: string[];
  workingHours?: string;
  district?: string;
  mapLink?: string;
  emergencyNote?: string;
  serviceType?: string;
  coordinates?: Coordinates;
  tags: string[];
  featured: boolean;
  isActive: boolean;
  metadata: ServiceMetadata;
  detailPath?: string;
}

export type ServiceCategoryItem = PublicServiceItem;

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
