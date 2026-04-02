import { Link } from "react-router-dom";
import { DirectoryCard } from "@/components/content/DirectoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useServicesQuery } from "@/hooks/usePublicData";
import type { ServiceDirectoryEntry } from "@/types/api";

export function ServicesPage() {
  const servicesQuery = useServicesQuery();

  if (servicesQuery.isPending && !servicesQuery.data) {
    return (
      <div className="page">
        <LoadingState title="Loading services" copy="Fetching support services and tourism infrastructure." />
      </div>
    );
  }

  if (servicesQuery.isError) {
    return (
      <div className="page">
        <ErrorState title="Services could not be loaded" copy="The service catalog endpoint or its fallback is unavailable." />
      </div>
    );
  }

  const services: ServiceDirectoryEntry[] = servicesQuery.data ?? [];
  const accommodation = services.filter((item) => item.type === "hotel");
  const dining = services.filter((item) => item.type === "restaurant");
  const localSupport = services.filter((item) => item.type === "service");

  return (
    <div className="page">
      <section className="page-hero panel">
        <SectionHeading
          eyebrow="Tourism Services"
          title="Support the trip with practical, easy-to-scan service discovery."
          copy="These listings stay useful on phone-sized screens and can later swap to dedicated backend endpoints without changing the page structure."
        />
      </section>

      {[
        {
          title: "Accommodation",
          copy: "Hotels and stays that work as reliable bases for route-based travel.",
          items: accommodation,
        },
        {
          title: "Dining",
          copy: "Food stops and restaurants that help the platform feel complete, not just scenic.",
          items: dining,
        },
        {
          title: "Local Support",
          copy: "Transport, booking, and service support that rounds out the MVP ecosystem.",
          items: localSupport,
        },
      ].map((section) => (
        <section className="section" key={section.title}>
          <SectionHeading eyebrow="Directory" title={section.title} copy={section.copy} />
          {section.items.length ? (
            <div className="grid-auto">
              {section.items.map((item) => (
                <DirectoryCard key={item.id} item={item} variant="service" />
              ))}
            </div>
          ) : (
            <EmptyState
              title={`No ${section.title.toLowerCase()} yet`}
              copy="This section is ready for future backend expansion without changing the public page design."
            />
          )}
        </section>
      ))}

      {!services.length ? (
        <EmptyState
          title="No services available"
          copy="Try again once the backend content feed is running."
          action={
            <Link className="button secondary" to="/admin/places">
              Open admin
            </Link>
          }
        />
      ) : null}
    </div>
  );
}
