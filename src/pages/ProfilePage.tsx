import { Modal, Stack, Text } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  ChevronRight,
  FileText,
  Languages,
  LogOut,
  MapPinned,
  MessageSquareMore,
  RotateCcw,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/auth-provider";
import { LanguageSelectionOptions } from "@/features/language-switcher";
import { clearOnboardingCompleted } from "@/features/onboarding/model/storage";
import {
  readVisitedPlaceIds,
  VISITED_PLACE_IDS_KEY,
  VISITED_PLACES_EVENT,
} from "@/features/place-history/model/storage";
import {
  readSavedPlaceIds,
  SAVED_PLACE_IDS_KEY,
  SAVED_PLACES_EVENT,
} from "@/features/place-save/model/storage";
import {
  clearStoredRouteResult,
  readStoredRouteResult,
  type StoredRouteResult,
} from "@/features/route/route-storage";
import { ensureArray } from "@/shared/api/normalize";
import { getInterestLabel } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { usePlacesQuery } from "@/hooks/usePublicData";
import type { PublicPlace } from "@/shared/types/api";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";

type AuthFlashKey = "auth.success.login" | "auth.success.register" | "auth.success.logout";
type ProfileInfoSheetKey = "feedback" | "privacy" | "terms";

interface ProfileMenuItemConfig {
  icon: LucideIcon;
  label: string;
  support?: string;
  color: string;
  to?: string;
  onClick?: () => void;
  trailing?: ReactNode;
}

function readAuthFlashKey(state: unknown): AuthFlashKey | null {
  if (!state || typeof state !== "object" || !("authMessageKey" in state)) {
    return null;
  }

  const value = (state as { authMessageKey?: unknown }).authMessageKey;
  return value === "auth.success.login" || value === "auth.success.register" || value === "auth.success.logout"
    ? value
    : null;
}

