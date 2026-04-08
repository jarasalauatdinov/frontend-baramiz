import { Compass, Lightbulb, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { RouteStopCard } from "@/entities/route/ui/RouteStopCard";
import {
  buildRecommendationReason,
  getRecommendationPreferenceLabel,
} from "@/features/route/recommendation-preferences";
import { readStoredRouteResult } from "@/features/route/route-storage";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { EmptyState } from "@/shared/ui/state/EmptyState";

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
              <Link className="button accent" to="/route">
                {t("route.result.empty.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const { input, route } = storedResult;
  const recommendations = route.stops;
  const selectedPreferenceLabels = input.preferences.map((preference) => getRecommendationPreferenceLabel(preference, t));
  const basedOnItems = [route.city, ...selectedPreferenceLabels];
  const helperTips = route.tips;

  if (recommendations.length === 0) {
    return (
      <>
        <AppHeader title={t("route.result.header.empty")} back showLanguageSwitcher />
        <div className="screen screen--center">
          <EmptyState
            title={t("route.result.emptyRoute.title")}
            copy={t("route.result.emptyRoute.copy")}
            action={
              <Link className="button accent" to="/route">
                {t("route.result.emptyRoute.cta")}
              </Link>
            }
          />
        </div>
      </>
    );
  }

  const heroImage = recommendations[0]?.image;

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
              <h1 className="display">{t("route.result.hero.title", { city: route.city })}</h1>
              <p className="route-result-hero__summary">{t("route.result.summaryFallback", { city: route.city })}</p>
            </div>
            <div className="meta-row route-result-hero__meta">
              <span className="tag">{route.city}</span>
              <span className="tag">{t("route.result.stopsCount", { count: recommendations.length })}</span>
              <span className="tag tag-featured">{t("route.result.metric.preferences", { count: input.preferences.length })}</span>
            </div>
          </div>
        </div>

        <section className="panel route-result-overview">
          <div className="route-result-section__head">
            <div className="section-label route-result-section-label">{t("route.result.section.basedOn")}</div>
            <span className="tag route-result-section__tag">
              {t("route.result.metric.preferences", { count: input.preferences.length })}
            </span>
          </div>
          <div className="meta-row route-result-overview__chips">
            {basedOnItems.map((item) => (
              <span className="tag" key={item}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="route-result-section route-result-section--stops">
          <div className="route-result-section__head">
            <div className="section-label route-result-section-label">{t("route.result.section.stops")}</div>
            <span className="tag route-result-section__tag">
              {t("route.result.stopsCount", { count: recommendations.length })}
            </span>
          </div>
          <ol className="route-stop-list" aria-label={t("route.result.section.stops")}>
            {recommendations.map((item, index) => (
              <li className="route-stop-list__item" key={`${item.id}-${item.order}`}>
                <RouteStopCard
                  item={item}
                  index={index}
                  reason={buildRecommendationReason({
                    item,
                    preferences: input.preferences,
                    t,
                  })}
                />
              </li>
            ))}
          </ol>
        </section>

        {helperTips.length ? (
          <section className="panel route-result-tips route-result-section">
            <div className="route-result-section__head">
              <div className="section-label route-result-section-label">{t("route.result.section.tips")}</div>
            </div>
            <div className="route-result-tips__list">
              {helperTips.map((tip, index) => (
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
            <Link className="button accent button--full" to="/route">
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
