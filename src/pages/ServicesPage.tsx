import { Link } from "react-router-dom";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useServicesQuery } from "@/hooks/usePublicData";
import type { ServiceDirectoryEntry } from "@/shared/types/api";

export function ServicesPage() {
  const servicesQuery = useServicesQuery();

  if (servicesQuery.isPending && !servicesQuery.data) {
    return (
      <>
        <AppHeader title="Booking" />
        <div className="screen screen--center">
          <LoadingState title="Loading" copy="Fetching services..." />
        </div>
      </>
    );
  }

  if (servicesQuery.isError) {
    return (
      <>
        <AppHeader title="Booking" />
        <div className="screen screen--center">
          <ErrorState title="Unavailable" copy="Services could not be loaded." />
        </div>
      </>
    );
  }

  const services: ServiceDirectoryEntry[] = servicesQuery.data ?? [];
  const accommodation = services.filter((item) => item.type === "hotel");
  const dining = services.filter((item) => item.type === "restaurant");
  const localSupport = services.filter((item) => item.type === "service");

  const sections = [
    { title: "Hotels & Stays", items: accommodation, emoji: "🏨" },
    { title: "Restaurants", items: dining, emoji: "🍽️" },
    { title: "Local Support", items: localSupport, emoji: "🚐" },
  ];

  return (
    <>
      <AppHeader title="Booking" subtitle="Hotels, dining & support" />
      <div className="screen" style={{ paddingTop: 0 }}>
        {sections.map((section) => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            <div className="section-label">
              {section.emoji} {section.title}
            </div>
            {section.items.length ? (
              <div className="stack-list">
                {section.items.map((item) => (
                  <DirectoryCard key={item.id} item={item} variant="service" />
                ))}
              </div>
            ) : (
              <EmptyState
                title={`No ${section.title.toLowerCase()} yet`}
                copy="Coming soon."
              />
            )}
          </div>
        ))}

        {!services.length && (
          <EmptyState
            title="No services available"
            copy="Check back later."
            action={
              <Link className="button secondary" to="/route-generator">
                Build a Route
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
