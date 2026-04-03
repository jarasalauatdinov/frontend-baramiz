import { Languages } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";

export function LanguageSwitcher() {
  const { language, languages, setLanguage, t } = useI18n();

  return (
    <label className="language-switcher" aria-label={t("header.languageAria")}>
      <Languages size={14} />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as typeof language)}
        aria-label={t("header.languageAria")}
      >
        {languages.map((option) => (
          <option key={option} value={option}>
            {t(`language.short.${option}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
