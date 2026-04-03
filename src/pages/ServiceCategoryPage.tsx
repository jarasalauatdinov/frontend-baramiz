import { Link, useParams } from "react-router-dom";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import {
  getServiceCategoryDescription,
  getServiceCategorySubtitle,
  getServiceCategoryTitle,
  getServiceGroupBadge,
} from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";
import {
  getFallbackServiceCategoryItems,
  getServiceCategoryOrFallback,
} from "@/shared/api/baramiz";
import { useServiceCategoryItemsQuery } from "@/hooks/usePublicData";
import { ServiceItemCard } from "@/entities/service/ui/ServiceItemCard";

export function ServiceCategoryPage() {
  const { t } = useI18n();
  const { categorySlug = "" } = useParams<{ categorySlug: string }>();
  const category = getServiceCategoryOrFallback(categorySlug);
  const itemsQuery = useServiceCategoryItemsQuery(category?.slug);

  if (!category) {
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

  const fallbackItems = getFallbackServiceCategoryItems(category.slug);
  const items = itemsQuery.data?.length ? itemsQuery.data : fallbackItems;
  const categoryTitle = getServiceCategoryTitle(category, t);
  const categorySubtitle = getServiceCategorySubtitle(category, t);
  const categoryDescription = getServiceCategoryDescription(category, t);

  if (itemsQuery.isPending && items.length === 0) {
    return (
      <>
        <AppHeader title={categoryTitle} subtitle={categorySubtitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <LoadingState
            title={t("service.category.loading.title")}
            copy={t("service.category.loading.copy", { name: categoryTitle.toLowerCase() })}
          />
        </div>
      </>
    );
  }

  if (itemsQuery.isError && items.length === 0) {
    return (
      <>
        <AppHeader title={categoryTitle} subtitle={categorySubtitle} back showLanguageSwitcher />
        <div className="screen screen--center">
          <ErrorState title={t("service.category.error.title")} copy={t("service.category.error.copy")} />
        </div>
      </>
    );
  }

  const isUsingFallback = !itemsQuery.data?.length && fallbackItems.length > 0;

  return (
    <>
      <AppHeader title={categoryTitle} subtitle={categorySubtitle} back showLanguageSwitcher />
      <div className="screen service-category-screen">
        <section className="service-category-hero panel">
          <img src={category.image} alt={categoryTitle} className="service-category-hero__image" />
          <div className="service-category-hero__overlay" />
          <div className="service-category-hero__body">
            <span className="tag">{getServiceGroupBadge(category.group, t)}</span>
            <h1>{categoryTitle}</h1>
            <p>{categoryDescription}</p>
          </div>
        </section>

        {isUsingFallback ? (
          <div className="service-category-note">{t("service.category.fallback")}</div>
        ) : null}

        <section className="section-gap-sm">
          <SectionHeader
            eyebrow={t("service.category.collection.eyebrow")}
            title={t("service.category.collection.title", { name: categoryTitle })}
            subtitle={t("service.category.collection.subtitle")}
          />
          {items.length ? (
            <div className="stack-list">
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
