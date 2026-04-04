import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { ensureArray } from "@/shared/api/normalize";
import { getServiceCategoryTitle } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useServiceSectionsQuery } from "@/hooks/usePublicData";
import { CategoryGrid } from "@/entities/service/ui/CategoryGrid";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";

export function ServiceHubPage() {
  const { t } = useI18n();
  const categoriesQuery = useServiceSectionsQuery();
  const categories = ensureArray(categoriesQuery.data)
    .filter((category) => category.isActive)
    .sort(
      (left, right) =>
        left.order - right.order ||
        getServiceCategoryTitle(left, t).localeCompare(getServiceCategoryTitle(right, t)),
    );
  const discoveryCategories = categories.filter((category) => category.type === "discovery");
  const utilityCategories = categories.filter((category) => category.type === "utility");

  if (categoriesQuery.isPending && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("service.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("service.loading.title")} copy={t("service.loading.copy")} />
        </div>
      </>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("service.header.title")} showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.error.title")} copy={t("service.error.copy")} />
        </div>
      </>
    );
  }

  return (
      <>
        <AppHeader title={t("service.header.title")} showLanguageSwitcher />
        <div className="screen service-screen">
        {discoveryCategories.length ? (
          <section className="service-grid-section">
            <SectionHeader title={t("common.serviceTravel")} />
            <CategoryGrid categories={discoveryCategories} />
          </section>
        ) : null}

        {utilityCategories.length ? (
          <section className="service-grid-section">
            <SectionHeader title={t("common.serviceHelp")} />
            <CategoryGrid categories={utilityCategories} />
          </section>
        ) : null}

        {!discoveryCategories.length && !utilityCategories.length ? (
          <EmptyState title={t("service.empty.title")} copy={t("service.empty.copy")} />
        ) : null}
      </div>
    </>
  );
}
