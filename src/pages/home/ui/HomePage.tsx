import { Skeleton, Stack } from "@mantine/core";
import { Compass, MapPinned, Route as RouteIcon, Sparkles, Users } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { HeroCard } from "@/widgets/hero";
import { PopularCitiesSection } from "@/widgets/popular-cities";
import { QuickActionRow } from "@/widgets/quick-action-row";
import { ServicePreviewSection } from "@/widgets/services";
import { FeaturedPlacesSection } from "@/widgets/top-experiences";
import { useHomePageModel } from "@/pages/home/model/useHomePageModel";

function HomePageSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height={320} radius={32} />
      <Skeleton height={116} radius={24} />
      <Skeleton height={160} radius={28} />
      <Skeleton height={260} radius={28} />
      <Skeleton height={164} radius={28} />
    </Stack>
  );
}

export function HomePage() {
  const { t } = useI18n();
  const { cityCards, featuredPlaceItems, isInitialLoading } = useHomePageModel();

  const heroProps = {
    badge: t("home.hero.eyebrow"),
    title: t("home.hero.title"),
    description: t("home.hero.copy"),
    primaryAction: {
      label: t("home.hero.primary"),
      to: "/route-generator",
      icon: <Sparkles size={16} />,
    },
    secondaryAction: {
      label: t("common.actions.openService"),
      to: "/service",
      icon: <MapPinned size={16} />,
    },
    backgroundVariant: "dark" as const,
  };

  const quickActionItems = [
    {
      id: "route",
      label: t("home.quick.route.title"),
      subtitle: t("home.quick.route.copy"),
      to: "/route-generator",
      icon: <RouteIcon size={18} />,
    },
    {
      id: "places",
      label: t("home.quick.places.title"),
      subtitle: t("home.quick.places.copy"),
      to: "/places",
      icon: <Compass size={18} />,
    },
    {
      id: "guides",
      label: t("home.quick.guides.title"),
      subtitle: t("home.quick.guides.copy"),
      to: "/guides",
      icon: <Users size={18} />,
    },
    {
      id: "services",
      label: t("home.quick.services.title"),
      subtitle: t("home.quick.services.copy"),
      to: "/service",
      icon: <MapPinned size={18} />,
    },
  ];

  return (
    <>
      <AppHeader title={t("home.header.title")} showLanguageSwitcher />
      <div className="screen home-redesign-screen home-app-screen">
        {isInitialLoading ? (
          <HomePageSkeleton />
        ) : (
          <Stack gap={18}>
            <HeroCard {...heroProps} />
            <QuickActionRow items={quickActionItems} />
            <FeaturedPlacesSection
              title={t("home.experiences.title")}
              viewAllLabel={t("common.actions.browseAll")}
              viewAllTo="/places"
              items={featuredPlaceItems}
            />
            <PopularCitiesSection cities={cityCards} />
            <ServicePreviewSection />
          </Stack>
        )}
      </div>
    </>
  );
}
