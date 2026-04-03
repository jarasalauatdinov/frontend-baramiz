import type { Language } from "@/shared/types/api";

export const supportedLanguages = ["uz", "ru", "en", "kaa"] as const satisfies readonly Language[];

export type SupportedLanguage = (typeof supportedLanguages)[number];

export function isSupportedLanguage(value: string): value is SupportedLanguage {
  return supportedLanguages.includes(value as SupportedLanguage);
}
