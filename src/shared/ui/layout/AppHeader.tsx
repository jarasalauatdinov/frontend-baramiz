import { type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  actions?: ReactNode;
  showLanguageSwitcher?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  back,
  actions,
  showLanguageSwitcher,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { t } = useI18n();

  return (
    <header className="app-header">
      <div className="app-header__left">
        {back ? (
          <button
            type="button"
            className="app-header__back"
            aria-label={t("header.backAria")}
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </button>
        ) : null}
      </div>
      <div className="app-header__center">
        <h1 className="app-header__title">{title}</h1>
        {subtitle ? (
          <p className="app-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <div className="app-header__right">
        {showLanguageSwitcher ? <LanguageSwitcher /> : null}
        {actions ? <div className="app-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
