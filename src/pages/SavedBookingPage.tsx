import {
  CalendarRange,
  Hotel,
  Route as RouteIcon,
  ShieldPlus,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";

export function SavedBookingPage() {
  const { isAuthenticated, isReady } = useAuth();
  const { t } = useI18n();
  const storedRoute = readStoredRouteResult();
  const highlights = [
    {
      title: t("saved.shortcuts.stays.title"),
      copy: t("saved.shortcuts.stays.copy"),
      to: "/service/hotels",
      icon: Hotel,
    },
    {
      title: t("saved.shortcuts.dining.title"),
      copy: t("saved.shortcuts.dining.copy"),
      to: "/service/restaurants",
      icon: UtensilsCrossed,
    },
    {
      title: t("saved.shortcuts.support.title"),
      copy: t("saved.shortcuts.support.copy"),
      to: "/service/services",
      icon: ShieldPlus,
    },
  ];
  const savedStopsCount = storedRoute?.route.stops.length ?? 0;
  const savedInterestsCount = storedRoute?.input.interests.length ?? 0;
  const savedDurationLabel = formatDurationMinutes(storedRoute?.route.totalDurationMinutes, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });
  const savedRouteSummary = storedRoute
    ? storedRoute.route.summary ||
      t("saved.current.summary", {
        stops: savedStopsCount,
        interests: savedInterestsCount,
      })
    : "";
  const savedRoutePreviewStops = storedRoute?.route.stops.slice(0, 3) ?? [];

  if (!isReady) {
    return (
      <>
        <AppHeader title={t("saved.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("common.loading.title")} copy={t("common.loading.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={t("saved.header.title")} showLanguageSwitcher />
      <div className="screen saved-booking-screen">
        {!isAuthenticated ? (
          <section className="panel saved-auth-card">
            <div className="saved-auth-card__icon">
              <Sparkles size={18} />
            </div>
            <div className="saved-auth-card__copy">
              <h3>{t("saved.auth.title")}</h3>
              <p>{t("saved.auth.copy")}</p>
              <div className="button-row">
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
            eyebrow={t("saved.routes.eyebrow")}
            title={t("saved.routes.title")}
            subtitle={t(isAuthenticated ? "saved.routes.subtitle.user" : "saved.routes.subtitle.guest")}
          />

          {storedRoute ? (
            <article className="booking-summary-card booking-summary-card--featured panel">
              <div className="booking-summary-card__header">
                <div className="booking-summary-card__meta">
                  <span className="tag tag-featured">{t("saved.current.badge")}</span>
                  <span className="tag">{storedRoute.route.city}</span>
                  <span className="tag">
                    {t(isAuthenticated ? "saved.current.account" : "saved.current.device")}
                  </span>
                </div>
                <div className="booking-summary-card__copy">
                  <h3>{storedRoute.route.title || t("saved.current.routeFallback")}</h3>
                  <p className="booking-summary-card__summary">{savedRouteSummary}</p>
                </div>
              </div>

              <div className="booking-summary-card__stats">
                <div className="booking-summary-card__stat">
                  <span>{t("saved.current.stats.stops")}</span>
                  <strong>{savedStopsCount}</strong>
                </div>
                <div className="booking-summary-card__stat">
                  <span>{t("saved.current.stats.interests")}</span>
                  <strong>{savedInterestsCount}</strong>
                </div>
                <div className="booking-summary-card__stat">
                  <span>{t("route.result.metric.duration")}</span>
                  <strong>{savedDurationLabel}</strong>
                </div>
              </div>

              {savedRoutePreviewStops.length ? (
                <div className="booking-summary-card__preview">
                  <div className="booking-summary-card__preview-label">{t("route.result.section.stops")}</div>
                  <div className="booking-summary-card__preview-list">
                    {savedRoutePreviewStops.map((stop, index) => (
                      <div className="booking-summary-card__preview-item" key={`${stop.id}-${stop.order}`}>
                        <span className="booking-summary-card__preview-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="booking-summary-card__preview-name">{stop.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="button-row">
                <Link className="button accent button--full" to="/route-result">
                  <RouteIcon size={16} />
                  {t("saved.current.open")}
                </Link>
                <Link className="button secondary button--full" to="/route-generator">
                  {t("saved.current.create")}
                </Link>
              </div>
            </article>
          ) : (
            <EmptyState
              title={t(isAuthenticated ? "saved.empty.user.title" : "saved.empty.guest.title")}
              copy={t(isAuthenticated ? "saved.empty.user.copy" : "saved.empty.guest.copy")}
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
            eyebrow={t("saved.booking.eyebrow")}
            title={t("saved.booking.title")}
            subtitle={t(isAuthenticated ? "saved.booking.subtitle.user" : "saved.booking.subtitle.guest")}
          />
          <div className="stack-list saved-booking-stack">
            <div className="panel saved-booking-note saved-booking-note--future">
              <div className="saved-booking-note__topline">
                <span className="pill saved-booking-note__label">{t("saved.booking.card.badge")}</span>
                <div className="saved-booking-note__icon">
                  <CalendarRange size={18} />
                </div>
              </div>
              <div className="saved-booking-note__copy">
                <h3>{t("saved.booking.card.title")}</h3>
                <p>{t(isAuthenticated ? "saved.booking.card.copy.user" : "saved.booking.card.copy.guest")}</p>
              </div>
            </div>

            <div className="panel saved-booking-shortcuts">
              <SectionHeader
                eyebrow={t("saved.shortcuts.eyebrow")}
                title={t("saved.shortcuts.title")}
                subtitle={t("saved.shortcuts.subtitle")}
              />

              <div className="saved-shortcuts-grid">
                {highlights.map((highlight) => {
                  const Icon = highlight.icon;

                  return (
                    <Link key={highlight.to} to={highlight.to} className="booking-shortcut-card panel">
                      <div className="booking-shortcut-card__icon">
                        <Icon size={18} />
                      </div>
                      <div className="booking-shortcut-card__copy">
                        <h3>{highlight.title}</h3>
                        <p>{highlight.copy}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
