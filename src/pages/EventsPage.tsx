import { CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useEventsQuery } from "@/hooks/usePublicData";
import type { EventMoment } from "@/shared/types/api";

export function EventsPage() {
  const { t } = useI18n();
  const eventsQuery = useEventsQuery();

  if (eventsQuery.isPending && !eventsQuery.data) {
    return (
      <>
        <AppHeader title={t("events.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("events.loading.title")} copy={t("events.loading.copy")} />
        </div>
      </>
    );
  }

  if (eventsQuery.isError) {
    return (
      <>
        <AppHeader title={t("events.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("events.error.title")} copy={t("events.error.copy")} />
        </div>
      </>
    );
  }

  const events: EventMoment[] = eventsQuery.data ?? [];
  const isFallback = events.some((event) => event.source === "content-fallback");

  return (
    <>
      <AppHeader title={t("events.header.title")} back showLanguageSwitcher />
      <div className="screen" style={{ paddingTop: 0 }}>
        {isFallback && (
          <div className="events-note" style={{ marginBottom: 16 }}>
            <CalendarClock size={14} />
            {t("events.fallback")}
          </div>
        )}

        {events.length ? (
          <div className="stack-list">
            {events.map((event) => (
              <DirectoryCard key={event.id} item={event} variant="event" />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("events.empty.title")}
            copy={t("events.empty.copy")}
            action={
              <Link className="button accent" to="/route">
                {t("common.actions.buildRoute")}
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
