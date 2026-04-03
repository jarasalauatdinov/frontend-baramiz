import { useI18n } from "@/shared/i18n/provider";

interface LoadingStateProps {
  title?: string;
  copy?: string;
}

export function LoadingState({ title, copy }: LoadingStateProps) {
  const { t } = useI18n();

  return (
    <div className="panel status-card">
      <h3 className="status-title">{title ?? t("common.loading.title")}</h3>
      <p className="status-copy">{copy ?? t("common.loading.copy")}</p>
    </div>
  );
}
