import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/shared/ui/layout/AppHeader";

export function NotFoundPage() {
  return (
    <>
      <AppHeader title="Not Found" back />
      <div className="screen screen--center">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              display: "grid",
              placeItems: "center",
              margin: "0 auto 16px",
              color: "var(--accent)",
            }}
          >
            <Home size={28} />
          </div>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>Page not found</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
            This screen doesn't exist.
          </p>
          <Link className="button accent" to="/">Go Home</Link>
        </div>
      </div>
    </>
  );
}
