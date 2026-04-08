import { Clock3, MapPin } from "lucide-react";
import { Badge, Box, Group, Paper, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import type { PublicPlace } from "@/shared/types/api";

interface ExplorePlaceCardProps {
  place: PublicPlace;
}

export function ExplorePlaceCard({ place }: ExplorePlaceCardProps) {
  const { t } = useI18n();
  const durationLabel = formatDurationMinutes(place.duration, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });

  return (
    <Paper
      component={Link}
      to={`/places/${place.id}`}
      className="explore-place-card"
      radius={24}
      p={10}
      shadow="sm"
    >
      <Stack gap={10}>
        <Box className="explore-place-card__media">
          <img src={place.image} alt={place.name} loading="lazy" />
        </Box>

        <Stack gap={8}>
          <Group gap={6} wrap="wrap">
            <Badge color="baramizGold" radius="xl" variant="light">
              {getInterestLabel(place.category, t)}
            </Badge>
            <Badge color="gray" radius="xl" variant="light">
              {place.city}
            </Badge>
          </Group>

          <Stack gap={4}>
            <Text className="explore-place-card__title">{place.name}</Text>
            <Text c="dimmed" lineClamp={2} size="sm">
              {place.shortDescription || place.description}
            </Text>
          </Stack>

          <Group c="dimmed" gap={10} wrap="wrap">
            <Group gap={4} wrap="nowrap">
              <MapPin size={14} />
              <Text size="xs">{place.region}</Text>
            </Group>
            <Group gap={4} wrap="nowrap">
              <Clock3 size={14} />
              <Text size="xs">{durationLabel}</Text>
            </Group>
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
