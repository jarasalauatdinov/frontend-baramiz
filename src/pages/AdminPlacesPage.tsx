import { useDeferredValue, useState } from "react";
import { Edit3, PlusCircle, Search } from "lucide-react";
import { AdminPlaceForm } from "@/components/admin/AdminPlaceForm";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import {
  useAdminPlacesQuery,
  useCreateAdminPlaceMutation,
  useDeleteAdminPlaceMutation,
  useTranslateAdminPlaceMutation,
  useUpdateAdminPlaceMutation,
} from "@/hooks/useAdminPlaces";
import { useCategoriesQuery } from "@/hooks/usePublicData";
import type { AdminPlace, AdminPlaceInput } from "@/types/api";

const interestCategoryIds = new Set(["history", "culture", "museum", "nature", "adventure", "food"]);

export function AdminPlacesPage() {
  const [selectedPlace, setSelectedPlace] = useState<AdminPlace | null>(null);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const placesQuery = useAdminPlacesQuery();
  const categoriesQuery = useCategoriesQuery();
  const createMutation = useCreateAdminPlaceMutation();
  const updateMutation = useUpdateAdminPlaceMutation();
  const deleteMutation = useDeleteAdminPlaceMutation();
  const translateMutation = useTranslateAdminPlaceMutation();

  const categories = (categoriesQuery.data ?? []).filter((category) => interestCategoryIds.has(category.id));

  const filteredPlaces = (() => {
    const value = deferredSearch.trim().toLowerCase();
    if (!value) {
      return placesQuery.data ?? [];
    }

    return (placesQuery.data ?? []).filter((place) =>
      [place.name, place.city, place.region, place.name_uz].some((field) => field.toLowerCase().includes(value)),
    );
  })();

  if ((placesQuery.isPending && !placesQuery.data) || (categoriesQuery.isPending && !categoriesQuery.data)) {
    return (
      <div className="page">
        <LoadingState title="Loading admin catalog" copy="Fetching editable places and categories." />
      </div>
    );
  }

  if (placesQuery.isError || categoriesQuery.isError) {
    return (
      <div className="page">
        <ErrorState title="Admin data failed to load" copy="Please confirm the backend is running and the admin place endpoints are reachable." />
      </div>
    );
  }

  const saveError =
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    translateMutation.error?.message;

  const handleCreate = async (payload: AdminPlaceInput) => {
    await createMutation.mutateAsync(payload);
  };

  const handleUpdate = async (placeId: string, payload: AdminPlaceInput) => {
    await updateMutation.mutateAsync({ placeId, payload });
  };

  const handleDelete = async (placeId: string) => {
    await deleteMutation.mutateAsync(placeId);
    setSelectedPlace(null);
  };

  return (
    <div className="page">
      <section className="page-hero panel">
        <span className="eyebrow">MVP Admin</span>
        <h1 className="display">Practical place management without enterprise overhead.</h1>
        <p>
          This admin keeps the content workflow lean: list, create, edit, delete, and optionally translate place content through the backend.
        </p>
        {saveError ? <div className="field-error">{saveError}</div> : null}
      </section>

      <section className="section admin-layout">
        <div className="panel admin-list">
          <div className="admin-list__header">
            <div>
              <span className="eyebrow">Catalog</span>
              <h2>Existing places</h2>
            </div>
            <button type="button" className="button secondary" onClick={() => setSelectedPlace(null)}>
              <PlusCircle size={16} />
              New place
            </button>
          </div>

          <label className="input-label">
            Search places
            <div className="filters-bar__search">
              <Search size={16} />
              <input
                className="text-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title or city"
              />
            </div>
          </label>

          <div className="admin-list__items">
            {filteredPlaces.map((place) => (
              <button
                key={place.id}
                type="button"
                className={`admin-place-card panel ${selectedPlace?.id === place.id ? "is-selected" : ""}`}
                onClick={() => setSelectedPlace(place)}
              >
                <img src={place.image} alt={place.name} />
                <div>
                  <span className="eyebrow">{place.city}</span>
                  <h3>{place.name}</h3>
                  <p>{place.description}</p>
                  <div className="meta-row">
                    <span className="tag">{place.category}</span>
                    <span className="tag">{place.durationMinutes} min</span>
                    {place.featured ? <span className="tag tag-featured">Featured</span> : null}
                  </div>
                </div>
                <Edit3 size={16} />
              </button>
            ))}
          </div>
        </div>

        <AdminPlaceForm
          categories={categories}
          selectedPlace={selectedPlace}
          isSaving={createMutation.isPending || updateMutation.isPending}
          isDeleting={deleteMutation.isPending}
          isTranslating={translateMutation.isPending}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onTranslate={(payload) => translateMutation.mutateAsync(payload)}
          onResetSelection={() => setSelectedPlace(null)}
        />
      </section>
    </div>
  );
}
