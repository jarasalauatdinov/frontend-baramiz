import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { getServiceCategoryTitle } from "@/shared/i18n/helpers";
import { useI18n } from "@/shared/i18n/provider";
import type { ServiceHubCategory } from "@/shared/types/api";
import { resolveCategoryIcon } from "@/shared/lib/icons";

interface CategoryCardProps {
  category: ServiceHubCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const Icon = resolveCategoryIcon(category.icon);
  const { t } = useI18n();
  const categoryTitle = getServiceCategoryTitle(category, t);

  return (
    <Link
      to={category.path}
      className="service-category-card"
      style={{ "--service-accent": category.accent } as CSSProperties}
    >
      <div className="service-category-card__media">
        <img src={category.image} alt={categoryTitle} />
        <div className="service-category-card__overlay" />
        <div className="service-category-card__icon">
          <Icon size={16} />
        </div>
        <div className="service-category-card__title-wrap">
          <strong className="service-category-card__title">{categoryTitle}</strong>
        </div>
      </div>
    </Link>
  );
}
