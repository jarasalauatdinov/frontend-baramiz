import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";

export function NotFoundPage() {
  const { t } = useI18n();

  return (
    <>
      <AppHeader title={t("notFound.header.title")} back showLanguageSwitcher />
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
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>{t("notFound.title")}</h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 20 }}>
            {t("notFound.copy")}
          </p>
          <Link className="button accent" to="/">
            {t("notFound.cta")}
          </Link>
        </div>
      </div>
    </>
  );
}
