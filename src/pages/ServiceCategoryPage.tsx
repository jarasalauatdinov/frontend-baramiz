import { Link, useParams } from "react-router-dom";
import { ensureArray } from "@/shared/api/normalize";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import {
  getServiceCategoryTitle,
} from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { useServiceCategoryItemsQuery, useServiceSectionQuery, useServiceSectionsQuery } from "@/hooks/usePublicData";
import { ServiceItemCard } from "@/entities/service/ui/ServiceItemCard";
import type { ServiceCategorySlug } from "@/shared/types/api";

export function ServiceCategoryPage() {
  const { t } = useI18n();
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const sectionSlug = categorySlug as ServiceCategorySlug | undefined;
  const sectionsQuery = useServiceSectionsQuery();
  const sections = ensureArray(sectionsQuery.data);
  const sectionQuery = useServiceSectionQuery(sectionSlug);
  const fallbackCategory = sections.find((section) => section.slug === sectionSlug) ?? null;
  const category = sectionQuery.data ?? fallbackCategory;
  const itemsQuery = useServiceCategoryItemsQuery(sectionSlug);
  const isCategoryLoading = (sectionsQuery.isPending || sectionQuery.isPending) && !category;
  const isCategoryError = sectionsQuery.isError && sectionQuery.isError && !category;

  if (isCategoryLoading) {
    return (
      <>
        <AppHeader title={t("service.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState
            title={t("service.category.loading.title")}
            copy={t("service.category.loading.copy", { name: t("service.header.title").toLowerCase() })}
          />
        </div>
      </>
    );
  }

  if (isCategoryError) {
    return (
      <>
        <AppHeader title={t("service.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.category.error.title")} copy={t("service.category.error.copy")} />
        </div>
      </>
    );
  }

  if (!category && !isCategoryLoading) {
    return (
      <>
        <AppHeader title={t("service.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("service.category.notFound.title")}
            copy={t("service.category.notFound.copy")}
            action={
              <Link className="button accent" to="/service">
                {t("common.actions.backToService")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <AppHeader title={t("service.header.title")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.category.error.title")} copy={t("service.category.error.copy")} />
        </div>
      </>
    );
  }

  const items = ensureArray(itemsQuery.data);
  const categoryTitle = getServiceCategoryTitle(category, t);

  if (itemsQuery.isPending && items.length === 0) {
    return (
      <>
        <AppHeader title={categoryTitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState
            title={t("service.category.loading.title")}
            copy={t("service.category.loading.copy", { name: categoryTitle.toLowerCase() })}
          />
        </div>
      </>
    );
  }

  if ((sectionQuery.isError && !fallbackCategory) || (itemsQuery.isError && items.length === 0)) {
    return (
      <>
        <AppHeader title={categoryTitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.category.error.title")} copy={t("service.category.error.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader title={categoryTitle} back showLanguageSwitcher />
      <div className="screen service-category-screen">
        <section className="service-category-hero panel">
          {category.image ? <img src={category.image} alt={categoryTitle} className="service-category-hero__image" /> : null}
          <div className="service-category-hero__overlay" />
          <div className="service-category-hero__body">
            <h1>{categoryTitle}</h1>
          </div>
        </section>

        <section className="section-gap-sm">
          {items.length ? (
            <div className="stack-list service-item-list">
              {items.map((item) => (
                <ServiceItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={t("service.category.empty.title", { name: categoryTitle.toLowerCase() })}
              copy={t("service.category.empty.copy")}
              action={
                <Link className="button secondary" to="/service">
                  {t("common.actions.backToService")}
                </Link>
              }
            />
          )}
        </section>
      </div>
    </>
  );
}
