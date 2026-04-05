import { Building2, CarTaxiFront, CreditCard, Hotel, MapPinned, Pill, Stethoscope, Utensils } from "lucide-react";
import { ActionIcon, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

const previewItems = [
  {
    id: "hotels",
    labelKey: "home.services.preview.hotel",
    href: "/service/hotels",
    icon: Hotel,
    tone: "#fbf1df",
    accent: "#7a4e12",
  },
  {
    id: "restaurants",
    labelKey: "home.services.preview.restaurant",
    href: "/service/restaurants",
    icon: Utensils,
    tone: "#eef7f4",
    accent: "#165247",
  },
  {
    id: "pharmacies",
    labelKey: "home.services.preview.pharmacy",
    href: "/service/pharmacies",
    icon: Pill,
    tone: "#f3ecde",
    accent: "#6b4b19",
  },
  {
    id: "atms",
    labelKey: "home.services.preview.atm",
    href: "/service/atms",
    icon: CreditCard,
    tone: "#edf2f7",
    accent: "#23415f",
  },
  {
    id: "taxi",
    labelKey: "home.services.preview.taxi",
    href: "/service/taxi",
    icon: CarTaxiFront,
    tone: "#fff2cf",
    accent: "#6c4300",
  },
  {
    id: "museums",
    labelKey: "home.services.preview.museum",
    href: "/service/museums-and-exhibitions",
    icon: Building2,
    tone: "#e8f3ef",
    accent: "#165247",
  },
] as const;

const nearbyItems = [
  {
    id: "pharmacy",
    labelKey: "home.utility.pharmacy",
    href: "/service/pharmacies",
    icon: Pill,
  },
  {
    id: "hospital",
    labelKey: "home.utility.hospital",
    href: "/service/hospitals",
    icon: Stethoscope,
  },
  {
    id: "atm",
    labelKey: "home.utility.atm",
    href: "/service/atms",
    icon: MapPinned,
  },
] as const;

export function ServicePreviewSection() {
  const { t } = useI18n();

  return (
    <Stack gap="sm">
      <Group justify="space-between" align="center">
        <Title order={2} size="h4">
          {t("home.services.title")}
        </Title>
        <Text component={Link} to="/service" size="sm" fw={700} c="baramizInk.6">
          {t("home.viewAll")}
        </Text>
      </Group>
      <SimpleGrid cols={3} spacing="sm" verticalSpacing="sm">
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
                minHeight: 88,
              }}
            >
              <Stack justify="space-between" h="100%" gap="sm">
                <ActionIcon variant="white" color="dark" radius="xl" size={30}>
                  <Icon size={16} />
                </ActionIcon>
                <Text fw={800} size="xs" lineClamp={2} style={{ lineHeight: 1.15 }}>
                  {t(item.labelKey)}
                </Text>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}

export function NearbyUtilityStrip() {
  const { t } = useI18n();

  return (
    <Stack gap="xs">
      <Title order={2} size="h5">
        {t("home.utility.title")}
      </Title>
      <SimpleGrid cols={3} spacing="sm">
        {nearbyItems.map((item) => {
          const Icon = item.icon;

          return (
            <Paper
              key={item.id}
              component={Link}
              to={item.href}
              radius={18}
              p="sm"
              style={{
                textDecoration: "none",
                background: "#fff8ea",
                color: "#5f4420",
                minHeight: 72,
              }}
            >
              <Stack gap={8} justify="center" h="100%" align="flex-start">
                <ActionIcon variant="white" color="dark" radius="xl" size={28}>
                  <Icon size={15} />
                </ActionIcon>
                <Text fw={700} size="xs" lineClamp={2} style={{ lineHeight: 1.1 }}>
                  {t(item.labelKey)}
                </Text>
              </Stack>
            </Paper>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