function ProfileMenuItem({
  icon: Icon,
  label,
  support,
  color,
  to,
  onClick,
  trailing,
}: ProfileMenuItemConfig) {
  const body = (
    <>
      <span
        className="profile-menu__icon"
        style={{ background: `${color}18`, color }}
      >
        <Icon size={20} />
      </span>
      <span className="profile-menu__content">
        <span className="profile-menu__label">{label}</span>
        {support ? <span className="profile-menu__support">{support}</span> : null}
      </span>
      {trailing ?? <ChevronRight size={18} className="profile-menu__chevron" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="profile-menu__item">
        {body}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="profile-menu__item profile-menu__item--button"
      onClick={onClick}
    >
      {body}
    </button>
  );
}

interface ProfileInfoModalProps {
  sheet: ProfileInfoSheetKey | null;
  onClose: () => void;
  title: string;
  copy: string;
  extraCopy?: string;
}

function ProfileInfoModal({ sheet, onClose, title, copy, extraCopy }: ProfileInfoModalProps) {
  return (
    <Modal
      opened={sheet !== null}
      onClose={onClose}
      centered
      radius="xl"
      withCloseButton
      title={
        <Text fw={800} size="lg" c="var(--text)">
          {title}
        </Text>
      }
      overlayProps={{ backgroundOpacity: 0.24, blur: 6 }}
      styles={{
        content: {
          background: "var(--bg-card)",
          border: "1px solid var(--line)",
          boxShadow: "var(--shadow-lg)",
        },
        header: {
          background: "transparent",
        },
        close: {
          color: "var(--text-secondary)",
        },
      }}
    >
      <Stack gap="sm">
        <Text size="sm" c="var(--text-secondary)" style={{ lineHeight: 1.6 }}>
          {copy}
        </Text>
        {extraCopy ? (
          <Text size="sm" c="var(--text-secondary)" style={{ lineHeight: 1.6 }}>
            {extraCopy}
          </Text>
        ) : null}
      </Stack>
    </Modal>
  );
}

interface ProfilePlaceListProps {
  badge: string;
  places: PublicPlace[];
}

function ProfilePlaceList({ badge, places }: ProfilePlaceListProps) {
  const { t } = useI18n();

  return (
    <div className="profile-place-list">
      {places.slice(0, 3).map((place) => (
        <Link className="profile-place-row" key={place.id} to={`/places/${place.id}`}>
          <div className="profile-place-row__media">
            <img src={place.image} alt={place.name} loading="lazy" />
          </div>
          <div className="profile-place-row__content">
            <div className="profile-place-row__badges">
              <span className="tag tag-featured">{badge}</span>
              <span className="tag">{place.city}</span>
            </div>
            <strong>{place.name}</strong>
            <p>{place.shortDescription || place.description}</p>
            <div className="profile-place-row__meta">
              <span className="tag">{getInterestLabel(place.category, t)}</span>
              <span className="tag">{place.region}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function ProfilePage() {
  const { isAuthenticated, isReady, logout, user } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const placesQuery = usePlacesQuery();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [infoSheet, setInfoSheet] = useState<ProfileInfoSheetKey | null>(null);
  const [flashMessageKey, setFlashMessageKey] = useState<AuthFlashKey | null>(() =>
    readAuthFlashKey(location.state),
  );
  const [storedRoute, setStoredRoute] = useState<StoredRouteResult | null>(() => readStoredRouteResult());
  const [savedPlaceIds, setSavedPlaceIds] = useState<string[]>(() => readSavedPlaceIds());
  const [visitedPlaceIds, setVisitedPlaceIds] = useState<string[]>(() => readVisitedPlaceIds());

  const routeCount = storedRoute ? 1 : 0;
  const stopCount = storedRoute?.route.stops.length ?? 0;
  const preferenceCount = storedRoute?.input.preferences.length ?? 0;
  const lastRouteCity = storedRoute?.route.city ?? t("common.status.unavailable");
  const latestRouteTitle = storedRoute
    ? t("route.result.hero.title", { city: storedRoute.route.city })
    : t("saved.current.routeFallback");
  const latestRouteCopy = t("saved.current.summary", {
    stops: stopCount,
    preferences: preferenceCount,
  });
  const places = ensureArray<PublicPlace>(placesQuery.data);
  const placesById = useMemo(() => new Map(places.map((place) => [place.id, place])), [places]);
  const savedPlaces = useMemo(
    () => savedPlaceIds.map((placeId) => placesById.get(placeId)).filter((place): place is PublicPlace => Boolean(place)),
    [placesById, savedPlaceIds],
  );
  const visitedPlaces = useMemo(
    () => visitedPlaceIds.map((placeId) => placesById.get(placeId)).filter((place): place is PublicPlace => Boolean(place)),
    [placesById, visitedPlaceIds],
  );
  const isSavedPlacesLoading = placesQuery.isPending && savedPlaceIds.length > 0 && !savedPlaces.length;
  const isVisitedPlacesLoading = placesQuery.isPending && visitedPlaceIds.length > 0 && !visitedPlaces.length;

  useEffect(() => {
    const nextFlashKey = readAuthFlashKey(location.state);
    if (!nextFlashKey) {
      return;
    }

    setFlashMessageKey(nextFlashKey);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    function syncSavedPlaces() {
      setSavedPlaceIds(readSavedPlaceIds());
    }

    function syncVisitedPlaces() {
      setVisitedPlaceIds(readVisitedPlaceIds());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key === null || event.key === SAVED_PLACE_IDS_KEY) {
        syncSavedPlaces();
      }

      if (event.key === null || event.key === VISITED_PLACE_IDS_KEY) {
        syncVisitedPlaces();
      }
    }

    window.addEventListener(SAVED_PLACES_EVENT, syncSavedPlaces as EventListener);
    window.addEventListener(VISITED_PLACES_EVENT, syncVisitedPlaces as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(SAVED_PLACES_EVENT, syncSavedPlaces as EventListener);
      window.removeEventListener(VISITED_PLACES_EVENT, syncVisitedPlaces as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const aboutItems = useMemo<ProfileMenuItemConfig[]>(
    () => [
      {
        icon: Sparkles,
        label: t("profile.quick.route"),
        support: t("profile.about.routeCopy"),
        to: "/route",
        color: "#D97706",
      },
      {
        icon: Languages,
        label: t("profile.quick.suyle"),
        support: t("profile.about.suyleCopy"),
        to: "/suyle-ai",
        color: "#0F766E",
      },
      {
        icon: MapPinned,
        label: t("profile.quick.service"),
        support: t("profile.about.exploreCopy"),
        to: "/service",
        color: "#E8590C",
      },
    ],
    [t],
  );

  const preferenceItems = useMemo<ProfileMenuItemConfig[]>(
    () => [
      {
        icon: RotateCcw,
        label: t("profile.preferences.replay"),
        support: t("profile.preferences.replayCopy"),
        onClick: () => {
          clearOnboardingCompleted();
          navigate("/onboarding");
        },
        color: "#D97706",
      },
      ...(storedRoute
        ? [
            {
              icon: Trash2,
              label: t("profile.preferences.clear"),
              support: t("profile.preferences.clearCopy"),
              onClick: () => {
                clearStoredRouteResult();
                setStoredRoute(null);
              },
              color: "#B45309",
            } satisfies ProfileMenuItemConfig,
          ]
        : []),
    ],
    [navigate, storedRoute, t],
  );

  const feedbackItem: ProfileMenuItemConfig = useMemo(
    () => ({
      icon: MessageSquareMore,
      label: t("profile.feedback.row"),
      support: t("profile.feedback.rowCopy"),
      onClick: () => setInfoSheet("feedback"),
      color: "#0F766E",
    }),
    [t],
  );

  const legalItems = useMemo<ProfileMenuItemConfig[]>(
    () => [
      {
        icon: Shield,
        label: t("profile.legal.privacy"),
        onClick: () => setInfoSheet("privacy"),
        color: "#8B5E34",
      },
      {
        icon: FileText,
        label: t("profile.legal.terms"),
        onClick: () => setInfoSheet("terms"),
        color: "#6B7280",
      },
    ],
    [t],
  );

  const activeModal = useMemo(() => {
    if (infoSheet === "feedback") {
      return {
        title: t("profile.feedback.modal.title"),
        copy: t("profile.feedback.modal.copy"),
        extraCopy: t("profile.feedback.modal.tip"),
      };
    }

    if (infoSheet === "privacy") {
      return {
        title: t("profile.legal.privacyTitle"),
        copy: t("profile.legal.privacyCopy"),
      };
    }

    if (infoSheet === "terms") {
      return {
        title: t("profile.legal.termsTitle"),
        copy: t("profile.legal.termsCopy"),
      };
    }

    return null;
  }, [infoSheet, t]);

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
        subtitle={isAuthenticated ? t("profile.header.subtitle.user") : undefined}
        showLanguageSwitcher
      />

      <div className="screen profile-screen">
        {flashMessageKey ? (
          <div className="events-note" style={{ marginTop: 0, marginBottom: 16 }}>
            {t(flashMessageKey)}
          </div>
        ) : null}

        {!isAuthenticated ? (
          <section className="panel profile-soft-banner">
            <div className="profile-soft-banner__copy">
              <span className="pill profile-pill">{t("profile.guest.badge")}</span>
              <div className="profile-soft-banner__headline">
                <h2>{t("profile.guest.title")}</h2>
                <p>{t("profile.guest.copy")}</p>
              </div>
            </div>

            <div className="profile-soft-banner__actions">
              <Link className="button accent" to="/login">
                {t("profile.guest.primary")}
              </Link>
              <Link className="button secondary" to="/register">
                {t("profile.guest.secondary")}
              </Link>
            </div>
          </section>
        ) : (
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

            <div className="profile-mini-stats">
              <div className="profile-mini-stat">
                <span>{t("profile.stats.savedRoutes")}</span>
                <strong>{routeCount}</strong>
              </div>
              <div className="profile-mini-stat">
                <span>{t("saved.current.stats.preferences")}</span>
                <strong>{preferenceCount}</strong>
              </div>
              <div className="profile-mini-stat">
                <span>{t("profile.stats.lastCity")}</span>
                <strong>{lastRouteCity}</strong>
              </div>
            </div>
          </section>
        )}

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.language")} />
          <div className="panel profile-settings-card">
            <LanguageSelectionOptions
              presentation="sheet"
              selectedLanguage={language}
              onSelect={setLanguage}
            />
          </div>
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.saved")} />
          {isSavedPlacesLoading ? (
            <div className="panel profile-note-card">
              <p className="profile-version">{t("common.loading.copy")}</p>
            </div>
          ) : savedPlaces.length ? (
            <div className="panel profile-history-card">
              <ProfilePlaceList badge={t("profile.saved.recentBadge")} places={savedPlaces} />
            </div>
          ) : (
            <EmptyState
              align="start"
              icon={<Bookmark size={20} />}
              title={t("profile.saved.empty.title")}
              copy={t("profile.saved.empty.copy")}
              action={
                <Link className="button secondary" to="/service">
                  {t("profile.saved.empty.primary")}
                </Link>
              }
            />
          )}
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.visited")} />
          {isVisitedPlacesLoading ? (
            <div className="panel profile-note-card">
              <p className="profile-version">{t("common.loading.copy")}</p>
            </div>
          ) : visitedPlaces.length ? (
            <div className="panel profile-history-card">
              <ProfilePlaceList badge={t("profile.visited.recentBadge")} places={visitedPlaces} />
            </div>
          ) : (
            <EmptyState
              align="start"
              icon={<MapPinned size={20} />}
              title={t("profile.visited.empty.title")}
              copy={t("profile.visited.empty.copy")}
              action={
                <Link className="button secondary" to="/service">
                  {t("profile.visited.empty.primary")}
                </Link>
              }
            />
          )}
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.aiHistory")} />
          {storedRoute ? (
            <div className="panel profile-history-card">
              <div className="profile-route-glance profile-route-glance--soft profile-route-glance--standalone">
                <div className="profile-route-glance__head">
                  <span className="tag tag-featured">{t("profile.activity.recentBadge")}</span>
                  <span className="tag">{t("saved.current.device")}</span>
                </div>
                <div className="profile-route-glance__body">
                  <strong className="profile-route-glance__title">{latestRouteTitle}</strong>
                  <p className="profile-route-glance__copy">{latestRouteCopy}</p>
                </div>
              </div>

              <div className="profile-inline-actions">
                <Link className="button secondary" to="/route">
                  {t("saved.current.open")}
                </Link>
                <button
                  type="button"
                  className="button ghost"
                  onClick={() => {
                    clearStoredRouteResult();
                    setStoredRoute(null);
                  }}
                >
                  {t("profile.activity.clear")}
                </button>
              </div>
            </div>
          ) : (
            <EmptyState
              align="start"
              icon={<Sparkles size={20} />}
              title={t("profile.ai.empty.title")}
              copy={t("profile.ai.empty.copy")}
              action={
                <Link className="button accent" to="/route">
                  {t("profile.ai.empty.primary")}
                </Link>
              }
            />
          )}
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.preferences")} />
          <div className="profile-menu">
            {preferenceItems.map((item) => (
              <ProfileMenuItem key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.about")} />
          <div className="profile-menu">
            {aboutItems.map((item) => (
              <ProfileMenuItem key={item.label} {...item} />
            ))}
          </div>
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.feedback")} />
          <div className="profile-menu">
            <ProfileMenuItem {...feedbackItem} />
          </div>
        </section>

        <section className="section-gap-sm">
          <SectionHeader title={t("profile.sections.legal")} />
          <div className="profile-menu">
            {legalItems.map((item) => (
              <ProfileMenuItem key={item.label} {...item} />
            ))}
          </div>
        </section>

        {isAuthenticated ? (
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
        ) : (
          <section className="panel profile-note-card">
            <p className="profile-version">{t("profile.footer")}</p>
          </section>
        )}
      </div>

      {activeModal ? (
        <ProfileInfoModal
          sheet={infoSheet}
          onClose={() => setInfoSheet(null)}
          title={activeModal.title}
          copy={activeModal.copy}
          extraCopy={activeModal.extraCopy}
        />
      ) : null}
    </>
  );
}
