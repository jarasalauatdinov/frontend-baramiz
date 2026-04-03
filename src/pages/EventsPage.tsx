import { CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useEventsQuery } from "@/hooks/usePublicData";
import type { EventMoment } from "@/shared/types/api";

export function EventsPage() {
  const eventsQuery = useEventsQuery();

  if (eventsQuery.isPending && !eventsQuery.data) {
    return (
      <>
        <AppHeader title="Events" back />
        <div className="screen screen--center">
          <LoadingState title="Loading" copy="Fetching events..." />
        </div>
      </>
    );
  }

  if (eventsQuery.isError) {
    return (
      <>
        <AppHeader title="Events" back />
        <div className="screen screen--center">
          <ErrorState title="Unavailable" copy="Events could not be loaded." />
        </div>
      </>
    );
  }

  const events: EventMoment[] = eventsQuery.data ?? [];
  const isFallback = events.some((event) => event.source === "content-fallback");

  return (
    <>
      <AppHeader title="Events" back />
      <div className="screen" style={{ paddingTop: 0 }}>
        {isFallback && (
          <div className="events-note" style={{ marginBottom: 16 }}>
            <CalendarClock size={14} />
            Showing featured travel moments
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
            title="No events yet"
            copy="Events will appear as the catalog grows."
            action={
              <Link className="button accent" to="/route-generator">
                Generate a Route
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
