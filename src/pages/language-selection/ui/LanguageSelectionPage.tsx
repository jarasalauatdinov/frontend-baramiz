import { Box, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Globe, Luggage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageSelectionOptions, readStoredLanguage } from "@/features/language-switcher";
import { useI18n } from "@/shared/i18n/provider";
import type { Language } from "@/shared/types/api";

const instructionLine = "Choose your language / Tildi tańlań / Tilni tanlang / Выберите язык";

export function LanguageSelectionPage() {
  const navigate = useNavigate();
  const { language, setLanguage } = useI18n();
  const selectedLanguage = readStoredLanguage() ?? language;

  function handleLanguageSelect(nextLanguage: Language) {
    setLanguage(nextLanguage);
    navigate("/onboarding", { replace: true });
  }

  return (
    <Box
      style={{
        minHeight: "100dvh",
        background:
          "radial-gradient(circle at top, rgba(232, 137, 58, 0.12), transparent 34%), linear-gradient(180deg, var(--bg) 0%, var(--baramiz-color-bg-subtle) 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        gap={20}
        style={{
          width: "100%",
          maxWidth: "var(--app-max-width)",
          minHeight: "100dvh",
          padding: "max(12px, env(safe-area-inset-top, 0px)) 16px max(24px, calc(env(safe-area-inset-bottom, 0px) + 16px))",
        }}
      >
        <Group justify="space-between" align="center" style={{ minHeight: "var(--header-height)" }}>
          <Box
            aria-hidden="true"
            style={{
              width: "var(--touch-target-min)",
              height: "var(--touch-target-min)",
              borderRadius: "var(--radius-md)",
              display: "grid",
              placeItems: "center",
              background: "color-mix(in srgb, var(--bg-card) 92%, transparent)",
              border: "1px solid var(--line)",
              boxShadow: "var(--shadow-xs)",
              color: "var(--text-secondary)",
            }}
          >
            <Globe size={18} />
          </Box>

          <Box aria-hidden="true" style={{ width: "var(--touch-target-min)", height: "var(--touch-target-min)" }} />
        </Group>

        <Stack gap={18} align="center" justify="center" style={{ flex: 1 }}>
          <Stack gap={14} align="center" style={{ width: "100%" }}>
            <Box
              aria-hidden="true"
              style={{
                width: 72,
                height: 72,
                borderRadius: 24,
                display: "grid",
                placeItems: "center",
                background:
                  "radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent 34%), linear-gradient(180deg, var(--baramiz-color-brand-300) 0%, var(--accent) 56%, var(--accent-strong) 100%)",
                color: "white",
                boxShadow: "0 18px 34px var(--accent-glow)",
              }}
            >
              <Luggage size={30} strokeWidth={2.1} />
            </Box>

            <Stack gap={8} align="center">
              <Title
                order={1}
                style={{
                  fontFamily: '"Cormorant Garamond", serif',
                  fontSize: "clamp(2.2rem, 10vw, 3rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.04em",
                  color: "var(--text)",
                  textAlign: "center",
                }}
              >
                Baramiz
              </Title>
              <Text
                ta="center"
                c="var(--text-secondary)"
                style={{
                  maxWidth: 300,
                  fontSize: "var(--font-size-body-sm)",
                  lineHeight: "var(--line-height-body-sm)",
                  fontWeight: 600,
                }}
              >
                {instructionLine}
              </Text>
            </Stack>
          </Stack>

          <Paper
            radius={28}
            p="md"
            withBorder={false}
            style={{
              width: "100%",
              background: "color-mix(in srgb, var(--bg-card) 96%, transparent)",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--line)",
            }}
          >
            <Stack gap={12}>
              <Text
                c="var(--accent-strong)"
                style={{
                  fontSize: "var(--font-size-label)",
                  lineHeight: "var(--line-height-label)",
                  fontWeight: 800,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Language
              </Text>

              <LanguageSelectionOptions
                selectedLanguage={selectedLanguage}
                onSelect={handleLanguageSelect}
              />
            </Stack>
          </Paper>

          <Text
            ta="center"
            c="var(--text-muted)"
            style={{
              maxWidth: 280,
              fontSize: "var(--font-size-helper)",
              lineHeight: "var(--line-height-helper)",
            }}
          >
            You can change this later from the globe icon.
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
