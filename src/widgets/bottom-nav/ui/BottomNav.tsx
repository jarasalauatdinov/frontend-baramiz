import { Compass, Home, Languages, Sparkles, User } from "lucide-react";
import { Box, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

const tabs = [
  { labelKey: "tabs.home", to: "/", icon: Home },
  { labelKey: "tabs.service", to: "/service", icon: Compass },
  { labelKey: "tabs.route", to: "/route", icon: Sparkles },
  { labelKey: "tabs.suyle", to: "/suyle-ai", icon: Languages },
  { labelKey: "tabs.profile", to: "/profile", icon: User },
] as const;

export function BottomNav() {
  const { t } = useI18n();

  return (
    <Paper
      radius={30}
      px={8}
      py={8}
      shadow="xl"
      withBorder={false}
      aria-label={t("navigation.mainAria")}
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(calc(100% - 24px), 392px)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)",
        background: "var(--baramiz-color-surface-elevated)",
        backdropFilter: "blur(18px)",
        border: "1px solid var(--baramiz-color-border-soft)",
        boxShadow: "var(--baramiz-shadow-floating)",
        zIndex: 30,
      }}
    >
      <Group grow gap={4} wrap="nowrap">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            style={{ textDecoration: "none", minWidth: 0 }}
          >
            {({ isActive }) => (
              <Box
                py={6}
                px={2}
                style={{
                  borderRadius: 24,
                  background: isActive ? "var(--baramiz-color-accent-soft)" : "transparent",
                  transition: "background 0.2s ease",
                }}
              >
                <Stack align="center" gap={5}>
                  <ThemeIcon
                    variant={isActive ? "filled" : "light"}
                    color={isActive ? "baramizGold" : "gray"}
                    size={38}
                    radius="xl"
                    styles={{
                      root: {
                        minWidth: "var(--baramiz-layout-touch-target-min)",
                        minHeight: "var(--baramiz-layout-touch-target-min)",
                        background: isActive ? "var(--baramiz-color-brand-500)" : "var(--baramiz-color-surface-primary)",
                        border: isActive ? "none" : "1px solid var(--baramiz-color-border-soft)",
                        boxShadow: isActive ? "0 10px 22px var(--baramiz-color-accent-glow)" : "none",
                      },
                    }}
                  >
                    <tab.icon size={18} />
                  </ThemeIcon>
                  <Text
                    size="xs"
                    fw={isActive ? 800 : 600}
                    c={isActive ? "var(--baramiz-color-text-primary)" : "var(--baramiz-color-text-muted)"}
                    truncate
                  >
                    {t(tab.labelKey)}
                  </Text>
                </Stack>
              </Box>
            )}
          </NavLink>
        ))}
      </Group>
    </Paper>
  );
}
