import { ArrowRight, Hotel, MapPinned, Users } from "lucide-react";
import { ActionIcon, Badge, Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

const previewItems = [
  {
    id: "services",
    titleKey: "home.quick.services.title",
    badgeKey: "home.services.services.badge",
    href: "/service",
    icon: MapPinned,
    tone: "#eef7f4",
    accent: "#165247",
  },
  {
    id: "guides",
    titleKey: "home.quick.guides.title",
    badgeKey: "home.services.guides.badge",
    href: "/guides",
    icon: Users,
    tone: "#edf2f7",
    accent: "#1d3d57",
  },
  {
    id: "hotels",
    titleKey: "home.services.stays.title",
    badgeKey: "home.services.stays.badge",
    href: "/service/hotels",
    icon: Hotel,
    tone: "#fbf1df",
    accent: "#7a4e12",
  },
] as const;

export function ServicePreviewSection() {
  const { t } = useI18n();

  return (
    <Stack gap="md">
      <Title order={2}>{t("home.services.title")}</Title>
      <SimpleGrid cols={1} spacing="sm">
        {previewItems.map((item) => {
          const Icon = item.icon;

          return (
          <Paper
            key={item.id}
            component={Link}
            to={item.href}
            radius={22}
            p="md"
            style={{
              textDecoration: "none",
              background: item.tone,
              color: item.accent,
            }}
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon radius="xl" size={42} variant="white" color="dark">
                  <Icon size={18} />
                </ThemeIcon>
                <Stack gap={4}>
                  <Badge color="dark" variant="white" radius="xl" style={{ width: "fit-content" }}>
                    {t(item.badgeKey)}
                  </Badge>
                  <Text fw={800} size="sm">
                    {t(item.titleKey)}
                  </Text>
                </Stack>
              </Group>
              <ActionIcon variant="subtle" color="dark" radius="xl" aria-label={t("common.actions.browseAll")}>
                <ArrowRight size={16} />
              </ActionIcon>
            </Group>
          </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
