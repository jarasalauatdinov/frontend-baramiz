import { Link } from "react-router-dom";
import { EmptyState } from "@/components/state/EmptyState";

export function NotFoundPage() {
  return (
    <div className="page">
      <EmptyState
        title="Page not found"
        copy="This route does not exist in the current Baramiz frontend, but the main travel flows are ready to explore."
        action={
          <>
            <Link className="button accent" to="/">
              Back to home
            </Link>
            <Link className="button secondary" to="/route-generator">
              Open route generator
            </Link>
          </>
        }
      />
    </div>
  );
}
