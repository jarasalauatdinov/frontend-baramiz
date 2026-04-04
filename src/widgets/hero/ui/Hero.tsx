import { Button, Group, Overlay, Paper, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { HeroCardProps } from "@/shared/types/home";

const backgroundVariants: Record<NonNullable<HeroCardProps["backgroundVariant"]>, string> = {
  blue: "linear-gradient(145deg, #20384a 0%, #2c4f67 100%)",
  teal: "linear-gradient(145deg, #17463f 0%, #28655d 100%)",
  dark: "linear-gradient(145deg, #1c1f24 0%, #2a2f36 100%)",
};

export function HeroCard({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  backgroundVariant = "dark",
}: HeroCardProps) {
  return (
    <Paper
      radius={32}
      p="xl"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 320,
        background: backgroundVariants[backgroundVariant],
      }}
    >
      <Overlay
        gradient="linear-gradient(180deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 15, 15, 0.08) 36%, rgba(15, 15, 15, 0.18) 100%)"
        opacity={1}
      />

      <Stack justify="flex-end" h="100%" style={{ position: "relative", zIndex: 1 }}>
        <Stack gap="sm" pt={2}>
          <Text
            span
            fw={800}
            size="xs"
            tt="uppercase"
            style={{
              width: "fit-content",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.8)",
              padding: "6px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.14)",
              background: "rgba(255,255,255,0.08)",
            }}
          >
            {badge}
          </Text>

          <Stack gap="sm">
            <Title order={1} c="white" maw={220}>
              {title}
            </Title>
            <Text c="rgba(255,255,255,0.82)" size="sm" maw={248}>
              {description}
            </Text>
          </Stack>

          <Group gap="sm" wrap="wrap">
            <Button component={Link} to={primaryAction.to} color="baramizGold" leftSection={primaryAction.icon}>
              {primaryAction.label}
            </Button>
            {secondaryAction ? (
              <Button
                component={Link}
                to={secondaryAction.to}
                variant="white"
                color="gray"
                leftSection={secondaryAction.icon}
              >
                {secondaryAction.label}
              </Button>
            ) : null}
          </Group>
        </Stack>
      </Stack>
    </Paper>
  );
}
