import type { SuyleAILanguage } from "@/features/suyle-ai/shared-conversation/model/types";

const SYNTHESIS_LOCALES: Record<SuyleAILanguage, string[]> = {
  en: ["en-US", "en-GB", "en"],
  kaa_cyrl: ["kk-KZ", "uz-UZ", "ru-RU"],
  kaa_latn: ["uz-UZ", "kk-KZ", "tr-TR"],
  ru: ["ru-RU", "ru"],
  tr: ["tr-TR", "tr"],
  uz: ["uz-UZ", "uz"],
};

function getSpeechSynthesis() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.speechSynthesis ?? null;
}

function pickVoice(voices: SpeechSynthesisVoice[], language: SuyleAILanguage) {
  const preferredLocales = SYNTHESIS_LOCALES[language];

  for (const locale of preferredLocales) {
    const exactMatch = voices.find((voice) => voice.lang.toLowerCase() === locale.toLowerCase());
    if (exactMatch) {
      return exactMatch;
    }

    const prefixMatch = voices.find((voice) => voice.lang.toLowerCase().startsWith(locale.slice(0, 2).toLowerCase()));
    if (prefixMatch) {
      return prefixMatch;
    }
  }

  return voices[0] ?? null;
}

export async function speakText(params: { language: SuyleAILanguage; text: string }) {
  const synthesis = getSpeechSynthesis();
  if (!synthesis || typeof SpeechSynthesisUtterance === "undefined") {
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(params.text);
  const voices = synthesis.getVoices();
  const selectedVoice = pickVoice(voices, params.language);

  utterance.lang = selectedVoice?.lang || SYNTHESIS_LOCALES[params.language][0];
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }

  synthesis.cancel();

  await new Promise<void>((resolve, reject) => {
    utterance.onend = () => resolve();
    utterance.onerror = () => reject(new Error("Speech synthesis failed."));
    synthesis.speak(utterance);
  });

  return true;
}
