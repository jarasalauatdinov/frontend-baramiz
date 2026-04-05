import { ArrowUpRight } from "lucide-react";
import { AspectRatio, Badge, Box, Card, Group, Overlay, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { CityCardItem } from "@/entities/city/model/types";

interface CityCardProps {
  city: CityCardItem;
}

export function CityCard({ city }: CityCardProps) {
  return (
    <Card
      component={Link}
      to={city.href}
      padding={0}
      radius={28}
      shadow="md"
      style={{
        width: 250,
        overflow: "hidden",
        background: "#1d2023",
        color: "#fff",
      }}
    >
      <AspectRatio ratio={4 / 5}>
        <Box pos="relative">
          <Box
            component="img"
            src={city.image}
            alt={city.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Overlay
            gradient="linear-gradient(180deg, rgba(15, 15, 15, 0.05) 10%, rgba(15, 15, 15, 0.84) 100%)"
            opacity={1}
          />
          <Stack justify="space-between" h="100%" p="lg" style={{ position: "absolute", inset: 0 }}>
            <Group justify="space-between" align="flex-start">
              {city.meta ? (
                <Badge
                  color="dark"
                  variant="filled"
                  radius="xl"
                  styles={{ root: { backgroundColor: "rgba(255,255,255,0.14)", color: "#fff" } }}
                >
                  {city.meta}
                </Badge>
              ) : (
                <span />
              )}
              <Badge
                color="baramizGold"
                variant="filled"
                radius="xl"
                rightSection={<ArrowUpRight size={14} />}
                styles={{ root: { backgroundColor: "rgba(250, 204, 21, 0.22)", color: "#fff" } }}
              >
                Baramiz
              </Badge>
            </Group>

            <Stack gap={6}>
              <Title order={3} c="white" ff='"Cormorant Garamond", serif' size="2rem">
                {city.name}
              </Title>
              <Text c="rgba(255,255,255,0.82)" size="sm" maw={210}>
                {city.descriptor}
              </Text>
            </Stack>
          </Stack>
        </Box>
      </AspectRatio>
    </Card>
  );
}
