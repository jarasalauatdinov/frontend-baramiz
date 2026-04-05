import { Check, ChevronDown, Languages } from "lucide-react";
import { Button, Group, Menu, Text } from "@mantine/core";
import { useI18n } from "@/shared/i18n/provider";

export function LanguageSwitcher() {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <Menu withinPortal={false} shadow="md" radius="xl" position="bottom-end">
      <Menu.Target>
        <Button
          variant="subtle"
          color="dark"
          aria-label={t("header.languageAria")}
          leftSection={<Languages size={16} />}
          rightSection={<ChevronDown size={14} />}
          styles={{
            root: {
              minWidth: 76,
              paddingInline: 10,
            },
            label: {
              fontWeight: 700,
            },
          }}
        >
          {t(`language.short.${language}`)}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {languages.map((option) => (
          <Menu.Item
            key={option}
            onClick={() => setLanguage(option)}
            rightSection={option === language ? <Check size={14} /> : undefined}
          >
            <Group gap={8}>
              <Text fw={700}>{t(`language.short.${option}`)}</Text>
            </Group>
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
