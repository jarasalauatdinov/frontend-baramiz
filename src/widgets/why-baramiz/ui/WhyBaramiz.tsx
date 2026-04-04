import { Languages, MapPinned, Route as RouteIcon, Sparkles } from "lucide-react";
import { Paper, SimpleGrid, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { useI18n } from "@/shared/i18n/provider";

const items = [
  { id: "route", titleKey: "home.why.route.title", copyKey: "home.why.route.copy", icon: RouteIcon },
  {
    id: "discovery",
    titleKey: "home.why.discovery.title",
    copyKey: "home.why.discovery.copy",
    icon: MapPinned,
  },
  { id: "language", titleKey: "home.why.language.title", copyKey: "home.why.language.copy", icon: Languages },
  { id: "decision", titleKey: "home.why.decision.title", copyKey: "home.why.decision.copy", icon: Sparkles },
] as const;

export function WhyBaramiz() {
  const { t } = useI18n();

  return (
    <Stack gap="md" pb={8}>
      <Title order={2}>{t("home.why.title")}</Title>
      <SimpleGrid cols={{ base: 2 }} spacing="sm">
        {items.map((item) => (
          <Paper key={item.id} radius={24} p="lg" shadow="md" style={{ background: "#fffdf8" }}>
            <Stack gap="sm">
              <ThemeIcon size={40} radius="xl" color="baramizGold" variant="light">
                <item.icon size={18} />
              </ThemeIcon>
              <Title order={3} size="h3">
                {t(item.titleKey)}
              </Title>
              <Text size="sm" c="dimmed">
                {t(item.copyKey)}
              </Text>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
