import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/shared/ui/shared/Button";
import type { AdminPlace, AdminPlaceInput, PublicCategory, TranslationResult } from "@/shared/types/api";

const adminPlaceSchema = z.object({
  name_kaa: z.string().trim().min(1, "Karakalpak name is required"),
  name_uz: z.string().trim().min(1, "Uzbek name is required"),
  name_ru: z.string().trim().optional(),
  name_en: z.string().trim().optional(),
  description_kaa: z.string().trim().min(1, "Karakalpak description is required"),
  description_uz: z.string().trim().min(1, "Uzbek description is required"),
  description_ru: z.string().trim().optional(),
  description_en: z.string().trim().optional(),
  image: z.string().trim().url("Enter a valid image URL"),
  city: z.string().trim().min(1, "City is required"),
  region: z.string().trim().min(1, "Region is required"),
  category: z.enum(["history", "culture", "museum", "nature", "adventure", "food"]),
  featured: z.boolean(),
  coordinates: z.object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
  }),
  durationMinutes: z.coerce.number().int().positive(),
  autoTranslate: z.boolean().optional().default(false),
});

type AdminPlaceFormValues = z.input<typeof adminPlaceSchema>;
type AdminPlaceSubmitValues = z.output<typeof adminPlaceSchema>;

interface AdminPlaceFormProps {
  categories: PublicCategory[];
  selectedPlace?: AdminPlace | null;
  isSaving: boolean;
  isDeleting: boolean;
  isTranslating: boolean;
  onCreate: (payload: AdminPlaceInput) => Promise<void>;
  onUpdate: (placeId: string, payload: AdminPlaceInput) => Promise<void>;
  onDelete: (placeId: string) => Promise<void>;
  onTranslate: (payload: { name_uz: string; description_uz: string }) => Promise<TranslationResult>;
  onResetSelection: () => void;
}

function getDefaultValues(selectedPlace?: AdminPlace | null): AdminPlaceFormValues {
  if (!selectedPlace) {
    return {
      name_kaa: "",
      name_uz: "",
      name_ru: "",
      name_en: "",
      description_kaa: "",
      description_uz: "",
      description_ru: "",
      description_en: "",
      image: "",
      city: "",
      region: "Karakalpakstan",
      category: "culture",
      featured: true,
      coordinates: {
        lat: 42.46,
        lng: 59.61,
      },
      durationMinutes: 90,
      autoTranslate: false,
    };
  }

  return {
    name_kaa: selectedPlace.name_kaa,
    name_uz: selectedPlace.name_uz,
    name_ru: selectedPlace.name_ru,
    name_en: selectedPlace.name_en,
    description_kaa: selectedPlace.description_kaa,
    description_uz: selectedPlace.description_uz,
    description_ru: selectedPlace.description_ru,
    description_en: selectedPlace.description_en,
    image: selectedPlace.image,
    city: selectedPlace.city,
    region: selectedPlace.region,
    category: selectedPlace.category,
    featured: selectedPlace.featured,
    coordinates: selectedPlace.coordinates,
    durationMinutes: selectedPlace.durationMinutes,
    autoTranslate: false,
  };
}

