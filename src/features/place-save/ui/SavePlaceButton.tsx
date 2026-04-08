import { Bookmark, Check } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/shared/i18n/provider";
import {
  isPlaceSaved,
  SAVED_PLACE_IDS_KEY,
  SAVED_PLACES_EVENT,
  toggleSavedPlace,
} from "@/features/place-save/model/storage";

type SaveLabelKey = "idle" | "saved" | "removed";

interface SavePlaceButtonProps {
  placeId: string;
  variant?: "compact" | "full";
}

const SAVE_LABELS = {
  en: {
    idle: "Save place",
    saved: "Saved",
    removed: "Removed",
  },
  ru: {
    idle: "Сохранить",
    saved: "Сохранено",
    removed: "Убрано",
  },
  uz: {
    idle: "Saqlash",
    saved: "Saqlandi",
    removed: "Olib tashlandi",
  },
  kaa: {
    idle: "Saqlaw",
    saved: "Saqlandı",
    removed: "Alıp taslandı",
  },
} as const;

export function SavePlaceButton({
  placeId,
  variant = "compact",
}: SavePlaceButtonProps) {
  const { language } = useI18n();
  const labels = SAVE_LABELS[language] ?? SAVE_LABELS.en;
  const timeoutRef = useRef<number | null>(null);
  const [saved, setSaved] = useState(() => isPlaceSaved(placeId));
  const [feedback, setFeedback] = useState<SaveLabelKey | null>(null);

  useEffect(() => {
    setSaved(isPlaceSaved(placeId));
  }, [placeId]);

  useEffect(() => {
    function handleSavedPlacesChanged(event: Event) {
      const customEvent = event as CustomEvent<{ placeId?: string; isSaved?: boolean }>;
      if (!customEvent.detail?.placeId || customEvent.detail.placeId !== placeId) {
        return;
      }

      setSaved(Boolean(customEvent.detail.isSaved));
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== null && event.key !== SAVED_PLACE_IDS_KEY) {
        return;
      }

      setSaved(isPlaceSaved(placeId));
    }

    window.addEventListener(SAVED_PLACES_EVENT, handleSavedPlacesChanged as EventListener);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(SAVED_PLACES_EVENT, handleSavedPlacesChanged as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, [placeId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentLabel = useMemo(() => {
    if (feedback) {
      return labels[feedback];
    }

    return saved ? labels.saved : labels.idle;
  }, [feedback, labels, saved]);

  function handleClick() {
    const nextSaved = toggleSavedPlace(placeId);
    setSaved(nextSaved);
    setFeedback(nextSaved ? "saved" : "removed");

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setFeedback(null);
    }, 900);
  }

  return (
    <button
      type="button"
      aria-pressed={saved}
      className={[
        "save-place-button",
        `save-place-button--${variant}`,
        saved ? "is-saved" : "",
        feedback ? `is-feedback is-feedback--${feedback}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={handleClick}
    >
      <span className="save-place-button__icon" aria-hidden="true">
        {saved ? <Check size={15} /> : <Bookmark size={15} />}
      </span>
      <span className="save-place-button__label">{currentLabel}</span>
    </button>
  );
}
