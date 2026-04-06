import type { ReactNode } from "react";

export interface HomeServicePreviewItem {
  id: string;
  badge: string;
  title: string;
  copy: string;
  href: string;
  tone: "gold" | "teal" | "ink";
}

export type HeroCardProps = {
  badge: string;
  title: string;
  description: string;
  image?: string;
  primaryAction: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
  secondaryAction?: {
    label: string;
    to: string;
    icon?: ReactNode;
  };
  backgroundVariant?: "blue" | "teal" | "dark";
};

export type QuickActionItem = {
  id: string;
  label: string;
  subtitle?: string;
  to: string;
  icon?: ReactNode;
};

export type QuickActionRowProps = {
  items: QuickActionItem[];
};

export type FeaturedPlaceItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  location?: string;
  duration?: string;
  tag?: string;
  to: string;
};

export type FeaturedPlacesSectionProps = {
  title: string;
  viewAllLabel?: string;
  viewAllTo?: string;
  items: FeaturedPlaceItem[];
};

export type FeaturedTourItem = {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  location?: string;
  duration?: string;
  badge?: string;
  to: string;
};
