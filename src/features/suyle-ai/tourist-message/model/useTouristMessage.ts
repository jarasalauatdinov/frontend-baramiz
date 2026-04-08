import { useMemo } from "react";
import type { SuyleAIStore } from "@/features/suyle-ai/shared-conversation/model/useSuyleAIStore";

export function useTouristMessage(store: SuyleAIStore) {
  return useMemo(() => ({
    error: store.errors.tourist,
    isAudioLoading: store.isTouristAudioLoading,
    isListening: store.isTouristListening,
    isLoading: store.isTouristLoading,
    language: store.touristLanguage,
    localScript: store.targetLocalScript,
    recordingSupported: store.voiceSupport.recordingSupported,
    translatedText: store.touristTranslatedText,
    value: store.touristInput,
    onChange: store.setTouristInput,
    onLanguageChange: store.setTouristLanguage,
    onLocalScriptChange: store.setTargetLocalScript,
    onPlayAudio: store.playTouristAudio,
    onToggleListening: store.toggleTouristListening,
    onTranslate: store.translateTouristMessage,
  }), [store]);
}
