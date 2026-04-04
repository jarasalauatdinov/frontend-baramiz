import { ActionIcon, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import type { QuickActionRowProps } from "@/shared/types/home";

const actionTones = [
  { background: "linear-gradient(155deg, #f7e1b1 0%, #efbe63 100%)", color: "#5f3912" },
  { background: "linear-gradient(155deg, #edf2f7 0%, #dbe5ef 100%)", color: "#233f5a" },
  { background: "linear-gradient(155deg, #e3f2ec 0%, #cfe8df 100%)", color: "#165247" },
  { background: "linear-gradient(155deg, #f8f0df 0%, #efdfbf 100%)", color: "#694818" },
] as const;

export function QuickActionRow({ items }: QuickActionRowProps) {
  return (
    <SimpleGrid cols={2} spacing="sm">
      {items.map((item, index) => {
        const tone = actionTones[index % actionTones.length];

        return (
          <Paper
            key={item.id}
            component={Link}
            to={item.to}
            radius={24}
            p="md"
            style={{
              textDecoration: "none",
              background: tone.background,
              color: tone.color,
              minHeight: 108,
            }}
          >
            <Stack justify="space-between" h="100%">
              <ActionIcon variant="white" color="dark" radius="xl" size={38}>
                {item.icon}
              </ActionIcon>
              <Stack gap={2}>
                <Text fw={800} size="sm" maw={92}>
                  {item.label}
                </Text>
                {item.subtitle ? (
                  <Text size="xs" c="inherit" style={{ opacity: 0.72 }} lineClamp={2}>
                    {item.subtitle}
                  </Text>
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}
