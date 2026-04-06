import { Badge, Box, Button, Group, Paper, ScrollArea, Skeleton, Stack, Text, Title } from "@mantine/core";
import { MapPinned, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { HeroCard } from "@/widgets/hero";
import { ServicePreviewSection } from "@/widgets/services";
import { FeaturedPlacesSection } from "@/widgets/top-experiences";
import { useHomePageModel } from "@/pages/home/model/useHomePageModel";
import type { FeaturedTourItem } from "@/shared/types/home";

function HomePageSkeleton() {
  return (
    <Stack gap="lg">
      <Skeleton height={274} radius={28} />
      <Skeleton height={408} radius={28} />
      <Skeleton height={318} radius={28} />
      <Skeleton height={220} radius={28} />
      <Skeleton height={188} radius={28} />
    </Stack>
  );
}

interface FeaturedToursSectionProps {
  title: string;
  items: FeaturedTourItem[];
}

function FeaturedToursSection({ title, items }: FeaturedToursSectionProps) {
  if (!items.length) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Title order={2} size="h4">
          {title}
        </Title>
      </Group>

      <ScrollArea type="never" offsetScrollbars={false}>
        <Group gap="sm" wrap="nowrap">
          {items.map((item) => (
            <Paper
              key={item.id}
              component={Link}
              to={item.to}
              radius={28}
              shadow="xl"
              style={{
                position: "relative",
                overflow: "hidden",
                minWidth: 272,
                minHeight: 318,
                color: "white",
                background: "#1d1f22",
                textDecoration: "none",
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt=""
                loading="lazy"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <Box
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(16, 19, 24, 0.08) 20%, rgba(16, 19, 24, 0.84) 100%)",
                }}
              />

              <Stack
                gap="sm"
                justify="space-between"
                style={{
                  position: "relative",
                  zIndex: 1,
                  minHeight: 318,
                  padding: 20,
                }}
              >
                <Group gap={8} wrap="wrap">
                  {item.badge ? <Badge color="baramizGold">{item.badge}</Badge> : null}
                  {item.location ? <Badge color="dark">{item.location}</Badge> : null}
                </Group>

                <Stack gap={8}>
                  <Title order={3} ff='"Cormorant Garamond", serif' size="2rem" c="white" style={{ lineHeight: 0.96 }}>
                    <Text component="span" inherit lineClamp={2} style={{ textWrap: "balance" }}>
                      {item.title}
                    </Text>
                  </Title>
                  {item.subtitle ? (
                    <Text size="sm" c="rgba(255,255,255,0.84)" lineClamp={3} style={{ lineHeight: 1.52 }}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                  {(item.duration || item.location) ? (
                    <Group gap={8} wrap="wrap">
                      {item.duration ? <Badge variant="outline" color="gray">{item.duration}</Badge> : null}
                      {item.location ? <Badge variant="outline" color="gray">{item.location}</Badge> : null}
                    </Group>
                  ) : null}
                </Stack>
              </Stack>
            </Paper>
          ))}
        </Group>
      </ScrollArea>
    </Stack>
  );
}

function AiHelperTeaser() {
  const { t } = useI18n();

  return (
    <Paper
      radius={28}
      p="lg"
      style={{
        position: "relative",
        overflow: "hidden",
        background:
          "radial-gradient(circle at top right, rgba(217, 119, 6, 0.18), transparent 30%), linear-gradient(145deg, #1f2933 0%, #243845 100%)",
        color: "white",
      }}
    >
      <Stack gap="md" style={{ position: "relative", zIndex: 1 }}>
        <Group justify="space-between" align="flex-start">
          <Badge color="baramizGold">{t("home.ai.badge")}</Badge>
          <Box
            style={{
              width: 42,
              height: 42,
              display: "grid",
              placeItems: "center",
              borderRadius: 16,
              background: "rgba(255,255,255,0.08)",
            }}
          >
            <Sparkles size={18} />
          </Box>
        </Group>

        <Stack gap={6}>
          <Title order={2} c="white" size="1.7rem" style={{ lineHeight: 0.98, letterSpacing: "-0.03em" }}>
            {t("home.ai.title")}
          </Title>
          <Text size="sm" c="rgba(255,255,255,0.82)" maw={280} style={{ lineHeight: 1.55 }}>
            {t("home.ai.copy")}
          </Text>
        </Stack>

        <Group gap={8} wrap="wrap">
          <Badge variant="outline" color="gray">
            {t("home.quick.route.short")}
          </Badge>
          <Badge variant="outline" color="gray">
            {t("home.quick.service.short")}
          </Badge>
          <Badge variant="outline" color="gray">
            {t("home.quick.nearby.short")}
          </Badge>
        </Group>

        <Stack gap="xs">
          <Button component={Link} to="/route-generator" color="baramizGold" leftSection={<Sparkles size={16} />} fullWidth>
            {t("home.ai.primary")}
          </Button>
          <Button component={Link} to="/service" variant="white" color="gray" leftSection={<MapPinned size={16} />} fullWidth>
            {t("home.ai.secondary")}
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export function HomePage() {
  const { t } = useI18n();
  const storedRoute = readStoredRouteResult();
  const { featuredPlaceItems, featuredTourItems, heroImage, isInitialLoading } = useHomePageModel();

  const currentTourItem: FeaturedTourItem | null = storedRoute
    ? {
        id: "current-route",
        title: storedRoute.route.title,
        subtitle: storedRoute.route.summary || t("route.result.summaryFallback", { city: storedRoute.route.city }),
        image: storedRoute.route.stops[0]?.image || heroImage,
        location: storedRoute.route.city,
        duration: formatDurationMinutes(storedRoute.route.totalDurationMinutes, {
          flexible: t("common.duration.flexible"),
          hourShort: t("common.units.hourShort"),
          minuteShort: t("common.units.minuteShort"),
        }),
        badge: t("saved.current.badge"),
        to: "/route-result",
      }
    : null;
  const homeTourItems = currentTourItem ? [currentTourItem, ...featuredTourItems].slice(0, 3) : featuredTourItems;

  const heroProps = {
    badge: t("home.hero.eyebrow"),
    title: t("home.hero.title"),
    description: t("home.hero.copy"),
    image: heroImage,
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

  return (
    <>
      <AppHeader title={t("home.header.title")} showLanguageSwitcher />
      <div className="screen home-redesign-screen home-app-screen">
        {isInitialLoading ? (
          <HomePageSkeleton />
        ) : (
          <Stack gap="lg">
            <HeroCard {...heroProps} />
            <FeaturedPlacesSection
              title={t("home.experiences.title")}
              viewAllLabel={t("home.viewAll")}
              viewAllTo="/places"
              items={featuredPlaceItems}
            />
            <FeaturedToursSection title={t("home.tours.title")} items={homeTourItems} />
            <ServicePreviewSection />
            <AiHelperTeaser />
          </Stack>
        )}
      </div>
    </>
  );
}
