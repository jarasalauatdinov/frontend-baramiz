import { ActionIcon, Group, Paper, SimpleGrid, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import type { QuickActionRowProps } from "@/shared/types/home";

const actionTones = [
  { background: "#fff2cf", color: "#6c4300" },
  { background: "#e8f3ef", color: "#165247" },
  { background: "#e9eef6", color: "#23415f" },
  { background: "#f3ecde", color: "#6b4b19" },
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
            radius={22}
            p="sm"
            style={{
              textDecoration: "none",
              background: tone.background,
              color: tone.color,
              minHeight: 68,
            }}
          >
            <Group gap="sm" wrap="nowrap" align="center">
              <ActionIcon variant="white" color="dark" radius="xl" size={32}>
                {item.icon}
              </ActionIcon>
              <Text fw={800} size="sm" lineClamp={1} style={{ lineHeight: 1.1 }}>
                {item.label}
              </Text>
            </Group>
          </Paper>
        );
      })}
    </SimpleGrid>
  );
}
