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
  image,
  primaryAction,
  secondaryAction,
  backgroundVariant = "dark",
}: HeroCardProps) {
  const backgroundStyle = image
    ? {
        backgroundImage: `linear-gradient(180deg, rgba(17, 20, 24, 0.14) 0%, rgba(17, 20, 24, 0.76) 100%), url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {
        background: backgroundVariants[backgroundVariant],
      };

  return (
    <Paper
      radius={28}
      p="lg"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: 274,
        ...backgroundStyle,
      }}
    >
      <Box
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(9, 11, 14, 0.02) 0%, rgba(9, 11, 14, 0.2) 42%, rgba(9, 11, 14, 0.82) 100%)",
        }}
      />
      <Box
        style={{
          position: "absolute",
          top: -18,
          right: -10,
          width: 126,
          height: 126,
          borderRadius: 40,
          background: "rgba(255,255,255,0.08)",
        }}
      />

      <Overlay
        gradient="linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(15, 15, 15, 0.02) 34%, rgba(15, 15, 15, 0.18) 100%)"
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
            <Title
              order={1}
              c="white"
              maw={260}
              size="2.25rem"
              style={{ lineHeight: 0.95, letterSpacing: "-0.04em" }}
            >
              {title}
            </Title>
            <Text c="rgba(255,255,255,0.82)" size="sm" maw={280} lineClamp={2} style={{ lineHeight: 1.45 }}>
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
