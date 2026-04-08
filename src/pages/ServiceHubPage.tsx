import { useDeferredValue, useMemo, useState } from "react";
import { Compass, Grid2x2, Map as MapIcon, Search } from "lucide-react";
import { Button, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { ExplorePlaceCard } from "@/entities/place/ui/ExplorePlaceCard";
import { ExploreMapPanel, type ExploreMapPoint } from "@/entities/service/ui/ExploreMapPanel";
import { ServiceItemCard } from "@/entities/service/ui/ServiceItemCard";
import { usePlacesQuery, useServiceCategoryItemsQuery, useServiceSectionsQuery } from "@/hooks/usePublicData";
import { buildMapsLink } from "@/shared/api/baramiz";
import { ensureArray } from "@/shared/api/normalize";
import { getServiceCategoryTitle } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import { resolveCategoryIcon } from "@/shared/lib/icons";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { ErrorState } from "@/shared/ui/state/ErrorState";
import { LoadingState } from "@/shared/ui/state/LoadingState";
import type { CategoryId, PublicPlace, PublicServiceItem, ServiceCategorySlug, ServiceHubCategory } from "@/shared/types/api";

type ExploreFilter = "all" | ServiceCategorySlug;
type ExploreView = "grid" | "map";

const PLACE_CATEGORY_MAP: Partial<Record<ServiceCategorySlug, CategoryId[]>> = {
  "history-and-culture": ["history", "culture"],
  "museums-and-exhibitions": ["museum", "culture"],
  nature: ["nature", "adventure"],
  restaurants: ["food"],
  sightseeing: ["history", "culture", "museum"],
};

function matchesSearch(value: string, fields: Array<string | undefined>) {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return true;
  }

  return fields.some((field) => field?.toLowerCase().includes(normalizedValue));
}

function normalizeCoordinate(value: number, min: number, max: number) {
  if (!Number.isFinite(value) || min === max) {
    return 50;
  }

  return ((value - min) / (max - min)) * 100;
}

