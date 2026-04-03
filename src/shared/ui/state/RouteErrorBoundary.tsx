import { Link, useRouteError } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { ErrorState } from "@/shared/ui/state/ErrorState";

export function RouteErrorBoundary() {
  const { t } = useI18n();
  const routeError = useRouteError();
  const message = routeError instanceof Error
    ? routeError.message
    : t("state.routeError.copy");

  return (
    <div className="screen">
      <ErrorState title={t("state.routeError.title")} copy={message} />
      <div className="button-row" style={{ marginTop: 16 }}>
        <Link className="button accent" to="/">
          {t("state.routeError.home")}
        </Link>
        <Link className="button secondary" to="/route-generator">
          {t("state.routeError.route")}
        </Link>
      </div>
    </div>
  );
}
