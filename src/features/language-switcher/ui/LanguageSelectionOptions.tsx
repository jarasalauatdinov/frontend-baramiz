import { Check } from "lucide-react";
import { Badge, Group, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import type { Language } from "@/shared/types/api";

export interface LanguageSelectionOption {
  value: Language;
  label: string;
  code: string;
}

export const languageSelectionOptions: readonly LanguageSelectionOption[] = [
  { value: "en", label: "English", code: "EN" },
  { value: "kaa", label: "Qaraqalpaq", code: "KAA" },
  { value: "uz", label: "O'zbek", code: "UZ" },
  { value: "ru", label: "Русский", code: "RU" },
] as const;

interface LanguageSelectionOptionsProps {
  onSelect: (language: Language) => void;
  selectedLanguage?: Language | null;
  presentation?: "screen" | "sheet";
}

export function LanguageSelectionOptions({
  onSelect,
  selectedLanguage,
  presentation = "screen",
}: LanguageSelectionOptionsProps) {
  const isSheetPresentation = presentation === "sheet";

  return (
    <Stack gap={isSheetPresentation ? 8 : 10}>
      {languageSelectionOptions.map((option) => {
        const isSelected = option.value === selectedLanguage;

        return (
          <UnstyledButton
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            aria-label={option.label}
            onClick={() => onSelect(option.value)}
            style={{
              minHeight: isSheetPresentation ? "var(--touch-target-min)" : 68,
              padding: isSheetPresentation ? "12px 14px" : "16px 18px",
              borderRadius: "var(--radius-lg)",
              border: `1px solid ${isSelected ? "var(--accent)" : "var(--line)"}`,
              background: isSelected ? "var(--accent-soft)" : "var(--bg-card)",
              boxShadow: isSelected ? "0 10px 24px var(--accent-glow)" : "var(--shadow-xs)",
              transition: "transform 0.15s ease, box-shadow 0.18s ease, border-color 0.18s ease",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Group justify="space-between" align="center" wrap="nowrap" gap={12}>
              <Stack gap={2} style={{ minWidth: 0 }}>
                <Text
                  fw={800}
                  style={{
                    fontSize: isSheetPresentation ? "var(--font-size-body)" : "1.02rem",
                    lineHeight: isSheetPresentation ? "var(--line-height-body)" : 1.15,
                    color: "var(--text)",
                  }}
                >
                  {option.label}
                </Text>
              </Stack>

              <Group gap={10} wrap="nowrap">
                <Badge
                  radius="xl"
                  variant={isSelected ? "filled" : "light"}
                  color={isSelected ? "baramizGold" : "gray"}
                  styles={{
                    root: {
                      minHeight: isSheetPresentation ? 26 : 28,
                      minWidth: 50,
                      fontWeight: 800,
                      letterSpacing: "0.04em",
                    },
                  }}
                >
                  {option.code}
                </Badge>

                {isSelected ? (
                  <ThemeIcon
                    size={28}
                    radius="xl"
                    color="baramizGold"
                    variant="light"
                    aria-hidden="true"
                  >
                    <Check size={16} />
                  </ThemeIcon>
                ) : null}
              </Group>
            </Group>
          </UnstyledButton>
        );
      })}
    </Stack>
  );
}
