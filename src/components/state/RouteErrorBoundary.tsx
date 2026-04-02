import { Link, useRouteError } from "react-router-dom";
import { ErrorState } from "@/components/state/ErrorState";

export function RouteErrorBoundary() {
  const routeError = useRouteError();
  const message = routeError instanceof Error
    ? routeError.message
    : "The page hit an unexpected runtime issue, but the app is still available.";

  return (
    <div className="page">
      <ErrorState title="This screen failed safely" copy={message} />
      <div className="button-row" style={{ marginTop: 16 }}>
        <Link className="button accent" to="/">
          Back to home
        </Link>
        <Link className="button secondary" to="/route-generator">
          Open route generator
        </Link>
      </div>
    </div>
  );
}
