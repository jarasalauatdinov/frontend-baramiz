import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { getServiceCategoryTitle } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useServiceHubCategoriesQuery } from "@/hooks/usePublicData";
import { CategoryGrid } from "@/entities/service/ui/CategoryGrid";

export function ServiceHubPage() {
  const { t } = useI18n();
  const categoriesQuery = useServiceHubCategoriesQuery();
  const categories = [...(categoriesQuery.data ?? [])]
    .filter((category) => category.isActive)
    .sort(
      (left, right) =>
        left.order - right.order ||
        getServiceCategoryTitle(left, t).localeCompare(getServiceCategoryTitle(right, t)),
    );
  const coreCategories = categories.filter((category) => category.group === "core");
  const utilityCategories = categories.filter((category) => category.group === "utility");

  if (categoriesQuery.isPending && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("service.header.title")} subtitle={t("service.header.subtitle")} showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState title={t("service.loading.title")} copy={t("service.loading.copy")} />
        </div>
      </>
    );
  }

  if (categoriesQuery.isError && categories.length === 0) {
    return (
      <>
        <AppHeader title={t("service.header.title")} subtitle={t("service.header.subtitle")} showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.error.title")} copy={t("service.error.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={t("service.header.title")} subtitle={t("service.header.subtitle")} showLanguageSwitcher />
      <div className="screen service-screen">
        {coreCategories.length ? (
          <section className="service-grid-section">
            <div className="section-label service-grid-section__label">{t("common.serviceTravel")}</div>
            <CategoryGrid categories={coreCategories} />
          </section>
        ) : null}

        {utilityCategories.length ? (
          <section className="service-grid-section">
            <div className="section-label service-grid-section__label">{t("common.serviceHelp")}</div>
            <CategoryGrid categories={utilityCategories} />
          </section>
        ) : null}

        {!coreCategories.length && !utilityCategories.length ? (
          <EmptyState title={t("service.empty.title")} copy={t("service.empty.copy")} />
        ) : null}
      </div>
    </>
  );
}
