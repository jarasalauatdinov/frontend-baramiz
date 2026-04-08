import { Button, Group, Paper, Stack, Text, Textarea } from "@mantine/core";
import {
  LANGUAGE_LABELS,
  TOURIST_LANGUAGE_OPTIONS,
  type TouristLanguage,
} from "@/features/suyle-ai/shared-conversation/model/types";
import { LanguageSelect } from "@/features/suyle-ai/shared-conversation/ui/LanguageSelect";
import { TranslationResultCard } from "@/features/suyle-ai/shared-conversation/ui/TranslationResultCard";
import { VoiceInputButton } from "@/features/suyle-ai/shared-conversation/ui/VoiceInputButton";

interface LocalReplyCardProps {
  error?: string;
  isAudioLoading: boolean;
  isListening: boolean;
  isLoading: boolean;
  recordingSupported: boolean;
  targetLanguage: TouristLanguage;
  translatedText: string;
  value: string;
  onChange: (value: string) => void;
  onPlayAudio: () => void;
  onTargetLanguageChange: (value: TouristLanguage) => void;
  onToggleListening: () => void;
  onTranslate: (value?: string) => void;
}

export function LocalReplyCard({
  error,
  isAudioLoading,
  isListening,
  isLoading,
  recordingSupported,
  targetLanguage,
  translatedText,
  value,
  onChange,
  onPlayAudio,
  onTargetLanguageChange,
  onToggleListening,
  onTranslate,
}: LocalReplyCardProps) {
  return (
    <Paper className="suyle-ai-card suyle-ai-card--secondary" radius={22} p={14} shadow="xs">
      <Stack gap={12}>
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div>
            <Text className="suyle-ai-card__eyebrow suyle-ai-card__eyebrow--teal" span>
              Local replies
            </Text>
            <Text c="dimmed" mt={4} size="sm">
              Let the local person speak or type, then translate it back for you.
            </Text>
          </div>
        </Group>

        <Group align="end" gap={8} grow>
          <LanguageSelect
            compact
            ariaLabel="Translate local reply into"
            data={TOURIST_LANGUAGE_OPTIONS}
            label="Translate into"
            value={targetLanguage}
            onChange={onTargetLanguageChange}
          />
          <VoiceInputButton
            disabled={!recordingSupported || isLoading}
            idleLabel="Reply by voice"
            isListening={isListening}
            onClick={onToggleListening}
          />
        </Group>

        <Textarea
          autosize
          maxRows={4}
          minRows={2}
          placeholder="The local person can type here..."
          radius={18}
          size="sm"
          styles={{
            input: {
              background: "rgba(255, 255, 255, 0.96)",
              border: "1px solid rgba(15, 23, 42, 0.08)",
              lineHeight: 1.55,
              minHeight: 78,
              padding: "12px 14px",
            },
          }}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />

        <Button
          color="teal"
          fullWidth
          loading={isLoading}
          radius="xl"
          size="sm"
          styles={{
            root: {
              fontWeight: 700,
              minHeight: 44,
            },
          }}
          onClick={() => onTranslate()}
        >
          Translate back
        </Button>

        {error ? (
          <Text c="red" size="xs">
            {error}
          </Text>
        ) : null}

        <TranslationResultCard
          accent="#0f766e"
          emphasis="secondary"
          isAudioLoading={isAudioLoading}
          isLoading={isLoading}
          placeholder="The translated reply will appear here."
          sourceLabel="Local"
          sourceText={value}
          targetLabel="For tourist"
          targetLanguageLabel={LANGUAGE_LABELS[targetLanguage]}
          translatedText={translatedText}
          onPlay={onPlayAudio}
        />
      </Stack>
    </Paper>
  );
}
