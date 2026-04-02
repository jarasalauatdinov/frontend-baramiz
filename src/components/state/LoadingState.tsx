interface LoadingStateProps {
  title?: string;
  copy?: string;
}

export function LoadingState({
  title = "Loading Baramiz data",
  copy = "We are pulling in the latest tourism content from the backend.",
}: LoadingStateProps) {
  return (
    <div className="panel status-card">
      <h3 className="status-title">{title}</h3>
      <p className="status-copy">{copy}</p>
    </div>
  );
}
