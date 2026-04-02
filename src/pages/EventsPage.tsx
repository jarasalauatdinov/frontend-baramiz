import { CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";
import { DirectoryCard } from "@/components/content/DirectoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useEventsQuery } from "@/hooks/usePublicData";
import type { EventMoment } from "@/types/api";

export function EventsPage() {
  const eventsQuery = useEventsQuery();

  if (eventsQuery.isPending && !eventsQuery.data) {
    return (
      <div className="page">
        <LoadingState title="Loading events" copy="Trying the dedicated events endpoint first, then gracefully falling back if needed." />
      </div>
    );
  }

  if (eventsQuery.isError) {
    return (
      <div className="page">
        <ErrorState title="Events are unavailable" copy="Neither the expected events endpoint nor its content fallback could be loaded." />
      </div>
    );
  }

  const events: EventMoment[] = eventsQuery.data ?? [];
  const isFallback = events.some((event) => event.source === "content-fallback");

  return (
    <div className="page">
      <section className="page-hero panel">
        <SectionHeading
          eyebrow="Events and Moments"
          title="A future-ready events screen that does not break while the API evolves."
          copy="This screen prefers `/api/events` and can transparently fall back to featured content today, keeping the product polished without pretending the backend already exposes more than it does."
        />
        {isFallback ? (
          <div className="events-note">
            <CalendarClock size={16} />
            Showing featured travel moments from the content catalog until a dedicated events feed is exposed.
          </div>
        ) : null}
      </section>

      <section className="section">
        {events.length ? (
          <div className="grid-auto">
            {events.map((event) => (
              <DirectoryCard key={event.id} item={event} variant="event" />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No live event entries yet"
            copy="The page is in place and will become richer as the backend adds a dedicated event catalog."
            action={
              <Link className="button accent" to="/route-generator">
                Generate a route instead
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
