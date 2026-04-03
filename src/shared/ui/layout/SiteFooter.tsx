import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Discover places", to: "/places" },
  { label: "Generate an AI route", to: "/route-generator" },
  { label: "Local services", to: "/services" },
  { label: "Guides", to: "/guides" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page">
        <div className="footer-cta panel">
          <div>
            <span className="eyebrow">Built for Jury-Ready Demos</span>
            <h2 className="display footer-title">A travel product flow that works on desktop today and adapts to mobile later.</h2>
          </div>
          <div className="button-row">
            <Link className="button accent" to="/route-generator">
              Start a route
            </Link>
            <Link className="button secondary" to="/admin/places">
              Manage places
            </Link>
          </div>
        </div>

        <div className="footer-meta">
          <div>
            <strong>Baramiz</strong>
            <p>
              Discover Karakalpakstan through curated places, route generation, local support,
              and practical MVP-friendly content management.
            </p>
          </div>
          <div className="footer-links">
            {footerLinks.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
