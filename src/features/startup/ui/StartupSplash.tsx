import { Box, Stack, Text, Title } from "@mantine/core";
import { Luggage } from "lucide-react";

export function StartupSplash() {
  return (
    <Box
      style={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(232, 137, 58, 0.14), transparent 34%), linear-gradient(180deg, var(--bg) 0%, var(--baramiz-color-bg-subtle) 100%)",
      }}
    >
      <Stack
        align="center"
        justify="center"
        gap={18}
        style={{
          width: "100%",
          maxWidth: "var(--app-max-width)",
          minHeight: "100dvh",
          padding: "max(20px, env(safe-area-inset-top, 0px)) 20px max(20px, env(safe-area-inset-bottom, 0px))",
        }}
      >
        <Box
          aria-hidden="true"
          style={{
            width: 78,
            height: 78,
            borderRadius: 26,
            display: "grid",
            placeItems: "center",
            background:
              "radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent 34%), linear-gradient(180deg, var(--baramiz-color-brand-300) 0%, var(--accent) 58%, var(--accent-strong) 100%)",
            color: "white",
            boxShadow: "0 20px 38px var(--accent-glow)",
          }}
        >
          <Luggage size={32} strokeWidth={2.1} />
        </Box>

        <Stack gap={8} align="center">
          <Title
            order={1}
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: "clamp(2.4rem, 10vw, 3.1rem)",
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: "var(--text)",
            }}
          >
            Baramiz
          </Title>
          <Text
            ta="center"
            c="var(--text-secondary)"
            style={{
              fontSize: "var(--font-size-body-sm)",
              lineHeight: "var(--line-height-body-sm)",
              maxWidth: 220,
            }}
          >
            Travel Karakalpakstan with clarity from the first tap.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
