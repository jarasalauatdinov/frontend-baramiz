import { useState } from "react";
import { MapPin } from "lucide-react";
import { AspectRatio, Badge, Box, Card, Group, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { FeaturedPlacesSectionProps } from "@/shared/types/home";

interface FeaturedPlaceMediaProps {
  image: string;
  title: string;
}

function FeaturedPlaceMedia({ image, title }: FeaturedPlaceMediaProps) {
  const [hasImageError, setHasImageError] = useState(!image);

  if (hasImageError) {
    return (
      <Box
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: 20,
          overflow: "hidden",
          background: "linear-gradient(160deg, #2f63d8 0%, #4f84ea 100%)",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "44%",
            height: "40%",
            borderBottomLeftRadius: 36,
            background: "rgba(244, 248, 255, 0.82)",
          }}
        />
        <Box
          style={{
            position: "absolute",
            insetInline: 0,
            bottom: 0,
            padding: "16px",
            background: "linear-gradient(180deg, rgba(23, 45, 112, 0.08) 0%, rgba(23, 45, 112, 0.34) 100%)",
          }}
        >
          <Text
            fw={800}
            c="white"
            size="lg"
            lineClamp={2}
            style={{
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              overflowWrap: "anywhere",
              textWrap: "balance",
            }}
          >
            {title}
          </Text>
        </Box>
      </Box>
    );
  }

  return (
    <img
      src={image}
      alt=""
      loading="lazy"
      onError={() => setHasImageError(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 20,
      }}
    />
  );
}

export function FeaturedPlacesSection({
  title,
  viewAllLabel,
  viewAllTo,
  items,
}: FeaturedPlacesSectionProps) {
  const visibleItems = items.slice(0, 2);

  if (!visibleItems.length) {
    return null;
  }

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Title order={2} size="h4">
          {title}
        </Title>
        {viewAllLabel && viewAllTo ? (
          <Text component={Link} to={viewAllTo} size="sm" fw={700} c="baramizInk.6">
            {viewAllLabel}
          </Text>
        ) : null}
      </Group>

      <SimpleGrid cols={1} spacing="sm">
        {visibleItems.map((item) => (
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
                <FeaturedPlaceMedia image={item.image} title={item.title} />
              </AspectRatio>

              <Stack gap={8} justify="center" style={{ minWidth: 0, flex: 1 }}>
                <Group gap={8} wrap="wrap">
                  {item.tag ? <Badge color="baramizGold">{item.tag}</Badge> : null}
                </Group>

                <Title
                  order={3}
                  ff='"Cormorant Garamond", serif'
                  size="1.35rem"
                  c="baramizInk.8"
                  style={{ lineHeight: 1.04 }}
                >
                  <Text component="span" inherit lineClamp={2} style={{ textWrap: "balance" }}>
                    {item.title}
                  </Text>
                </Title>

                <Group gap={12} wrap="wrap">
                  {item.location ? (
                    <Group gap={5}>
                      <MapPin size={14} />
                      <Text size="xs" c="dark.4">
                        {item.location}
                      </Text>
                    </Group>
                  ) : null}
                </Group>
              </Stack>
            </Group>
          </Card>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
