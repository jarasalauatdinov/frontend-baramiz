import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { useI18n } from "@/shared/i18n/provider";

export function HomeHeader() {
  const { t } = useI18n();

  return <AppHeader title={t("home.header.title")} showLanguageSwitcher />;
}
