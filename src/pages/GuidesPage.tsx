import { Link } from "react-router-dom";
import { DirectoryCard } from "@/components/content/DirectoryCard";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useGuidesQuery } from "@/hooks/usePublicData";
import type { GuideProfile } from "@/types/api";

export function GuidesPage() {
  const guidesQuery = useGuidesQuery();

  if (guidesQuery.isPending && !guidesQuery.data) {
    return (
      <div className="page">
        <LoadingState title="Loading guides" copy="Fetching local guide profiles from the current backend-compatible data source." />
      </div>
    );
  }

  if (guidesQuery.isError) {
    return (
      <div className="page">
        <ErrorState title="Guides are unavailable" copy="The guide listing could not be loaded from the current backend setup." />
      </div>
    );
  }

  const guides: GuideProfile[] = guidesQuery.data ?? [];

  return (
    <div className="page">
      <section className="page-hero panel">
        <SectionHeading
          eyebrow="Local Guides"
          title="Keep human expertise visible and premium."
          copy="Guide cards emphasize language coverage, specialties, and fast contact actions, which keeps the page demo-friendly and practical on mobile."
        />
      </section>

      <section className="section">
        {guides.length ? (
          <div className="grid-auto">
            {guides.map((guide) => (
              <DirectoryCard key={guide.id} item={guide} variant="guide" />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No guide profiles yet"
            copy="The page is ready and will populate automatically once guide data is exposed or expanded in the backend."
            action={
              <Link className="button secondary" to="/services">
                Browse services
              </Link>
            }
          />
        )}
      </section>
    </div>
  );
}
