import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceHeroCardProps {
  title: string;
  subtitle: string;
  copy: string;
  ctaLabel: string;
  ctaTo: string;
}

export function ServiceHeroCard({
  title,
  subtitle,
  copy,
  ctaLabel,
  ctaTo,
}: ServiceHeroCardProps) {
  return (
    <section className="service-hero-card panel">
      <div className="service-hero-card__eyebrow">
        <Sparkles size={15} />
        {subtitle}
      </div>
      <h1>{title}</h1>
      <p>{copy}</p>
      <div className="service-hero-card__footer">
        <div className="meta-row">
          <span className="tag">Travel essentials</span>
          <span className="tag">Local help</span>
          <span className="tag">Mobile-ready</span>
        </div>
        <Link className="button accent" to={ctaTo}>
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
