export type TouristLanguage = "uz" | "ru" | "en" | "tr";
export type LocalLanguage = "kaa_latn" | "kaa_cyrl";
export type SuyleAILanguage = TouristLanguage | LocalLanguage;
export type TranslationDirection = "tourist_to_local" | "local_to_tourist";
export type AudioTarget = "tourist" | "local";

export interface LanguageOption<TValue extends string> {
  label: string;
  value: TValue;
}

export const TOURIST_LANGUAGE_OPTIONS: LanguageOption<TouristLanguage>[] = [
  { label: "O‘zbekcha", value: "uz" },
  { label: "Русский", value: "ru" },
  { label: "English", value: "en" },
  { label: "Türkçe", value: "tr" },
];

export const LOCAL_LANGUAGE_OPTIONS: LanguageOption<LocalLanguage>[] = [
  { label: "Qaraqalpaq (Latin)", value: "kaa_latn" },
  { label: "Qaraqalpaq (Cyrillic)", value: "kaa_cyrl" },
];

export const LANGUAGE_LABELS: Record<SuyleAILanguage, string> = {
  en: "English",
  kaa_cyrl: "Qaraqalpaq (Cyrillic)",
  kaa_latn: "Qaraqalpaq (Latin)",
  ru: "Русский",
  tr: "Türkçe",
  uz: "O‘zbekcha",
};

export interface TranslateTouristToLocalRequest {
  sourceLanguage: TouristLanguage;
  targetLocalScript: LocalLanguage;
  text: string;
}

export interface TranslateLocalToTouristRequest {
  sourceLocalScript: LocalLanguage;
  targetLanguage: TouristLanguage;
  text: string;
}

export interface TranslateResponse {
  targetLanguage?: SuyleAILanguage;
  providerSourceCode?: string;
  providerTargetCode?: string;
  translatedText: string;
}

export interface SpeechToTextResponse {
  language: SuyleAILanguage;
  text: string;
}

export interface TextToSpeechRequest {
  language: SuyleAILanguage;
  text: string;
}

export interface SuyleAIErrorState {
  local?: string;
  tourist?: string;
}

export interface VoiceSupportState {
  speechRecognitionSupported: boolean;
  recordingSupported: boolean;
}
