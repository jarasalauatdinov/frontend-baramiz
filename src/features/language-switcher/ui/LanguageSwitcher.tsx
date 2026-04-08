import { Check, ChevronDown, Languages } from "lucide-react";
import { Group, Menu, Text, UnstyledButton } from "@mantine/core";
import { useI18n } from "@/shared/i18n/provider";

interface LanguageSwitcherProps {
  iconOnly?: boolean;
}

export function LanguageSwitcher({ iconOnly = false }: LanguageSwitcherProps) {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <Menu withinPortal={false} shadow="md" radius="xl" position="bottom-end" offset={8}>
      <Menu.Target>
        <UnstyledButton
          aria-label={t("header.languageAria")}
          className={`language-switcher language-switcher__trigger${iconOnly ? " language-switcher--icon-only" : ""}`}
        >
          <span
            className="language-switcher__icon"
            aria-hidden="true"
          >
            <Languages size={18} />
          </span>
          {!iconOnly ? (
            <>
              <Text className="language-switcher__value" fw={800}>
                {t(`language.short.${language}`)}
              </Text>
              <ChevronDown size={16} />
            </>
          ) : null}
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown
        style={{
          background: "var(--baramiz-color-surface-elevated)",
          border: "1px solid var(--baramiz-color-border-soft)",
          boxShadow: "var(--baramiz-shadow-md)",
          minWidth: 132,
          padding: 6,
        }}
      >
        {languages.map((option) => (
          <Menu.Item
            key={option}
            onClick={() => setLanguage(option)}
            rightSection={option === language ? <Check size={14} /> : undefined}
            styles={{
              item: {
                borderRadius: "var(--baramiz-radius-lg)",
                minHeight: "var(--baramiz-layout-touch-target-min)",
                fontWeight: 700,
                paddingBlock: 10,
              },
            }}
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
