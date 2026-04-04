import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  copy: string;
  action?: ReactNode;
}

export function EmptyState({ title, copy, action }: EmptyStateProps) {
  return (
    <div className="panel empty-card">
      <div className="status-badge status-badge--empty" aria-hidden="true">
        <span className="status-dot" />
      </div>
      <h3 className="status-title">{title}</h3>
      <p className="status-copy">{copy}</p>
      {action ? <div className="button-row empty-actions">{action}</div> : null}
    </div>
  );
}
