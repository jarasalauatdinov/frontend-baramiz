import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Group, Loader, Paper, Stack, Text } from "@mantine/core";
import { AudioPlayButton } from "./AudioPlayButton";

interface TranslationResultCardProps {
  accent: string;
  animateOnFirstResult?: boolean;
  emphasis?: "primary" | "secondary";
  error?: string;
  isAudioLoading?: boolean;
  isLoading?: boolean;
  placeholder: string;
  sourceLabel: string;
  sourceText?: string;
  targetLabel: string;
  targetLanguageLabel: string;
  translatedText: string;
  onPlay: () => void;
}

export function TranslationResultCard({
  accent,
  animateOnFirstResult = false,
  emphasis = "primary",
  error,
  isAudioLoading,
  isLoading,
  placeholder,
  sourceLabel,
  sourceText,
  targetLabel,
  targetLanguageLabel,
  translatedText,
  onPlay,
}: TranslationResultCardProps) {
  const isPrimary = emphasis === "primary";
  const hasSourceText = Boolean(sourceText?.trim());
  const hasTranslatedText = Boolean(translatedText.trim());
  const previousHasTranslatedText = useRef(hasTranslatedText);
  const hasAnimatedResult = useRef(false);
  const [isRevealing, setIsRevealing] = useState(false);

  useEffect(() => {
    const hadTranslation = previousHasTranslatedText.current;
    previousHasTranslatedText.current = hasTranslatedText;

    if (!animateOnFirstResult || hasAnimatedResult.current || hadTranslation || !hasTranslatedText) {
      return;
    }

    hasAnimatedResult.current = true;
    setIsRevealing(true);

    const timeoutId = window.setTimeout(() => {
      setIsRevealing(false);
    }, 560);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [animateOnFirstResult, hasTranslatedText]);

  return (
    <Paper
      className={`suyle-ai-thread-card${isPrimary ? " is-primary" : " is-secondary"}${isRevealing ? " is-revealing" : ""}`}
      radius={isPrimary ? 24 : 20}
      p={isPrimary ? 16 : 14}
      shadow={isPrimary ? "sm" : "xs"}
      style={{
        "--suyle-accent": accent,
      } as CSSProperties}
    >
      <Stack gap={isPrimary ? 12 : 10}>
        <div>
          <Text className="suyle-ai-thread-card__eyebrow" span>
            {targetLabel}
          </Text>
          <Text c="dimmed" mt={4} size="xs">
            {targetLanguageLabel}
          </Text>
        </div>

        <Stack gap={8}>
          {hasSourceText ? (
            <div className="suyle-ai-thread-card__message suyle-ai-thread-card__message--source">
              <Text c="dimmed" fw={700} size="xs">
                {sourceLabel}
              </Text>
              <div className="suyle-ai-thread-card__bubble suyle-ai-thread-card__bubble--source">
                <Text size={isPrimary ? "sm" : "xs"} style={{ lineHeight: 1.55, whiteSpace: "pre-wrap" }}>
                  {sourceText}
                </Text>
              </div>
            </div>
          ) : null}

          <div className="suyle-ai-thread-card__message suyle-ai-thread-card__message--translated">
            <Text c="dimmed" fw={700} size="xs">
              {targetLabel}
            </Text>
            <div className="suyle-ai-thread-card__bubble suyle-ai-thread-card__bubble--translated">
              {isLoading ? (
                <Group gap="sm" wrap="nowrap">
                  <Loader color={accent} size={16} />
                  <Text size="sm">Translating...</Text>
                </Group>
              ) : hasTranslatedText ? (
                <Text
                  fw={isPrimary ? 700 : 600}
                  size={isPrimary ? "1.08rem" : "0.96rem"}
                  style={{
                    lineHeight: isPrimary ? 1.5 : 1.55,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {translatedText}
                </Text>
              ) : (
                <Text c="dimmed" size={isPrimary ? "sm" : "xs"} style={{ lineHeight: 1.6 }}>
                  {placeholder}
                </Text>
              )}
            </div>
          </div>
        </Stack>

        <Group justify="space-between" wrap="wrap">
          <AudioPlayButton disabled={!hasTranslatedText || isLoading} isLoading={isAudioLoading} onClick={onPlay} />
        </Group>

        {error ? (
          <Text c="red" size="xs">
            {error}
          </Text>
        ) : null}
      </Stack>
    </Paper>
  );
}
