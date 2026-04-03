import { type ReactNode } from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  right?: ReactNode;
}

export function AppHeader({ title, subtitle, back, right }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div className="app-header__left">
        {back ? (
          <button
            type="button"
            className="app-header__back"
            aria-label="Go back"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </button>
        ) : null}
      </div>
      <div className="app-header__center">
        <h1 className="app-header__title">{title}</h1>
        {subtitle ? (
          <p className="app-header__subtitle">{subtitle}</p>
        ) : null}
      </div>
      <div className="app-header__right">{right}</div>
    </header>
  );
}
