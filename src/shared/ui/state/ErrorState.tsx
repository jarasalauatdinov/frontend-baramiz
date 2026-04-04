import { useI18n } from "@/shared/i18n/provider";

interface ErrorStateProps {
  title?: string;
  copy?: string;
}

export function ErrorState({ title, copy }: ErrorStateProps) {
  const { t } = useI18n();

  return (
    <div className="panel error-card" role="alert">
      <div className="status-badge status-badge--error" aria-hidden="true">
        <span className="status-dot" />
      </div>
      <h3 className="status-title">{title ?? t("common.error.title")}</h3>
      <p className="status-copy">{copy ?? t("common.error.copy")}</p>
    </div>
  );
}
