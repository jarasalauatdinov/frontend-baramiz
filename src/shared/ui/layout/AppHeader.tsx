import { type ReactNode, useEffect, useState } from "react";
import { ChevronLeft, Luggage } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/features/language-switcher";
import { useI18n } from "@/shared/i18n/provider";

type AppHeaderVariant = "brand-left" | "title-left" | "title-center-utility";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  brand?: boolean;
  variant?: AppHeaderVariant;
  utilityIcon?: ReactNode;
  actions?: ReactNode;
  showLanguageSwitcher?: boolean;
}

export function AppHeader({
  title,
  subtitle,
  back,
  brand,
  variant,
  utilityIcon,
  actions,
  showLanguageSwitcher,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { t } = useI18n();
  const resolvedVariant: AppHeaderVariant = variant ?? (brand ? "brand-left" : "title-left");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let frameId = 0;

    const syncScrolledState = () => {
      const nextScrolled = window.scrollY > 8;
      setIsScrolled((current) => (current === nextScrolled ? current : nextScrolled));
    };

    const handleScroll = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = 0;
        syncScrolledState();
      });
    };

    syncScrolledState();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const actionContent = (
    <>
      {showLanguageSwitcher ? <LanguageSwitcher /> : null}
      {actions ? <div className="app-header__actions">{actions}</div> : null}
    </>
  );

  if (resolvedVariant === "title-center-utility") {
    return (
      <header className={`app-header app-header--${resolvedVariant}${isScrolled ? " is-scrolled" : ""}`}>
        <div className="app-header__utility-side">
          {utilityIcon ? (
            <span className="app-header__utility-mark" aria-hidden="true">
              {utilityIcon}
            </span>
          ) : back ? (
            <button
              type="button"
              className="app-header__back"
              aria-label={t("header.backAria")}
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={22} />
            </button>
          ) : (
            <span className="app-header__utility-placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="app-header__center">
          <h1 className="app-header__title">{title}</h1>
        </div>

        <div className="app-header__utility-side app-header__utility-side--right">
          {showLanguageSwitcher || actions ? actionContent : <span className="app-header__utility-placeholder" aria-hidden="true" />}
        </div>
      </header>
    );
  }

  return (
    <header className={`app-header app-header--${resolvedVariant}${isScrolled ? " is-scrolled" : ""}`}>
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

        <div className={`app-header__content${brand ? " app-header__content--brand" : ""}`}>
          {brand ? (
            <span className="app-header__brand-mark" aria-hidden="true">
              <Luggage size={20} strokeWidth={2} />
            </span>
          ) : null}

          <div className="app-header__copy">
            <h1 className="app-header__title">{title}</h1>
            {subtitle ? <p className="app-header__subtitle">{subtitle}</p> : null}
          </div>
        </div>
      </div>

      <div className="app-header__right">
        {actionContent}
      </div>
    </header>
  );
}
