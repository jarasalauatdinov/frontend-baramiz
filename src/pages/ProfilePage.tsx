import {
  Bookmark,
  ChevronRight,
  HelpCircle,
  LogOut,
  MapPin,
  Settings,
  Shield,
  Sparkles,
  Star,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { LoadingState } from "@/shared/ui/state/LoadingState";

const menuItems = [
  { icon: MapPin, labelKey: "profile.menu.routes", to: "/route-result", color: "#D97706" },
  { icon: Bookmark, labelKey: "profile.menu.saved", to: "/saved-booking", color: "#0F766E" },
  { icon: Star, labelKey: "profile.menu.service", to: "/service", color: "#E8590C" },
  { icon: Settings, labelKey: "profile.menu.settings", to: "/profile", color: "#6366F1" },
  { icon: HelpCircle, labelKey: "profile.menu.support", to: "/profile", color: "#0EA5E9" },
  { icon: Shield, labelKey: "profile.menu.privacy", to: "/profile", color: "#8B5CF6" },
] as const;

export function ProfilePage() {
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const storedRoute = readStoredRouteResult();
  const successKey =
    location.state &&
    typeof location.state === "object" &&
    "authMessageKey" in location.state &&
    typeof location.state.authMessageKey === "string"
      ? location.state.authMessageKey
      : null;
  const routeCount = storedRoute ? 1 : 0;
  const placeCount = storedRoute?.route.stops.length ?? 0;
  const cityCount = storedRoute ? 1 : 0;

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
        subtitle={isAuthenticated ? t("profile.header.subtitle.user") : t("profile.header.subtitle.guest")}
        showLanguageSwitcher
      />
      <div className="screen">
        {successKey ? (
          <div className="events-note" style={{ marginTop: 0, marginBottom: 16 }}>
            {t(successKey as "auth.success.login" | "auth.success.register")}
          </div>
        ) : null}

        {!isAuthenticated ? (
          <>
            <section className="panel auth-guest-card">
              <div className="profile-avatar">
                <Sparkles size={28} />
              </div>
              <h2 className="profile-name">{t("profile.guest.title")}</h2>
              <p className="status-copy">{t("profile.guest.copy")}</p>
              <div className="button-row section-gap-sm">
                <Link className="button accent button--full" to="/login">
                  {t("profile.guest.primary")}
                </Link>
                <Link className="button secondary button--full" to="/register">
                  {t("profile.guest.secondary")}
                </Link>
              </div>
            </section>

            <div className="profile-menu section-gap-sm">
              {menuItems.slice(0, 3).map((item) => (
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
          </>
        ) : (
          <>
            <div className="profile-header">
              <div className="profile-avatar">
                <Sparkles size={28} />
              </div>
              <h2 className="profile-name">{user?.name || t("profile.user.fallbackName")}</h2>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-stats">
                <div className="profile-stat">
                  <strong>{routeCount}</strong>
                  <span>{t("profile.stats.routes")}</span>
                </div>
                <div className="profile-stat">
                  <strong>{placeCount}</strong>
                  <span>{t("profile.stats.places")}</span>
                </div>
                <div className="profile-stat">
                  <strong>{cityCount}</strong>
                  <span>{t("profile.stats.cities")}</span>
                </div>
              </div>
            </div>

            <div className="profile-menu">
              {menuItems.map((item) => (
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

            <div className="profile-footer">
              <button
                type="button"
                className="profile-logout"
                onClick={() => {
                  void (async () => {
                    await logout();
                    navigate("/profile", { replace: true });
                  })();
                }}
              >
                <LogOut size={18} />
                {t("profile.signOut")}
              </button>
              <p className="profile-version">{t("profile.version")}</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}
