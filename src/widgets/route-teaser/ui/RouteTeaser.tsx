import { Badge, Paper, Stack, Text, Title } from "@mantine/core";
import { GenerateRouteButton } from "@/features/generate-route-button";
import { useI18n } from "@/shared/i18n/provider";

export function RouteTeaser() {
  const { t } = useI18n();

  return (
    <Paper
      radius={30}
      p="xl"
      style={{
        background:
          "radial-gradient(circle at top right, rgba(235, 151, 16, 0.22), transparent 30%), linear-gradient(145deg, #1e2936 0%, #2b3d4c 100%)",
        color: "#fff",
      }}
    >
      <Stack gap="md">
        <Stack gap={6}>
          <Badge size="md" radius="xl" color="baramizGold" style={{ width: "fit-content" }}>
            {t("home.route.eyebrow")}
          </Badge>
          <Title order={2} c="white" maw={260}>
            {t("home.route.title")}
          </Title>
          <Text c="rgba(255,255,255,0.8)" size="sm" maw={300}>
            {t("home.route.copy")}
          </Text>
        </Stack>

        <GenerateRouteButton label={t("home.route.cta")} color="baramizGold" fullWidth />
      </Stack>
    </Paper>
  );
}
