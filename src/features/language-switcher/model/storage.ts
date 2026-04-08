import type { Language } from "@/shared/types/api";
import { isSupportedLanguage } from "@/shared/i18n";
import { clearLocalValue, readLocalValue, writeLocalValue } from "@/shared/lib/storage";

export const LANGUAGE_STORAGE_KEY = "baramiz_lang";
const LEGACY_LANGUAGE_STORAGE_KEY = "baramiz.language";

function normalizeStoredLanguage(value: unknown): Language | null {
  return typeof value === "string" && isSupportedLanguage(value) ? value : null;
}

export function readStoredLanguage() {
  const selectedLanguage = normalizeStoredLanguage(readLocalValue<string>(LANGUAGE_STORAGE_KEY));
  if (selectedLanguage) {
    return selectedLanguage;
  }

  const legacyLanguage = normalizeStoredLanguage(readLocalValue<string>(LEGACY_LANGUAGE_STORAGE_KEY));
  if (legacyLanguage) {
    writeLocalValue(LANGUAGE_STORAGE_KEY, legacyLanguage);
    clearLocalValue(LEGACY_LANGUAGE_STORAGE_KEY);
    return legacyLanguage;
  }

  return null;
}

export function writeStoredLanguage(language: Language) {
  writeLocalValue(LANGUAGE_STORAGE_KEY, language);
  clearLocalValue(LEGACY_LANGUAGE_STORAGE_KEY);
}

export function hasStoredLanguageSelection() {
  return readStoredLanguage() !== null;
}
