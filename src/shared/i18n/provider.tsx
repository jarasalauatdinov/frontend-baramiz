import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { readStoredLanguage, writeStoredLanguage } from "@/features/language-switcher/model/storage";
import { appConfig } from "@/shared/lib/config";
import type { Language } from "@/shared/types/api";
import { en, type TranslationKey } from "./en";
import { isSupportedLanguage, supportedLanguages } from "./index";
import { kaa } from "./kaa";
import { ru } from "./ru";
import { uz } from "./uz";

const translations = {
  en,
  uz,
  ru,
  kaa,
} as const;

export type TranslateValues = Record<string, string | number>;
export type TranslateFn = (key: TranslationKey, values?: TranslateValues) => string;

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: TranslateFn;
  languages: readonly Language[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(message: string, values?: TranslateValues) {
  if (!values) {
    return message;
  }

  return Object.entries(values).reduce((result, [key, value]) => {
    return result.replaceAll(`{{${key}}}`, String(value));
  }, message);
}

function resolveInitialLanguage(): Language {
  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  const browserLanguage =
    typeof navigator !== "undefined" ? navigator.language.toLowerCase().split("-")[0] : "";
  if (browserLanguage && isSupportedLanguage(browserLanguage)) {
    return browserLanguage;
  }

  return isSupportedLanguage(appConfig.defaultLanguage) ? appConfig.defaultLanguage : "en";
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(resolveInitialLanguage);

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (!isSupportedLanguage(nextLanguage)) {
      return;
    }

    setLanguageState(nextLanguage);
    writeStoredLanguage(nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const t = useCallback<TranslateFn>(
    (key, values) => {
      const message = translations[language][key] ?? en[key];
      return interpolate(message, values);
    },
    [language],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t,
      languages: supportedLanguages,
    }),
    [language, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return context;
}
