import type { ServiceHubCategory } from "@/shared/types/api";
import { CategoryCard } from "./CategoryCard";

interface CategoryGridProps {
  categories: ServiceHubCategory[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  const visibleCategories = [...categories]
    .filter((category) => category.isActive)
    .sort((left, right) => left.order - right.order || left.title.localeCompare(right.title));

  return (
    <div className="category-grid">
      {visibleCategories.map((category) => (
        <CategoryCard key={category.slug} category={category} />
      ))}
    </div>
  );
}
