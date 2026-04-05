import { Box, Button, Overlay, Paper, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import type { HeroCardProps } from "@/shared/types/home";

const backgroundVariants: Record<NonNullable<HeroCardProps["backgroundVariant"]>, string> = {
  blue: "linear-gradient(145deg, #20384a 0%, #2c4f67 100%)",
  teal: "linear-gradient(145deg, #17463f 0%, #28655d 100%)",
  dark: "linear-gradient(145deg, #1f2630 0%, #2d3540 100%)",
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
      radius={28}
      p="md"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 216,
        background: backgroundVariants[backgroundVariant],
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: -26,
          right: -18,
          width: 118,
          height: 118,
          borderRadius: 36,
          background: "rgba(255,255,255,0.08)",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: -34,
          right: 26,
          width: 96,
          height: 96,
          borderRadius: 999,
          background: "rgba(212, 162, 62, 0.18)",
          filter: "blur(10px)",
        }}
      />

      <Overlay
        gradient="linear-gradient(180deg, rgba(255, 255, 255, 0.03) 0%, rgba(15, 15, 15, 0.06) 38%, rgba(15, 15, 15, 0.16) 100%)"
        opacity={1}
      />

      <Stack justify="space-between" h="100%" gap="lg" style={{ position: "relative", zIndex: 1 }}>
        <Stack gap="xs">
          <Text
            span
            fw={800}
            size="xs"
            tt="uppercase"
            style={{
              width: "fit-content",
              letterSpacing: "0.08em",
              color: "rgba(255,255,255,0.78)",
              padding: "5px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)",
            }}
          >
            {badge}
          </Text>

          <Stack gap={4}>
            <Title order={1} c="white" maw={220} size="1.95rem" style={{ lineHeight: 1.02 }}>
              {title}
            </Title>
            <Text c="rgba(255,255,255,0.8)" size="sm" maw={260} lineClamp={2} style={{ lineHeight: 1.3 }}>
              {description}
            </Text>
          </Stack>
        </Stack>

        <Stack gap="xs">
          <Button
            component={Link}
            to={primaryAction.to}
            color="baramizGold"
            leftSection={primaryAction.icon}
            radius="xl"
            size="sm"
            fullWidth
          >
            {primaryAction.label}
          </Button>
          {secondaryAction ? (
            <Button
              component={Link}
              to={secondaryAction.to}
              variant="white"
              color="gray"
              leftSection={secondaryAction.icon}
              radius="xl"
              size="sm"
              fullWidth
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
