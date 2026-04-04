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
import {
  useNearbyServiceCategoryItemsQuery,
  useServiceCategoryItemsQuery,
  useServiceSectionQuery,
  useServiceSectionsQuery,
} from "@/hooks/usePublicData";
import { ServiceItemCard } from "@/entities/service/ui/ServiceItemCard";
import { LocationPermissionCard } from "@/entities/service/ui/LocationPermissionCard";
import { NearbyResultsList } from "@/entities/service/ui/NearbyResultsList";
import { useCurrentLocation } from "@/hooks/useCurrentLocation";
import { useNearbyServiceItems } from "@/hooks/useNearbyServiceItems";
import { isLocationAwareUtilityCategory } from "@/shared/lib/location";
import { SectionHeader } from "@/shared/ui/shared/SectionHeader";
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
  const currentLocation = useCurrentLocation();
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

  const categoryTitle = getServiceCategoryTitle(category, t);
  const isLocationAwareCategory = isLocationAwareUtilityCategory(sectionSlug);
  const manualItemsQuery = useServiceCategoryItemsQuery(sectionSlug);
  const nearbyItemsQuery = useNearbyServiceCategoryItemsQuery(
    sectionSlug,
    isLocationAwareCategory && currentLocation.hasUsableLocation ? currentLocation.coords : null,
    5,
  );
  const manualItems = ensureArray(manualItemsQuery.data);
  const nearbyItems = useNearbyServiceItems({
    items: ensureArray(nearbyItemsQuery.data),
    currentLocation: currentLocation.coords,
  });
  const browseableItems = useNearbyServiceItems({
    items: manualItems,
    currentLocation: currentLocation.coords,
  });

  if (manualItemsQuery.isPending && manualItems.length === 0) {
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

  if ((sectionQuery.isError && !fallbackCategory) || (manualItemsQuery.isError && manualItems.length === 0)) {
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

        {isLocationAwareCategory ? (
          <section className="section-gap-sm">
            <SectionHeader
              eyebrow={t("service.utility.nearby.eyebrow")}
              title={t("service.utility.nearby.title")}
              subtitle={t("service.utility.nearby.subtitle")}
            />

            {currentLocation.status === "idle" ? (
              <LocationPermissionCard onRequestLocation={currentLocation.requestLocation} />
            ) : null}

            {currentLocation.status === "locating" ? (
              <div className="screen screen--center service-utility-state">
                <LoadingState
                  title={t("service.utility.location.loading.title")}
                  copy={t("service.utility.location.loading.copy")}
                />
              </div>
            ) : null}

            {currentLocation.status === "denied" ? (
              <EmptyState
                title={t("service.utility.location.denied.title")}
                copy={t("service.utility.location.denied.copy")}
                action={
                  <button type="button" className="button accent" onClick={currentLocation.requestLocation}>
                    {t("service.utility.location.retry")}
                  </button>
                }
              />
            ) : null}

            {currentLocation.status === "unsupported" ? (
              <EmptyState
                title={t("service.utility.location.unsupported.title")}
                copy={t("service.utility.location.unsupported.copy")}
              />
            ) : null}

            {currentLocation.status === "error" ? (
              <div className="stack-list">
                <ErrorState
                  title={t("service.utility.location.error.title")}
                  copy={t("service.utility.location.error.copy")}
                />
                <button type="button" className="button accent button--full" onClick={currentLocation.requestLocation}>
                  {t("service.utility.location.retry")}
                </button>
              </div>
            ) : null}

            {currentLocation.status === "ready" && nearbyItems.hasNearbyCoordinates ? (
              <NearbyResultsList items={nearbyItems.nearbyItems.slice(0, 5)} />
            ) : null}

            {currentLocation.status === "ready" && nearbyItemsQuery.isPending ? (
              <div className="screen screen--center service-utility-state">
                <LoadingState
                  title={t("service.utility.nearby.loading.title")}
                  copy={t("service.utility.nearby.loading.copy")}
                />
              </div>
            ) : null}

            {currentLocation.status === "ready" && nearbyItemsQuery.isError ? (
              <ErrorState
                title={t("service.utility.nearby.error.title")}
                copy={t("service.utility.nearby.error.copy")}
              />
            ) : null}

            {currentLocation.status === "ready" &&
            nearbyItemsQuery.isSuccess &&
            !nearbyItems.hasNearbyCoordinates &&
            nearbyItems.hasAnyDistance ? (
              <EmptyState
                title={t("service.utility.nearby.empty.title")}
                copy={t("service.utility.nearby.empty.copy")}
              />
            ) : null}

            {currentLocation.status === "ready" &&
            nearbyItemsQuery.isSuccess &&
            !nearbyItems.hasAnyDistance ? (
              <EmptyState
                title={t("service.utility.nearby.noCoordinates.title")}
                copy={t("service.utility.nearby.noCoordinates.copy")}
              />
            ) : null}
          </section>
        ) : null}

        <section className="section-gap-sm">
          {manualItems.length ? (
            <>
              {isLocationAwareCategory ? (
                <SectionHeader
                  eyebrow={t("service.utility.browse.eyebrow")}
                  title={t("service.utility.browse.title")}
                  subtitle={t("service.utility.browse.subtitle")}
                />
              ) : null}
              {isLocationAwareCategory ? (
                <NearbyResultsList items={browseableItems.itemsWithDistance} />
              ) : (
                <div className="stack-list service-item-list">
                  {manualItems.map((item) => (
                    <ServiceItemCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </>
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
