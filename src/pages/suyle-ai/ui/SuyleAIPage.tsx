import { SimpleGrid, Stack } from "@mantine/core";
import { Languages } from "lucide-react";
import { useLocalReply } from "@/features/suyle-ai/local-reply/model/useLocalReply";
import { LocalReplyCard } from "@/features/suyle-ai/local-reply/ui/LocalReplyCard";
import {
  LANGUAGE_LABELS,
  LOCAL_LANGUAGE_OPTIONS,
  TOURIST_LANGUAGE_OPTIONS,
  type LocalLanguage,
  type TouristLanguage,
} from "@/features/suyle-ai/shared-conversation/model/types";
import { useSuyleAIStore } from "@/features/suyle-ai/shared-conversation/model/useSuyleAIStore";
import { LanguageSelect } from "@/features/suyle-ai/shared-conversation/ui/LanguageSelect";
import { TranslationResultCard } from "@/features/suyle-ai/shared-conversation/ui/TranslationResultCard";
import { useTouristMessage } from "@/features/suyle-ai/tourist-message/model/useTouristMessage";
import { TouristMessageCard } from "@/features/suyle-ai/tourist-message/ui/TouristMessageCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";

export function SuyleAIPage() {
  const store = useSuyleAIStore();
  const touristMessage = useTouristMessage(store);
  const localReply = useLocalReply(store);

  function handleTouristLanguageChange(value: TouristLanguage) {
    touristMessage.onLanguageChange(value);
    localReply.onTargetLanguageChange(value);
  }

  function handleLocalScriptChange(value: LocalLanguage) {
    touristMessage.onLocalScriptChange(value);
    localReply.onLocalScriptChange(value);
  }

  return (
    <>
      <AppHeader
        title={"S\u00f3yle AI"}
        utilityIcon={<Languages size={18} />}
        variant="title-center-utility"
      />
      <div className="screen suyle-ai-screen">
        <Stack gap={12}>
          <SimpleGrid cols={2} spacing={8}>
            <LanguageSelect
              compact
              ariaLabel="Tourist language"
              data={TOURIST_LANGUAGE_OPTIONS}
              label="Tourist"
              value={touristMessage.language}
              onChange={handleTouristLanguageChange}
            />
            <LanguageSelect
              compact
              ariaLabel="Local language"
              data={LOCAL_LANGUAGE_OPTIONS}
              label="For local"
              value={touristMessage.localScript}
              onChange={handleLocalScriptChange}
            />
          </SimpleGrid>

          <TouristMessageCard
            error={touristMessage.error}
            isListening={touristMessage.isListening}
            isLoading={touristMessage.isLoading}
            language={touristMessage.language}
            recordingSupported={touristMessage.recordingSupported}
            value={touristMessage.value}
            onChange={touristMessage.onChange}
            onToggleListening={touristMessage.onToggleListening}
            onTranslate={touristMessage.onTranslate}
          />

          <TranslationResultCard
            accent="#d97706"
            animateOnFirstResult
            emphasis="primary"
            isAudioLoading={touristMessage.isAudioLoading}
            isLoading={touristMessage.isLoading}
            placeholder="Your translation for the local person will appear here."
            sourceLabel="Tourist"
            sourceText={touristMessage.value}
            targetLabel="For local"
            targetLanguageLabel={LANGUAGE_LABELS[touristMessage.localScript]}
            translatedText={touristMessage.translatedText}
            onPlay={touristMessage.onPlayAudio}
          />

          <LocalReplyCard
            error={localReply.error}
            isAudioLoading={localReply.isAudioLoading}
            isListening={localReply.isListening}
            isLoading={localReply.isLoading}
            recordingSupported={localReply.recordingSupported}
            targetLanguage={localReply.targetLanguage}
            translatedText={localReply.translatedText}
            value={localReply.value}
            onChange={localReply.onChange}
            onPlayAudio={localReply.onPlayAudio}
            onTargetLanguageChange={localReply.onTargetLanguageChange}
            onToggleListening={localReply.onToggleListening}
            onTranslate={localReply.onTranslate}
          />
        </Stack>
      </div>
    </>
  );
}
