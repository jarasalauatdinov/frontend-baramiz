import clsx from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export interface DurationFormatLabels {
  flexible: string;
  hourShort: string;
  minuteShort: string;
}

const defaultDurationLabels: DurationFormatLabels = {
  flexible: "Flexible timing",
  hourShort: "h",
  minuteShort: "m",
};

export function formatNumber(value: number | undefined, maximumFractionDigits = 1, locale = "en-US") {
  if (value === undefined || Number.isNaN(value)) {
    return "N/A";
  }

  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
  }).format(value);
}

export function formatPrice(priceFrom?: number, priceTo?: number, currency?: string, locale = "en-US") {
  if (priceFrom === undefined && priceTo === undefined) {
    return undefined;
  }

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  });

  if (priceFrom !== undefined && priceTo !== undefined && priceFrom !== priceTo) {
    return `${formatter.format(priceFrom)} - ${formatter.format(priceTo)}`;
  }

  return formatter.format(priceFrom ?? priceTo ?? 0);
}

export function formatDurationMinutes(
  minutes?: number,
  labels: DurationFormatLabels = defaultDurationLabels,
) {
  if (!minutes) {
    return labels.flexible;
  }

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
      return `${hours} ${labels.hourShort}`;
    }

    return `${hours} ${labels.hourShort} ${remainingMinutes} ${labels.minuteShort}`;
  }

  return `${minutes} ${labels.minuteShort}`;
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
