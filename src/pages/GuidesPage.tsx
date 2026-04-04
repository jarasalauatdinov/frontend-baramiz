import { Link } from "react-router-dom";
import { DirectoryCard } from "@/entities/content/ui/DirectoryCard";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { useI18n } from "@/shared/i18n/provider";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useGuidesQuery } from "@/hooks/usePublicData";
import type { GuideProfile } from "@/shared/types/api";

export function GuidesPage() {
  const { t } = useI18n();
  const guidesQuery = useGuidesQuery();

  if (guidesQuery.isPending && !guidesQuery.data) {
    return (
      <>
        <AppHeader title={t("guides.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("guides.loading.title")} copy={t("guides.loading.copy")} />
        </div>
      </>
    );
  }

  if (guidesQuery.isError) {
    return (
      <>
        <AppHeader title={t("guides.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("guides.error.title")} copy={t("guides.error.copy")} />
        </div>
      </>
    );
  }

  const guides: GuideProfile[] = guidesQuery.data ?? [];

  return (
    <>
      <AppHeader title={t("guides.header.title")} back showLanguageSwitcher />
      <div className="screen" style={{ paddingTop: 0 }}>
        {guides.length ? (
          <div className="stack-list">
            {guides.map((guide) => (
              <DirectoryCard key={guide.id} item={guide} variant="guide" />
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("guides.empty.title")}
            copy={t("guides.empty.copy")}
            action={
              <Link className="button secondary" to="/service">
                {t("common.actions.openService")}
              </Link>
            }
          />
        )}
      </div>
    </>
  );
}
