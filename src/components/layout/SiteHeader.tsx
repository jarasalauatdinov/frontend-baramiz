import { AnimatePresence, motion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useHealthQuery } from "@/hooks/usePublicData";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Places", to: "/places" },
  { label: "Route AI", to: "/route-generator" },
  { label: "Services", to: "/services" },
  { label: "Guides", to: "/guides" },
  { label: "Events", to: "/events" },
  { label: "Admin", to: "/admin/places" },
];

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const healthQuery = useHealthQuery();
  const isHealthy = healthQuery.data?.status === "ok";
  const healthLabel = healthQuery.isError ? "API unreachable" : isHealthy ? "API live" : "Checking API";

  return (
    <header className="site-header-wrap">
      <div className="site-header panel">
        <NavLink className="brand-mark" to="/" onClick={() => setIsMenuOpen(false)}>
          <span className="brand-mark__icon">
            <Sparkles size={18} />
          </span>
          <span>
            <strong>Baramiz</strong>
            <small>AI tourism platform</small>
          </span>
        </NavLink>

        <nav className="desktop-nav" aria-label="Primary">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cn("nav-link", isActive && "is-active")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <div className="pill header-health">
            <span className={cn("dot", !isHealthy && "dot-muted")} />
            {healthLabel}
          </div>
          <button
            type="button"
            className="menu-button"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen ? (
          <motion.div
            className="mobile-nav panel"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn("mobile-nav__link", isActive && "is-active")}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