function buildPlaceMapPoints(places: PublicPlace[]): ExploreMapPoint[] {
  const withCoordinates = places.filter(
    (place) => Number.isFinite(place.coordinates?.lat) && Number.isFinite(place.coordinates?.lng),
  );

  if (!withCoordinates.length) {
    return [];
  }

  const lats = withCoordinates.map((place) => place.coordinates.lat);
  const lngs = withCoordinates.map((place) => place.coordinates.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return withCoordinates.map((place) => ({
    id: place.id,
    image: place.image,
    internalPath: `/places/${place.id}`,
    mapPath: buildMapsLink(place.coordinates.lat, place.coordinates.lng),
    subtitle: place.shortDescription || place.region || place.city,
    title: place.name,
    x: normalizeCoordinate(place.coordinates.lng, minLng, maxLng),
    y: 100 - normalizeCoordinate(place.coordinates.lat, minLat, maxLat),
  }));
}

function buildServiceMapPoints(items: PublicServiceItem[]): ExploreMapPoint[] {
  const withCoordinates = items.filter(
    (item) => Number.isFinite(item.coordinates?.lat) && Number.isFinite(item.coordinates?.lng),
  );

  if (!withCoordinates.length) {
    return [];
  }

  const lats = withCoordinates.map((item) => item.coordinates!.lat);
  const lngs = withCoordinates.map((item) => item.coordinates!.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return withCoordinates.map((item) => ({
    id: item.id,
    image: item.image,
    internalPath: item.detailPath || `/service/${item.sectionSlug}/${item.slug}`,
    mapPath: item.mapLink,
    subtitle: item.address || item.shortDescription || item.city || "",
    title: item.title,
    x: normalizeCoordinate(item.coordinates!.lng, minLng, maxLng),
    y: 100 - normalizeCoordinate(item.coordinates!.lat, minLat, maxLat),
  }));
}

export function ServiceHubPage() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<ExploreFilter>("all");
  const [view, setView] = useState<ExploreView>("grid");
  const deferredSearch = useDeferredValue(search);

  const sectionsQuery = useServiceSectionsQuery();
  const placesQuery = usePlacesQuery();
  const selectedCategorySlug = selectedFilter === "all" ? undefined : selectedFilter;
  const selectedCategoryItemsQuery = useServiceCategoryItemsQuery(selectedCategorySlug);

  const sections = useMemo(
    () =>
      ensureArray(sectionsQuery.data)
        .filter((category) => category.isActive)
        .sort(
          (left, right) =>
            left.order - right.order ||
            getServiceCategoryTitle(left, t).localeCompare(getServiceCategoryTitle(right, t)),
        ),
    [sectionsQuery.data, t],
  );

  const selectedSection = sections.find((section) => section.slug === selectedCategorySlug) ?? null;
  const places = ensureArray(placesQuery.data);
  const selectedItems = ensureArray(selectedCategoryItemsQuery.data);

  const filteredPlaces = useMemo(() => {
    const allowedCategories = selectedCategorySlug ? PLACE_CATEGORY_MAP[selectedCategorySlug] : undefined;

    return places.filter((place) => {
      const matchesCategory = !allowedCategories || allowedCategories.includes(place.category);

      return (
        matchesCategory &&
        matchesSearch(deferredSearch, [
          place.name,
          place.city,
          place.region,
          place.description,
          place.shortDescription,
        ])
      );
    });
  }, [deferredSearch, places, selectedCategorySlug]);

  const filteredItems = useMemo(
    () =>
      selectedItems.filter((item) =>
        matchesSearch(deferredSearch, [
          item.title,
          item.city,
          item.address,
          item.shortDescription,
          item.description,
          item.serviceType,
        ]),
      ),
    [deferredSearch, selectedItems],
  );

  const isUtilityFilter = selectedSection?.type === "utility";
  const showingServiceItems = isUtilityFilter;
  const mapPoints = showingServiceItems ? buildServiceMapPoints(filteredItems) : buildPlaceMapPoints(filteredPlaces);
  const hasActiveFilters = Boolean(deferredSearch.trim() || selectedFilter !== "all");

  if ((sectionsQuery.isPending || placesQuery.isPending) && !sections.length && !places.length) {
    return (
      <>
        <AppHeader
          title={t("service.header.title")}
          subtitle={t("service.header.subtitle")}
          showLanguageSwitcher
        />
        <div className="screen screen--center">
          <LoadingState title={t("service.loading.title")} copy={t("service.loading.copy")} />
        </div>
      </>
    );
  }

  if ((sectionsQuery.isError && !sections.length) || (placesQuery.isError && !places.length)) {
    return (
      <>
        <AppHeader
          title={t("service.header.title")}
          subtitle={t("service.header.subtitle")}
          showLanguageSwitcher
        />
        <div className="screen screen--center">
          <ErrorState title={t("service.error.title")} copy={t("service.error.copy")} />
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader
        title={t("service.header.title")}
        subtitle={t("service.header.subtitle")}
        showLanguageSwitcher
      />
      <div className="screen explore-screen">
        <section className="explore-toolbar">
          <div className="search-bar explore-toolbar__search">
            <Search size={18} />
            <input
              aria-label={t("places.search.placeholder")}
              placeholder={t("places.search.placeholder")}
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
            />
          </div>

          <div className="category-scroll explore-filter-scroll">
            <button
              type="button"
              className={`chip ${selectedFilter === "all" ? "is-active" : ""}`}
              onClick={() => setSelectedFilter("all")}
            >
              {t("places.filters.all")}
            </button>
            {sections.map((section) => {
              const Icon = resolveCategoryIcon(section.icon);
              return (
                <button
                  key={section.slug}
                  type="button"
                  className={`chip explore-filter-chip ${selectedFilter === section.slug ? "is-active" : ""}`}
                  onClick={() => setSelectedFilter(section.slug)}
                >
                  <Icon size={14} />
                  {getServiceCategoryTitle(section, t)}
                </button>
              );
            })}
          </div>

          <Group justify="space-between" align="center" wrap="nowrap">
            <div>
              <Text fw={800} size="sm">
                {selectedSection ? getServiceCategoryTitle(selectedSection, t) : t("places.header.title")}
              </Text>
              <Text c="dimmed" size="xs">
                {showingServiceItems
                  ? t("explore.results.items", { count: filteredItems.length })
                  : t("explore.results.places", { count: filteredPlaces.length })}
              </Text>
            </div>
            <SegmentedControl
              className="explore-view-toggle"
              data={[
                {
                  label: <Group gap={6} wrap="nowrap"><Grid2x2 size={14} /><span>{t("explore.toggle.grid")}</span></Group>,
                  value: "grid",
                },
                {
                  label: <Group gap={6} wrap="nowrap"><MapIcon size={14} /><span>{t("explore.toggle.map")}</span></Group>,
                  value: "map",
                },
              ]}
              radius="xl"
              size="xs"
              value={view}
              onChange={(value) => setView(value as ExploreView)}
            />
          </Group>
        </section>

        {view === "map" ? (
          <ExploreMapPanel
            emptyCopy={
              showingServiceItems
                ? t("explore.map.limited.copy")
                : t("explore.map.empty.copy")
            }
            emptyTitle={
              showingServiceItems ? t("explore.map.limited.title") : t("explore.map.empty.title")
            }
            points={mapPoints}
          />
        ) : null}

        {view === "grid" ? (
          showingServiceItems ? (
            filteredItems.length ? (
              <section className="explore-results-list">
                {filteredItems.map((item) => (
                  <ServiceItemCard key={item.id} item={item} />
                ))}
              </section>
            ) : selectedCategoryItemsQuery.isPending ? (
              <div className="screen screen--center">
                <LoadingState title={t("service.loading.title")} copy={t("service.loading.copy")} />
              </div>
            ) : selectedCategoryItemsQuery.isError ? (
              <ErrorState title={t("service.error.title")} copy={t("service.error.copy")} />
            ) : (
              <EmptyState
                align="start"
                icon={<Compass size={20} />}
                title={hasActiveFilters ? t("explore.empty.filtered.title") : t("service.empty.title")}
                copy={hasActiveFilters ? t("explore.empty.filtered.copy") : t("service.empty.copy")}
                action={
                  <Button
                    color="baramizGold"
                    radius="xl"
                    onClick={() => {
                      setSearch("");
                      setSelectedFilter("all");
                    }}
                  >
                    {hasActiveFilters ? t("common.actions.clearFilters") : t("common.actions.backToService")}
                  </Button>
                }
              />
            )
          ) : filteredPlaces.length ? (
            <section className="explore-place-grid">
              {filteredPlaces.map((place) => (
                <ExplorePlaceCard key={place.id} place={place} />
              ))}
            </section>
          ) : (
            <EmptyState
              align="start"
              icon={<Compass size={20} />}
              title={hasActiveFilters ? t("explore.empty.filtered.title") : t("places.empty.title")}
              copy={hasActiveFilters ? t("explore.empty.filtered.copy") : t("places.empty.copy")}
              action={
                hasActiveFilters ? (
                  <button
                    type="button"
                    className="button secondary"
                    onClick={() => {
                      setSearch("");
                      setSelectedFilter("all");
                    }}
                  >
                    {t("common.actions.clearFilters")}
                  </button>
                ) : (
                  <Link className="button accent" to="/route">
                    {t("common.actions.buildRoute")}
                  </Link>
                )
              }
            />
          )
        ) : null}

        {!showingServiceItems && sections.filter((section) => section.type === "utility").length ? (
          <section className="explore-support-strip">
            <Text className="explore-support-strip__title">{t("explore.support.utility")}</Text>
            <div className="category-scroll explore-support-strip__row">
              {sections
                .filter((section) => section.type === "utility")
                .map((section) => {
                  const Icon = resolveCategoryIcon(section.icon);
                  return (
                    <button
                      key={section.slug}
                      type="button"
                      className="chip explore-filter-chip"
                      onClick={() => {
                        setSelectedFilter(section.slug);
                        setView("grid");
                      }}
                    >
                      <Icon size={14} />
                      {getServiceCategoryTitle(section, t)}
                    </button>
                  );
                })}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
