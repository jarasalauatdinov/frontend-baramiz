import { Clock3, MapPin } from "lucide-react";
import { AspectRatio, Badge, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { FeaturedPlacesSectionProps } from "@/shared/types/home";

export function FeaturedPlacesSection({
  title,
  viewAllLabel,
  viewAllTo,
  items,
}: FeaturedPlacesSectionProps) {
  const [lead, ...rest] = items;

  if (!lead) {
    return null;
  }

  return (
    <Stack gap="md">
      <Group justify="space-between" align="center">
        <Title order={2}>{title}</Title>
        {viewAllLabel && viewAllTo ? (
          <Text component={Link} to={viewAllTo} size="sm" fw={700} c="baramizInk.6">
            {viewAllLabel}
          </Text>
        ) : null}
      </Group>

      <Card component={Link} to={lead.to} padding="md" radius={28} shadow="xl" style={{ background: "#fffdf8" }}>
        <Stack gap={14}>
          <AspectRatio ratio={4 / 4.2}>
            <img
              src={lead.image}
              alt={lead.title}
              loading="lazy"
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 22 }}
            />
          </AspectRatio>

          <Stack gap={10}>
            <Group gap={8} wrap="wrap">
              {lead.location ? <Badge color="baramizInk">{lead.location}</Badge> : null}
              {lead.tag ? <Badge color="baramizGold">{lead.tag}</Badge> : null}
            </Group>

            <Stack gap={6}>
              <Title order={3} ff='"Cormorant Garamond", serif' size="2rem" c="baramizInk.8">
                {lead.title}
              </Title>
              {lead.subtitle ? (
                <Text size="sm" c="dark.3" lineClamp={3}>
                  {lead.subtitle}
                </Text>
              ) : null}
            </Stack>

            <Group gap={14} wrap="wrap">
              {lead.location ? (
                <Group gap={6}>
                  <MapPin size={15} />
                  <Text size="sm" c="dark.4">
                    {lead.location}
                  </Text>
                </Group>
              ) : null}
              {lead.duration ? (
                <Group gap={6}>
                  <Clock3 size={15} />
                  <Text size="sm" c="dark.4">
                    {lead.duration}
                  </Text>
                </Group>
              ) : null}
            </Group>
          </Stack>
        </Stack>
      </Card>

      {rest.length ? (
        <SimpleGrid cols={1} spacing="sm">
          {rest.map((item) => (
            <Card
              key={item.id}
              component={Link}
              to={item.to}
              padding="sm"
              radius={24}
              shadow="md"
              style={{ background: "#fffdf8" }}
            >
              <Group gap="md" wrap="nowrap" align="stretch">
                <AspectRatio ratio={1} style={{ width: 104, flex: "0 0 104px" }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 18 }}
                  />
                </AspectRatio>

                <Stack gap={8} justify="center" style={{ minWidth: 0 }}>
                  <Group gap={8} wrap="wrap">
                    {item.tag ? <Badge color="baramizGold">{item.tag}</Badge> : null}
                  </Group>
                  <Title order={3} ff='"Cormorant Garamond", serif' size="1.55rem" c="baramizInk.8">
                    {item.title}
                  </Title>
                  {item.subtitle ? (
                    <Text size="sm" c="dark.3" lineClamp={2}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </Stack>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      ) : null}
    </Stack>
  );
}
