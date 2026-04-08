import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  copy: string;
  action?: ReactNode;
  align?: "center" | "start";
  icon?: ReactNode;
}

export function EmptyState({
  title,
  copy,
  action,
  align = "center",
  icon,
}: EmptyStateProps) {
  return (
    <div className={`panel empty-card${align === "start" ? " empty-card--start" : ""}`}>
      <div className="status-badge status-badge--empty" aria-hidden="true">
        {icon ? <span className="status-icon">{icon}</span> : <span className="status-dot" />}
      </div>
      <h3 className="status-title">{title}</h3>
      <p className="status-copy">{copy}</p>
      {action ? <div className="button-row empty-actions">{action}</div> : null}
    </div>
  );
}
