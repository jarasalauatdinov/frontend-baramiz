import clsx from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatNumber(value: number | undefined, maximumFractionDigits = 1) {
  if (value === undefined || Number.isNaN(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function formatPrice(priceFrom?: number, priceTo?: number, currency?: string) {
  if (priceFrom === undefined && priceTo === undefined) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });

  if (priceFrom !== undefined && priceTo !== undefined && priceFrom !== priceTo) {
    return `${formatter.format(priceFrom)} - ${formatter.format(priceTo)}`;
  }

  return formatter.format(priceFrom ?? priceTo ?? 0);
}

export function formatDurationMinutes(minutes?: number) {
  if (!minutes) {
    return "Flexible timing";
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;
  }

  return `${minutes}m`;
}

export function formatCoordinate(value?: number) {
  if (value === undefined) {
    return "Unknown";
  }

  return value.toFixed(4);
}

export function titleCase(value: string) {
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export function uniqueBy<TValue>(items: TValue[], getKey: (item: TValue) => string) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}
