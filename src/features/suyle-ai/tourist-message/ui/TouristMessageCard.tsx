import { Button, Group, Paper, Stack, Text, Textarea, UnstyledButton } from "@mantine/core";
import { BadgeHelp, Banknote, MapPin, MessageCircleHeart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { TouristLanguage } from "@/features/suyle-ai/shared-conversation/model/types";
import { VoiceInputButton } from "@/features/suyle-ai/shared-conversation/ui/VoiceInputButton";

interface TouristMessageCardProps {
  error?: string;
  isListening: boolean;
  isLoading: boolean;
  language: TouristLanguage;
  recordingSupported: boolean;
  value: string;
  onChange: (value: string) => void;
  onToggleListening: () => void;
  onTranslate: (value?: string) => void;
}

interface PhraseChip {
  icon: typeof MapPin;
  labels: Record<TouristLanguage, string>;
}

const COMMON_PHRASES: PhraseChip[] = [
  {
    icon: MapPin,
    labels: {
      en: "Where is this?",
      ru: "Где это?",
      tr: "Burası nerede?",
      uz: "Bu qayerda?",
    },
  },
  {
    icon: Banknote,
    labels: {
      en: "How much?",
      ru: "Сколько стоит?",
      tr: "Ne kadar?",
      uz: "Qancha turadi?",
    },
  },
  {
    icon: MessageCircleHeart,
    labels: {
      en: "Thank you",
      ru: "Спасибо",
      tr: "Teşekkür ederim",
      uz: "Rahmat",
    },
  },
  {
    icon: BadgeHelp,
    labels: {
      en: "I need help",
      ru: "Мне нужна помощь",
      tr: "Yardıma ihtiyacım var",
      uz: "Menga yordam kerak",
    },
  },
];

export function TouristMessageCard({
  error,
  isListening,
  isLoading,
  language,
  recordingSupported,
  value,
  onChange,
  onToggleListening,
  onTranslate,
}: TouristMessageCardProps) {
  const [activePhrase, setActivePhrase] = useState<string | null>(null);
  const resetPhraseFeedbackRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetPhraseFeedbackRef.current) {
        window.clearTimeout(resetPhraseFeedbackRef.current);
      }
    };
  }, []);

  function triggerPhrase(text: string) {
    onChange(text);
    onTranslate(text);
    setActivePhrase(text);

    if (resetPhraseFeedbackRef.current) {
      window.clearTimeout(resetPhraseFeedbackRef.current);
    }

    resetPhraseFeedbackRef.current = window.setTimeout(() => {
      setActivePhrase(null);
    }, 420);
  }

  return (
    <Paper className="suyle-ai-card suyle-ai-card--primary" radius={24} p={16} shadow="sm">
      <Stack gap={14}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text className="suyle-ai-card__eyebrow" span>
              Tourist says
            </Text>
            <Text c="dimmed" mt={4} size="sm">
              Start with your voice, then refine the text if needed.
            </Text>
          </div>
        </Group>

        <VoiceInputButton
          disabled={!recordingSupported || isLoading}
          isListening={isListening}
          variant="hero"
          onClick={onToggleListening}
        />

        <Stack gap={8}>
          <Text c="dimmed" fw={700} size="xs" tt="uppercase">
            Common phrases
          </Text>
          <div className="suyle-ai-phrase-grid">
            {COMMON_PHRASES.map((phrase) => {
              const Icon = phrase.icon;
              const text = phrase.labels[language];

              return (
                <UnstyledButton
                  key={text}
                  className={`suyle-ai-phrase-chip ${activePhrase === text ? "is-triggered" : ""}`}
                  onClick={() => triggerPhrase(text)}
                >
                  <span className="suyle-ai-phrase-chip__icon" aria-hidden="true">
                    <Icon size={15} />
                  </span>
                  <Text fw={700} size="sm">
                    {text}
                  </Text>
                </UnstyledButton>
              );
            })}
          </div>
        </Stack>

        <Stack gap={8}>
          <Text c="dimmed" fw={700} size="xs" tt="uppercase">
            Type instead
          </Text>
          <Textarea
            autosize
            maxRows={4}
            minRows={2}
            placeholder="Type if speaking is not possible..."
            radius={18}
            size="sm"
            styles={{
              input: {
                background: "rgba(255, 255, 255, 0.96)",
                border: "1px solid rgba(15, 23, 42, 0.08)",
                fontSize: "0.95rem",
                lineHeight: 1.55,
                minHeight: 82,
                padding: "14px 15px",
              },
            }}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
          />
        </Stack>

        <Button
          color="baramizGold"
          fullWidth
          loading={isLoading}
          radius="xl"
          size="md"
          styles={{
            root: {
              fontWeight: 800,
              minHeight: 48,
              boxShadow: "0 12px 24px rgba(217, 119, 6, 0.18)",
            },
          }}
          onClick={() => onTranslate()}
        >
          Translate
        </Button>

        {error ? (
          <Text c="red" size="xs">
            {error}
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
}
