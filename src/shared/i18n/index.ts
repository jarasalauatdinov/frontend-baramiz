import type { Language } from "@/shared/types/api";

export const supportedLanguages = ["uz", "ru", "en", "kaa"] as const satisfies readonly Language[];

export type SupportedLanguage = (typeof supportedLanguages)[number];

const localeByLanguage: Record<Language, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-US",
  kaa: "kaa-UZ",
};

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}

export function getLocaleForLanguage(language: Language) {
  return localeByLanguage[language] ?? localeByLanguage.en;
}