export function AdminPlaceForm({
  categories,
  selectedPlace,
  isSaving,
  isDeleting,
  isTranslating,
  onCreate,
  onUpdate,
  onDelete,
  onTranslate,
  onResetSelection,
}: AdminPlaceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AdminPlaceFormValues, undefined, AdminPlaceSubmitValues>({
    resolver: zodResolver(adminPlaceSchema),
    defaultValues: getDefaultValues(selectedPlace),
  });

  useEffect(() => {
    reset(getDefaultValues(selectedPlace));
  }, [reset, selectedPlace]);

  const nameUz = watch("name_uz");
  const descriptionUz = watch("description_uz");

  const submit = handleSubmit(async (values) => {
    const payload: AdminPlaceInput = {
      ...values,
      name_ru: values.name_ru || undefined,
      name_en: values.name_en || undefined,
      description_ru: values.description_ru || undefined,
      description_en: values.description_en || undefined,
    };

    if (selectedPlace) {
      await onUpdate(selectedPlace.id, payload);
      return;
    }

    await onCreate(payload);
    reset(getDefaultValues(null));
  });

  const translate = async () => {
    const translation = await onTranslate({
      name_uz: nameUz,
      description_uz: descriptionUz,
    });

    setValue("name_ru", translation.name_ru, { shouldDirty: true });
    setValue("name_en", translation.name_en, { shouldDirty: true });
    setValue("description_ru", translation.description_ru, { shouldDirty: true });
    setValue("description_en", translation.description_en, { shouldDirty: true });
  };

  const handleDelete = async () => {
    if (!selectedPlace) {
      return;
    }

    if (!window.confirm(`Delete "${selectedPlace.name}" from the catalog?`)) {
      return;
    }

    await onDelete(selectedPlace.id);
  };

  return (
    <section className="panel admin-form">
      <div className="admin-form__header">
        <div>
          <span className="eyebrow">Content Management</span>
          <h2>{selectedPlace ? "Edit selected place" : "Create a new place"}</h2>
          <p>
            Keep the admin lightweight: manage key tourism places, optionally translate from Uzbek,
            and publish directly into the backend-backed catalog.
          </p>
        </div>
        <div className="button-row">
          <Button type="button" variant="secondary" onClick={onResetSelection}>
            Create new
          </Button>
          <Button type="button" variant="ghost" disabled={isTranslating} onClick={() => void translate()}>
            <Sparkles size={16} />
            {isTranslating ? "Translating..." : "Translate RU + EN"}
          </Button>
        </div>
      </div>

      <form className="form-grid" onSubmit={(event) => void submit(event)}>
        <div className="admin-form__grid admin-form__grid--2">
          <label className="input-label">
            Name (KAA)
            <input className="text-input" {...register("name_kaa")} />
            {errors.name_kaa ? <span className="field-error">{errors.name_kaa.message}</span> : null}
          </label>
          <label className="input-label">
            Name (UZ)
            <input className="text-input" {...register("name_uz")} />
            {errors.name_uz ? <span className="field-error">{errors.name_uz.message}</span> : null}
          </label>
          <label className="input-label">
            Name (RU)
            <input className="text-input" {...register("name_ru")} />
          </label>
          <label className="input-label">
            Name (EN)
            <input className="text-input" {...register("name_en")} />
          </label>
        </div>

        <div className="admin-form__grid admin-form__grid--2">
          <label className="input-label">
            Description (KAA)
            <textarea className="text-area" {...register("description_kaa")} />
            {errors.description_kaa ? <span className="field-error">{errors.description_kaa.message}</span> : null}
          </label>
          <label className="input-label">
            Description (UZ)
            <textarea className="text-area" {...register("description_uz")} />
            {errors.description_uz ? <span className="field-error">{errors.description_uz.message}</span> : null}
          </label>
          <label className="input-label">
            Description (RU)
            <textarea className="text-area" {...register("description_ru")} />
          </label>
          <label className="input-label">
            Description (EN)
            <textarea className="text-area" {...register("description_en")} />
          </label>
        </div>

        <div className="admin-form__grid admin-form__grid--2">
          <label className="input-label">
            Hero image URL
            <input className="text-input" {...register("image")} />
            {errors.image ? <span className="field-error">{errors.image.message}</span> : null}
          </label>
          <label className="input-label">
            City
            <input className="text-input" {...register("city")} />
            {errors.city ? <span className="field-error">{errors.city.message}</span> : null}
          </label>
          <label className="input-label">
            Region
            <input className="text-input" {...register("region")} />
            {errors.region ? <span className="field-error">{errors.region.message}</span> : null}
          </label>
          <label className="input-label">
            Category
            <select className="select-input" {...register("category")}>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category ? <span className="field-error">{errors.category.message}</span> : null}
          </label>
          <label className="input-label">
            Duration minutes
            <input className="text-input" type="number" {...register("durationMinutes")} />
            {errors.durationMinutes ? <span className="field-error">{errors.durationMinutes.message}</span> : null}
          </label>
          <label className="input-label">
            Latitude
            <input className="text-input" type="number" step="0.0001" {...register("coordinates.lat")} />
            {errors.coordinates?.lat ? <span className="field-error">{errors.coordinates.lat.message}</span> : null}
          </label>
          <label className="input-label">
            Longitude
            <input className="text-input" type="number" step="0.0001" {...register("coordinates.lng")} />
            {errors.coordinates?.lng ? <span className="field-error">{errors.coordinates.lng.message}</span> : null}
          </label>
        </div>

        <div className="admin-form__checks">
          <label className="check-row">
            <input type="checkbox" {...register("featured")} />
            Feature this place in discovery sections
          </label>
          <label className="check-row">
            <input type="checkbox" {...register("autoTranslate")} />
            Ask backend to auto-translate on save
          </label>
        </div>

        <div className="button-row">
          <Button type="submit" variant="accent" disabled={isSaving}>
            {isSaving ? "Saving..." : selectedPlace ? "Save changes" : "Create place"}
          </Button>
          {selectedPlace ? (
            <Button type="button" variant="ghost" disabled={isDeleting} onClick={() => void handleDelete()}>
              {isDeleting ? "Deleting..." : "Delete place"}
            </Button>
          ) : null}
        </div>
      </form>
    </section>
  );
}
