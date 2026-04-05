import { Skeleton, Stack } from "@mantine/core";
import { Bookmark, MapPinned, Navigation, Sparkles } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { HeroCard } from "@/widgets/hero";
import { QuickActionRow as CompactQuickActions } from "@/widgets/quick-action-row";
import { NearbyUtilityStrip, ServicePreviewSection } from "@/widgets/services";
import { FeaturedPlacesSection } from "@/widgets/top-experiences";
import { useHomePageModel } from "@/pages/home/model/useHomePageModel";

function HomePageSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton height={216} radius={28} />
      <Skeleton height={68} radius={22} />
      <Skeleton height={208} radius={24} />
      <Skeleton height={196} radius={24} />
      <Skeleton height={74} radius={20} />
    </Stack>
  );
}

export function HomePage() {
  const { t } = useI18n();
  const { featuredPlaceItems, isInitialLoading } = useHomePageModel();

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
      label: t("home.hero.secondary"),
      to: "/service",
      icon: <MapPinned size={16} />,
    },
    backgroundVariant: "dark" as const,
  };

  const quickActionItems = [
    {
      id: "route",
      label: t("home.quick.route.short"),
      to: "/route-generator",
      icon: <Sparkles size={16} />,
    },
    {
      id: "service",
      label: t("home.quick.service.short"),
      to: "/service",
      icon: <MapPinned size={16} />,
    },
    {
      id: "nearby",
      label: t("home.quick.nearby.short"),
      to: "/service/pharmacies",
      icon: <Navigation size={16} />,
    },
    {
      id: "saved",
      label: t("home.quick.saved.short"),
      to: "/saved-booking",
      icon: <Bookmark size={16} />,
    },
  ];

  return (
    <>
      <AppHeader title={t("home.header.title")} showLanguageSwitcher />
      <div className="screen home-redesign-screen home-app-screen">
        {isInitialLoading ? (
          <HomePageSkeleton />
        ) : (
          <Stack gap="md">
            <HeroCard {...heroProps} />
            <CompactQuickActions items={quickActionItems} />
            <FeaturedPlacesSection
              title={t("home.experiences.title")}
              viewAllLabel={t("home.viewAll")}
              viewAllTo="/places"
              items={featuredPlaceItems}
            />
            <ServicePreviewSection />
            <NearbyUtilityStrip />
          </Stack>
        )}
      </div>
    </>
  );
}
