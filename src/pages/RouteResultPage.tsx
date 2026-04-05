import { Compass, Lightbulb, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { RouteStopCard } from "@/entities/route/ui/RouteStopCard";
import { EmptyState } from "@/shared/ui/state/EmptyState";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { formatDurationMinutes } from "@/shared/lib/utils";

function formatRouteMode(mode: string) {
  return mode
    .replace(/[_-]+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function RouteResultPage() {
  const { t } = useI18n();
  const storedResult = readStoredRouteResult();

  if (!storedResult) {
    return (
      <>
        <AppHeader title={t("route.result.header.empty")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("route.result.empty.title")}
            copy={t("route.result.empty.copy")}
            action={
              <Link className="button accent" to="/route-generator">
                {t("route.result.empty.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const { route } = storedResult;
  const routeStops = route.stops;

  if (routeStops.length === 0) {
    return (
      <>
        <AppHeader title={t("route.result.header.empty")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("route.result.emptyRoute.title")}
            copy={t("route.result.emptyRoute.copy")}
            action={
              <Link className="button accent" to="/route-generator">
                {t("route.result.emptyRoute.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const heroImage = routeStops[0]?.image;
  const interestsCount = storedResult.input.interests.length;
  const durationLabel = formatDurationMinutes(route.totalDurationMinutes, {
    flexible: t("common.duration.flexible"),
    hourShort: t("common.units.hourShort"),
    minuteShort: t("common.units.minuteShort"),
  });
  const summary = route.summary || t("route.result.summaryFallback", { city: route.city });
  const modeLabel = route.mode ? formatRouteMode(route.mode) : null;
  const routeTips = route.tips;

  return (
    <>
      <AppHeader title={t("route.result.header.title")} back showLanguageSwitcher />
      <div className="screen route-result-screen">
        <div
          className={`route-result-hero ${heroImage ? "route-result-hero--visual" : ""}`}
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
        >
          <div className="route-result-hero__overlay" />
          <div className="route-result-hero__body">
            <div className="route-result-hero__copy">
              <span className="eyebrow">{t("route.result.generatedEyebrow")}</span>
              <h1 className="display">{route.title}</h1>
              <p className="route-result-hero__summary">{summary}</p>
            </div>
            <div className="meta-row route-result-hero__meta">
              <span className="tag">{route.city}</span>
              <span className="tag">{t("route.result.stopsCount", { count: routeStops.length })}</span>
              {modeLabel ? <span className="tag">{modeLabel}</span> : null}
            </div>
          </div>
        </div>

        <section className="panel route-result-overview">
          <div className="route-result-metrics">
            <div className="detail-metric">
              <span>{t("route.result.metric.interests")}</span>
              <strong>{interestsCount}</strong>
            </div>
            <div className="detail-metric">
              <span>{t("route.result.metric.stops")}</span>
              <strong>{routeStops.length}</strong>
            </div>
            <div className="detail-metric">
              <span>{t("route.result.metric.duration")}</span>
              <strong>{durationLabel}</strong>
            </div>
          </div>
        </section>

        <section className="route-result-section route-result-section--stops">
          <div className="route-result-section__head">
            <div className="section-label route-result-section-label">{t("route.result.section.stops")}</div>
            <span className="tag route-result-section__tag">{t("route.result.stopsCount", { count: routeStops.length })}</span>
          </div>
          <ol className="route-stop-list" aria-label={t("route.result.section.stops")}>
            {routeStops.map((item, index) => (
              <li className="route-stop-list__item" key={`${item.id}-${item.order}`}>
                <RouteStopCard item={item} index={index} />
              </li>
            ))}
          </ol>
        </section>

        {routeTips.length ? (
          <section className="panel route-result-tips route-result-section">
            <div className="route-result-section__head">
              <div className="section-label route-result-section-label">{t("route.result.section.tips")}</div>
            </div>
            <div className="route-result-tips__list">
              {routeTips.map((tip, index) => (
                <div className="route-result-tips__item" key={`${tip}-${index}`}>
                  <span className="route-result-tips__icon" aria-hidden="true">
                    <Lightbulb size={15} />
                  </span>
                  <p>{tip}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="panel route-result-actions">
          <div className="button-row">
          <Link className="button accent button--full" to="/route-generator">
            <RefreshCw size={16} />
            {t("route.result.actions.regenerate")}
          </Link>
          <Link className="button secondary button--full" to="/places">
            <Compass size={16} />
            {t("route.result.actions.browse")}
          </Link>
          </div>
        </section>
      </div>
    </>
  );
}
