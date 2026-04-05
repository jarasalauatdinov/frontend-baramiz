import {
  Bookmark,
  CalendarRange,
  ChevronRight,
  LogOut,
  MapPinned,
  Route as RouteIcon,
  Settings,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { useI18n } from "@/shared/i18n/provider";
import { formatDurationMinutes } from "@/shared/lib/utils";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";

const quickLinks = [
  { icon: RouteIcon, labelKey: "profile.quick.route", to: "/route-generator", color: "#D97706" },
  { icon: Bookmark, labelKey: "profile.quick.saved", to: "/saved-booking", color: "#0F766E" },
  { icon: MapPinned, labelKey: "profile.quick.service", to: "/service", color: "#E8590C" },
] as const;

const guestBenefits = [
  { icon: Bookmark, labelKey: "profile.guest.benefit.saved" },
  { icon: Shield, labelKey: "profile.guest.benefit.booking" },
  { icon: Star, labelKey: "profile.guest.benefit.favorites" },
] as const;

type AuthFlashKey = "auth.success.login" | "auth.success.register" | "auth.success.logout";

function readAuthFlashKey(state: unknown): AuthFlashKey | null {
  if (!state || typeof state !== "object" || !("authMessageKey" in state)) {
    return null;
  }

  const value = (state as { authMessageKey?: unknown }).authMessageKey;
  return value === "auth.success.login" || value === "auth.success.register" || value === "auth.success.logout"
    ? value
    : null;
}

export function ProfilePage() {
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [flashMessageKey, setFlashMessageKey] = useState<AuthFlashKey | null>(() =>
    readAuthFlashKey(location.state),
  );
  const storedRoute = readStoredRouteResult();
  const routeCount = storedRoute ? 1 : 0;
  const stopCount = storedRoute?.route.stops.length ?? 0;
  const lastRouteCity = storedRoute?.route.city ?? t("common.status.unavailable");
  const latestRouteTitle = storedRoute?.route.title || t("saved.current.routeFallback");
  const latestRouteCopy = storedRoute?.route.summary
    ? storedRoute.route.summary
    : t("saved.current.summary", {
        stops: stopCount,
        interests: storedRoute?.input.interests.length ?? 0,
      });
  const latestRouteDuration = formatDurationMinutes(storedRoute?.route.totalDurationMinutes, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });

  useEffect(() => {
    const nextFlashKey = readAuthFlashKey(location.state);
    if (!nextFlashKey) {
      return;
    }

    setFlashMessageKey(nextFlashKey);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  const accountItems = useMemo(
    () =>
      [
        {
          icon: Bookmark,
          labelKey: "profile.account.savedRoutes",
          copyKey: "profile.account.savedRoutesCopy",
          to: "/saved-booking",
          color: "#0F766E",
          statusKey: routeCount > 0 ? "profile.account.statusActive" : "profile.account.statusAvailable",
        },
        {
          icon: CalendarRange,
          labelKey: "profile.account.bookings",
          copyKey: "profile.account.bookingsCopy",
          color: "#D97706",
          statusKey: "profile.account.statusSoon",
        },
        {
          icon: Star,
          labelKey: "profile.account.favorites",
          copyKey: "profile.account.favoritesCopy",
          color: "#E8590C",
          statusKey: "profile.account.statusSoon",
        },
        {
          icon: Settings,
          labelKey: "profile.account.settings",
          copyKey: "profile.account.settingsCopy",
          color: "#6366F1",
          statusKey: "profile.account.statusSoon",
        },
      ] as const,
    [routeCount],
  );

  if (!isReady) {
    return (
      <>
        <AppHeader title={t("profile.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("common.loading.title")} copy={t("common.loading.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title={t("profile.header.title")}
        subtitle={t(isAuthenticated ? "profile.header.subtitle.user" : "profile.header.subtitle.guest")}
        showLanguageSwitcher
      />
      <div className="screen profile-screen">
        {flashMessageKey ? (
          <div className="events-note" style={{ marginTop: 0, marginBottom: 16 }}>
            {t(flashMessageKey)}
          </div>
        ) : null}

        {!isAuthenticated ? (
          <>
            <section className="panel profile-card profile-card--center profile-card--guest">
              <div className="profile-card__topline profile-card__topline--guest">
                <span className="pill profile-pill">{t("profile.guest.badge")}</span>
                {storedRoute ? <span className="tag">{t("saved.current.device")}</span> : null}
              </div>
              <div className="profile-card__hero profile-card__hero--center">
                <div className="profile-avatar profile-avatar--center">
                  <Sparkles size={30} />
                </div>
                <h2 className="profile-name">{t("profile.guest.title")}</h2>
                <p className="profile-helper">{t("profile.guest.copy")}</p>
              </div>

              {storedRoute ? (
                <div className="profile-route-glance profile-route-glance--soft">
                  <div className="profile-route-glance__head">
                    <span className="tag tag-featured">{t("saved.current.badge")}</span>
                    <span className="tag">{t("saved.current.device")}</span>
                  </div>
                  <div className="profile-route-glance__body">
                    <strong className="profile-route-glance__title">{latestRouteTitle}</strong>
                    <p className="profile-route-glance__copy">{latestRouteCopy}</p>
                  </div>
                </div>
              ) : null}

              <div className="profile-benefits" aria-label={t("profile.sections.library")}>
                {guestBenefits.map((item) => (
                  <div key={item.labelKey} className="profile-benefit">
                    <span className="profile-benefit__icon" aria-hidden="true">
                      <item.icon size={16} />
                    </span>
                    <span>{t(item.labelKey)}</span>
                  </div>
                ))}
              </div>

              <div className="button-row">
                <Link className="button accent button--full" to="/login">
                  {t("profile.guest.primary")}
                </Link>
                <Link className="button secondary button--full" to="/register">
                  {t("profile.guest.secondary")}
                </Link>
              </div>
            </section>

            <section className="section-gap-sm">
              <SectionHeader
                title={t("profile.sections.tools")}
                subtitle={t("profile.sections.toolsSubtitle")}
              />
              <div className="profile-menu">
                {quickLinks.map((item) => (
                  <Link key={item.labelKey} to={item.to} className="profile-menu__item">
                    <span
                      className="profile-menu__icon"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      <item.icon size={20} />
                    </span>
                    <span className="profile-menu__label">{t(item.labelKey)}</span>
                    <ChevronRight size={18} className="profile-menu__chevron" />
                  </Link>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="panel profile-card profile-card--account">
              <div className="profile-card__topline">
                <span className="pill">{t("profile.account.badge")}</span>
                <div className="profile-card__topline-tags">
                  {routeCount > 0 ? <span className="tag">{lastRouteCity}</span> : null}
                  <span className="tag">{t(routeCount > 0 ? "profile.account.statusActive" : "profile.account.statusAvailable")}</span>
                </div>
              </div>

              <div className="profile-card__hero">
                <div className="profile-card__header">
                  <div className="profile-avatar">
                    <Sparkles size={28} />
                  </div>
                  <div className="profile-card__copy">
                    <h2 className="profile-name">{user?.name || t("profile.user.fallbackName")}</h2>
                    <p className="profile-email">{user?.email}</p>
                  </div>
                </div>
                <p className="profile-helper">{t("profile.account.copy")}</p>
              </div>

              {storedRoute ? (
                <div className="profile-route-glance profile-route-glance--product">
                  <div className="profile-route-glance__head">
                    <span className="profile-route-glance__eyebrow">{t("saved.current.badge")}</span>
                    <div className="profile-route-glance__meta">
                      <span>
                        <MapPinned size={14} />
                        {lastRouteCity}
                      </span>
                      <span>
                        <RouteIcon size={14} />
                        {latestRouteDuration}
                      </span>
                    </div>
                  </div>
                  <div className="profile-route-glance__body">
                    <strong className="profile-route-glance__title">{latestRouteTitle}</strong>
                    <p className="profile-route-glance__copy">{latestRouteCopy}</p>
                  </div>
                </div>
              ) : null}

              <div className="profile-mini-stats">
                <div className="profile-mini-stat">
                  <span>{t("profile.stats.savedRoutes")}</span>
                  <strong>{routeCount}</strong>
                </div>
                <div className="profile-mini-stat">
                  <span>{t("profile.stats.savedStops")}</span>
                  <strong>{stopCount}</strong>
                </div>
                <div className="profile-mini-stat">
                  <span>{t("profile.stats.lastCity")}</span>
                  <strong>{lastRouteCity}</strong>
                </div>
              </div>
            </section>

            <section className="section-gap-sm">
              <SectionHeader
                title={t("profile.sections.library")}
                subtitle={t("profile.sections.librarySubtitle")}
              />
              <div className="profile-menu">
                {accountItems.map((item) =>
                  "to" in item && item.to ? (
                    <Link key={item.labelKey} to={item.to} className="profile-menu__item">
                      <span
                        className="profile-menu__icon"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <item.icon size={20} />
                      </span>
                      <span className="profile-menu__content">
                        <span className="profile-menu__label">{t(item.labelKey)}</span>
                        <span className="profile-menu__support">{t(item.copyKey)}</span>
                      </span>
                      <span className="profile-menu__status">{t(item.statusKey)}</span>
                      <ChevronRight size={18} className="profile-menu__chevron" />
                    </Link>
                  ) : (
                    <div key={item.labelKey} className="profile-menu__item profile-menu__item--static">
                      <span
                        className="profile-menu__icon"
                        style={{ background: `${item.color}18`, color: item.color }}
                      >
                        <item.icon size={20} />
                      </span>
                      <span className="profile-menu__content">
                        <span className="profile-menu__label">{t(item.labelKey)}</span>
                        <span className="profile-menu__support">{t(item.copyKey)}</span>
                      </span>
                      <span className="profile-menu__status">{t(item.statusKey)}</span>
                    </div>
                  ),
                )}
              </div>
            </section>

            <section className="section-gap-sm">
              <SectionHeader
                title={t("profile.sections.tools")}
                subtitle={t("profile.sections.toolsSubtitle")}
              />
              <div className="profile-menu">
                {quickLinks.map((item) => (
                  <Link key={item.labelKey} to={item.to} className="profile-menu__item">
                    <span
                      className="profile-menu__icon"
                      style={{ background: `${item.color}18`, color: item.color }}
                    >
                      <item.icon size={20} />
                    </span>
                    <span className="profile-menu__label">{t(item.labelKey)}</span>
                    <ChevronRight size={18} className="profile-menu__chevron" />
                  </Link>
                ))}
              </div>
            </section>

            <section className="panel profile-action-card">
              <button
                type="button"
                className="profile-logout"
                disabled={isSigningOut}
                onClick={() => {
                  void (async () => {
                    setIsSigningOut(true);
                    await logout();
                    navigate("/profile", {
                      replace: true,
                      state: { authMessageKey: "auth.success.logout" as const },
                    });
                  })();
                }}
              >
                <LogOut size={18} />
                {isSigningOut ? t("profile.signOutBusy") : t("profile.signOut")}
              </button>
              <p className="profile-version">{t("profile.footer")}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
