import { LocateFixed, MapPin, Shield } from "lucide-react";
import { useI18n } from "@/shared/i18n/provider";

interface LocationPermissionCardProps {
  isLoading?: boolean;
  onRequestLocation: () => void;
}

export function LocationPermissionCard({
  isLoading,
  onRequestLocation,
}: LocationPermissionCardProps) {
  const { t } = useI18n();

  return (
    <section className="panel location-permission-card">
      <div className="location-permission-card__icon" aria-hidden="true">
        <LocateFixed size={20} />
      </div>
      <div className="location-permission-card__copy">
        <span className="pill location-permission-card__pill">
          <MapPin size={14} />
          {t("service.utility.permission.badge")}
        </span>
        <h2>{t("service.utility.permission.title")}</h2>
        <p>{t("service.utility.permission.copy")}</p>
      </div>

      <div className="location-permission-card__benefits">
        <div className="location-permission-card__benefit">
          <MapPin size={16} />
          <span>{t("service.utility.permission.benefit.nearby")}</span>
        </div>
        <div className="location-permission-card__benefit">
          <Shield size={16} />
          <span>{t("service.utility.permission.benefit.private")}</span>
        </div>
      </div>

      <button
        type="button"
        className="button accent button--full"
        disabled={isLoading}
        onClick={onRequestLocation}
      >
        {isLoading ? t("service.utility.permission.loading") : t("service.utility.permission.action")}
      </button>
    </section>
  );
}
