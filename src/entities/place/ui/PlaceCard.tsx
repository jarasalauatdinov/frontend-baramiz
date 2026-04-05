import { Clock3, MapPin, Star } from "lucide-react";
import { AspectRatio, Badge, Box, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { PublicPlace } from "@/shared/types/api";
import { formatDurationMinutes } from "@/shared/lib/utils";

interface PlaceCardProps {
  place: PublicPlace;
  variant?: "default" | "featured" | "compact";
}

export function PlaceCard({ place, variant = "default" }: PlaceCardProps) {
  const { t } = useI18n();
  const durationLabel = formatDurationMinutes(place.duration, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });

  const isCompact = variant === "compact";
  const isFeatured = variant === "featured";

  return (
    <Card
      component={Link}
      to={`/places/${place.id}`}
      padding={isCompact ? "sm" : "md"}
      radius={isFeatured ? 28 : 24}
      shadow={isFeatured ? "xl" : "md"}
      style={{
        background: "#fffdf8",
        overflow: "hidden",
      }}
    >
      <Stack gap={isCompact ? 12 : 14}>
        <AspectRatio ratio={isCompact ? 1 : isFeatured ? 4 / 4.2 : 4 / 3}>
          <Box
            component="img"
            src={place.image}
            alt={place.name}
            loading="lazy"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: isFeatured ? 22 : 18,
            }}
          />
        </AspectRatio>

        <Stack gap={10}>
          <Group gap={8} wrap="wrap">
            <Badge color="baramizInk" variant="light">
              {place.city}
            </Badge>
            <Badge color="baramizGold" variant="light">
              {getInterestLabel(place.category, t)}
            </Badge>
            {place.featured ? (
              <Badge color="baramizTeal" variant="light" leftSection={<Star size={12} />}>
                {t("common.featured")}
              </Badge>
            ) : null}
          </Group>

          <Stack gap={6}>
            <Title
              order={3}
              ff='"Cormorant Garamond", serif'
              size={isFeatured ? "2rem" : "1.55rem"}
              c="baramizInk.8"
            >
              {place.name}
            </Title>
            <Text size="sm" c="dark.3" lineClamp={isCompact ? 2 : 3}>
              {place.shortDescription || place.description}
            </Text>
          </Stack>

          <Group gap={14} wrap="wrap">
            <Group gap={6}>
              <MapPin size={15} />
              <Text size="sm" c="dark.4">
                {place.region}
              </Text>
            </Group>
            <Group gap={6}>
              <Clock3 size={15} />
              <Text size="sm" c="dark.4">
                {durationLabel}
              </Text>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Card>
  );
}
