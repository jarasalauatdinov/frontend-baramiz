import { useMemo } from "react";
import type { SuyleAIStore } from "@/features/suyle-ai/shared-conversation/model/useSuyleAIStore";

export function useLocalReply(store: SuyleAIStore) {
  return useMemo(() => ({
    error: store.errors.local,
    isAudioLoading: store.isLocalAudioLoading,
    isListening: store.isLocalListening,
    isLoading: store.isLocalLoading,
    localScript: store.localSourceScript,
    recordingSupported: store.voiceSupport.recordingSupported,
    targetLanguage: store.localReplyTargetLanguage,
    translatedText: store.localTranslatedText,
    value: store.localInput,
    onChange: store.setLocalInput,
    onLocalScriptChange: store.setLocalSourceScript,
    onPlayAudio: store.playLocalAudio,
    onTargetLanguageChange: store.setLocalReplyTargetLanguage,
    onToggleListening: store.toggleLocalListening,
    onTranslate: store.translateLocalMessage,
  }), [store]);
}
