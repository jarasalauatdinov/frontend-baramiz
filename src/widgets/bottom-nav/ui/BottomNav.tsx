import { Bookmark, Compass, Home, Route, User } from "lucide-react";
import { Box, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { NavLink } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

const tabs = [
  { labelKey: "tabs.home", to: "/", icon: Home },
  { labelKey: "tabs.service", to: "/service", icon: Compass },
  { labelKey: "tabs.route", to: "/route-generator", icon: Route },
  { labelKey: "tabs.saved", to: "/saved-booking", icon: Bookmark },
  { labelKey: "tabs.profile", to: "/profile", icon: User },
] as const;

export function BottomNav() {
  const { t } = useI18n();

  return (
    <Paper
      radius={24}
      px="xs"
      py={8}
      shadow="xl"
      withBorder={false}
      aria-label={t("navigation.mainAria")}
      style={{
        position: "fixed",
        bottom: 12,
        left: 0,
        right: 0,
        background: "rgba(255, 252, 247, 0.92)",
        backdropFilter: "blur(18px)",
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
                style={{
                  borderRadius: 20,
                  background: isActive ? "rgba(217, 119, 6, 0.12)" : "transparent",
                }}
              >
                <Stack align="center" gap={5}>
                  <ThemeIcon
                    variant={isActive ? "filled" : "light"}
                    color={isActive ? "baramizGold" : "gray"}
                    size={34}
                    radius="xl"
                  >
                    <tab.icon size={18} />
                  </ThemeIcon>
                  <Text size="xs" fw={isActive ? 800 : 600} c={isActive ? "baramizInk.8" : "dimmed"} truncate>
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
