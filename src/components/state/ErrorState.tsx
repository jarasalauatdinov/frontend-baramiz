interface ErrorStateProps {
  title?: string;
  copy?: string;
}

export function ErrorState({
  title = "Something did not load correctly",
  copy = "The API responded with an error. Please check that the backend is running and try again.",
}: ErrorStateProps) {
  return (
    <div className="panel error-card">
      <h3 className="status-title">{title}</h3>
      <p className="status-copy">{copy}</p>
    </div>
  );
}
