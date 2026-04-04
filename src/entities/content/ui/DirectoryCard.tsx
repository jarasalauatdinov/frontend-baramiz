import { ArrowUpRight, CalendarDays, Languages, MapPin, Phone, Wallet } from "lucide-react";
import type { EventMoment, GuideProfile, PublicContentItem, ServiceDirectoryEntry } from "@/shared/types/api";
import { buildMapsLink } from "@/shared/api/baramiz";
import { getLocaleForLanguage } from "@/shared/i18n";
import { useI18n } from "@/shared/i18n/provider";
import { cn, formatPrice, titleCase } from "@/shared/lib/utils";

type DirectoryItem = ServiceDirectoryEntry | GuideProfile | EventMoment;

interface DirectoryCardProps {
  item: DirectoryItem;
  variant?: "service" | "guide" | "event";
}

function resolvePrimaryAction(item: DirectoryItem, t: ReturnType<typeof useI18n>["t"]) {
  if (item.contact_telegram) {
    return {
      href: item.contact_telegram,
      label: t("directory.actions.telegram"),
    };
  }

  if (item.contact_website) {
    return {
      href: item.contact_website,
      label: t("directory.actions.website"),
    };
  }

  if (item.contact_phone) {
    return {
      href: `tel:${item.contact_phone}`,
      label: t("directory.actions.call"),
    };
  }

  const mapLink = buildMapsLink(item.latitude, item.longitude);
  if (mapLink) {
    return {
      href: mapLink,
      label: t("directory.actions.map"),
    };
  }

  return undefined;
}

function getDirectoryTypeLabel(type: PublicContentItem["type"], t: ReturnType<typeof useI18n>["t"]) {
  const translationKey = `directory.type.${type}` as const;
  return t(translationKey) || titleCase(type);
}

export function DirectoryCard({ item, variant = "service" }: DirectoryCardProps) {
  const { language, t } = useI18n();
  const gallery = item.normalizedGallery;
  const primaryAction = resolvePrimaryAction(item, t);
  const priceLabel = formatPrice(item.price_from, item.price_to, item.currency, getLocaleForLanguage(language));
  const typeLabel = getDirectoryTypeLabel(item.type, t);
  const metaParts = [item.city, item.working_hours].filter(Boolean);
  const eventLabel = item.duration_minutes
    ? t("directory.event.duration", { minutes: item.duration_minutes })
    : t("directory.event.featuredMoment");

  return (
    <article className={cn("directory-card panel", `directory-card--${variant}`)}>
      <div className="directory-card__media">
        {gallery[0] ? (
          <img src={gallery[0]} alt={item.name} />
        ) : (
          <div className="directory-card__placeholder">
            <span>{typeLabel}</span>
          </div>
        )}
      </div>
      <div className="directory-card__body">
        <div className="meta-row">
          <span className="tag">{item.city}</span>
          <span className="tag">{typeLabel}</span>
          {item.featured ? <span className="tag tag-featured">{t("directory.badge.highlighted")}</span> : null}
        </div>
        <h3>{item.name}</h3>
        <p>{item.short_description}</p>
        <div className="directory-card__facts">
          <span>
            <MapPin size={15} />
            {metaParts.join(" · ") || item.region}
          </span>
          {priceLabel ? (
            <span>
              <Wallet size={15} />
              {priceLabel}
            </span>
          ) : null}
          {item.languages.length ? (
            <span>
              <Languages size={15} />
              {item.languages.slice(0, 3).join(", ")}
            </span>
          ) : null}
          {variant === "event" ? (
            <span>
              <CalendarDays size={15} />
              {eventLabel}
            </span>
          ) : null}
        </div>
        <div className="meta-row">
          {item.tags.slice(0, 4).map((tag) => (
            <span className="tag" key={`${item.id}-${tag}`}>
              {tag}
            </span>
          ))}
        </div>
        <div className="button-row">
          {primaryAction ? (
            <a className="button secondary" href={primaryAction.href} target="_blank" rel="noreferrer">
              <ArrowUpRight size={16} />
              {primaryAction.label}
            </a>
          ) : null}
          {item.contact_phone ? (
            <a className="button ghost" href={`tel:${item.contact_phone}`}>
              <Phone size={16} />
              {item.contact_phone}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
