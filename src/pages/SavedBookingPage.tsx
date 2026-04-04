import { Bookmark, CalendarRange, Route as RouteIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";
import { readStoredRouteResult } from "@/features/route/route-storage";

export function SavedBookingPage() {
  const { isAuthenticated, isReady } = useAuth();
  const { t } = useI18n();
  const storedRoute = readStoredRouteResult();
  const highlights = [
    {
      title: t("saved.shortcuts.stays.title"),
      copy: t("saved.shortcuts.stays.copy"),
      to: "/service/hotels",
    },
    {
      title: t("saved.shortcuts.dining.title"),
      copy: t("saved.shortcuts.dining.copy"),
      to: "/service/restaurants",
    },
    {
      title: t("saved.shortcuts.support.title"),
      copy: t("saved.shortcuts.support.copy"),
      to: "/service/services",
    },
  ];

  if (!isReady) {
    return (
      <>
        <AppHeader title={t("saved.header.title")} subtitle={t("saved.header.subtitle")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("common.loading.title")} copy={t("common.loading.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={t("saved.header.title")} subtitle={t("saved.header.subtitle")} showLanguageSwitcher />
      <div className="screen saved-booking-screen">
        <section className="saved-booking-hero panel">
          <div className="saved-booking-hero__icon">
            <Bookmark size={22} />
          </div>
          <div>
            <h1>{t("saved.hero.title")}</h1>
            <p>{t("saved.hero.copy")}</p>
          </div>
        </section>

        {!isAuthenticated ? (
          <section className="booking-shortcut-card panel">
            <div className="booking-shortcut-card__icon">
              <Bookmark size={18} />
            </div>
            <div>
              <h3>{t("saved.auth.title")}</h3>
              <p>{t("saved.auth.copy")}</p>
              <div className="button-row section-gap-sm">
                <Link className="button accent button--full" to="/login">
                  {t("common.actions.login")}
                </Link>
                <Link className="button secondary button--full" to="/register">
                  {t("common.actions.register")}
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="section-gap-sm">
          <SectionHeader
            eyebrow={t("saved.current.eyebrow")}
            title={t("saved.current.title")}
            subtitle={t("saved.current.subtitle")}
          />

          {storedRoute ? (
            <div className="booking-summary-card panel">
              <div className="booking-summary-card__meta">
                <span className="tag tag-featured">{t("saved.current.badge")}</span>
                <span className="tag">{storedRoute.route.city}</span>
              </div>
              <h3>{storedRoute.route.city}</h3>
              <p>
                {t("saved.current.summary", {
                  stops: storedRoute.route.stops.length,
                  interests: storedRoute.input.interests.length,
                })}
              </p>
              <div className="button-row">
                <Link className="button accent button--full" to="/route-result">
                  <RouteIcon size={16} />
                  {t("saved.current.open")}
                </Link>
              </div>
            </div>
          ) : (
            <EmptyState
              title={t("saved.empty.title")}
              copy={t("saved.empty.copy")}
              action={
                <Link className="button accent" to="/route-generator">
                  {t("common.actions.buildRoute")}
                </Link>
              }
            />
          )}
        </section>

        <section className="section-gap">
          <SectionHeader
            eyebrow={t("saved.shortcuts.eyebrow")}
            title={t("saved.shortcuts.title")}
            subtitle={t("saved.shortcuts.subtitle")}
          />
          <div className="stack-list">
            {highlights.map((highlight) => (
              <Link key={highlight.to} to={highlight.to} className="booking-shortcut-card panel">
                <div className="booking-shortcut-card__icon">
                  <CalendarRange size={18} />
                </div>
                <div>
                  <h3>{highlight.title}</h3>
                  <p>{highlight.copy}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
