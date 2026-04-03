import { Link } from "react-router-dom";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useGuidesQuery } from "@/hooks/usePublicData";
import type { GuideProfile } from "@/shared/types/api";

export function GuidesPage() {
  const guidesQuery = useGuidesQuery();

  if (guidesQuery.isPending && !guidesQuery.data) {
    return (
      <>
        <AppHeader title="Guides" back />
        <div className="screen screen--center">
          <LoadingState title="Loading" copy="Fetching local guides..." />
        </div>
      </>
    );
  }

  if (guidesQuery.isError) {
    return (
      <>
        <AppHeader title="Guides" back />
        <div className="screen screen--center">
          <ErrorState title="Unavailable" copy="Guides could not be loaded." />
        </div>
      </>
    );
  }

  const guides: GuideProfile[] = guidesQuery.data ?? [];

  return (
    <>
      <AppHeader title="Local Guides" back />
      <div className="screen" style={{ paddingTop: 0 }}>
        {guides.length ? (
          <div className="stack-list">
            {guides.map((guide) => (
              <DirectoryCard key={guide.id} item={guide} variant="guide" />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No guides yet"
            copy="Guide profiles will appear here."
            action={
              <Link className="button secondary" to="/services">
                Browse Services
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
