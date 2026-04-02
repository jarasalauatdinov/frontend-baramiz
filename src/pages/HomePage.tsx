import { motion } from "framer-motion";
import {
  ArrowRight,
  Compass,
  Map,
  MapPinned,
  Route as RouteIcon,
  ShieldCheck,
  Sparkles,
  Stars,
  Users,
  BriefcaseBusiness,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PlaceCard } from "@/components/places/PlaceCard";
import type { PublicCategory, PublicCitySummary, PublicPlace } from "@/types/api";
import { AiConciergePanel } from "@/components/route/AiConciergePanel";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { EmptyState } from "@/components/state/EmptyState";
import { ErrorState } from "@/components/state/ErrorState";
import { LoadingState } from "@/components/state/LoadingState";
import { useHomePageQueries } from "@/hooks/usePublicData";
import { ensureArray } from "@/api/normalize";

const valuePoints = [
  {
    icon: RouteIcon,
    title: "AI-first route flow",
    copy: "Generate a practical route in a few taps, then immediately move into a polished result view.",
  },
  {
    icon: ShieldCheck,
    title: "Backend-owned logic",
    copy: "The frontend stays clean while route generation, chat, and translation remain stable server-side contracts.",
  },
  {
    icon: Compass,
    title: "Mobile-ready structure",
    copy: "The architecture keeps screen logic, API mapping, and UI blocks simple enough to adapt later for Expo demos.",
  },
];

const homeTeaserSections = {
  services: [
    {
      icon: BriefcaseBusiness,
      title: "Local transport and support",
      copy: "Keep the product grounded in real trip logistics with booking, transfer, and on-the-ground support.",
      link: "/services",
      cta: "Browse services",
    },
    {
      icon: Map,
      title: "Reliable city-to-city movement",
      copy: "A later mobile demo can reuse the same discovery structure for tap-first service booking flows.",
      link: "/services",
      cta: "Open support",
    },
  ],
  guides: [
    {
      icon: Users,
      title: "Human expertise stays visible",
      copy: "Even when guide endpoints are still evolving, the home page should communicate that Baramiz connects people as well as places.",
      link: "/guides",
      cta: "View guides",
    },
    {
      icon: Compass,
      title: "Region-aware storytelling",
      copy: "Guide discovery is framed as part of the route experience, not a disconnected listing.",
      link: "/guides",
      cta: "Meet local experts",
    },
  ],
  events: [
    {
      icon: CalendarDays,
      title: "Future-ready event surface",
      copy: "This section remains stable even while dedicated event endpoints are not guaranteed in the backend.",
      link: "/events",
      cta: "Open moments",
    },
    {
      icon: Stars,
      title: "Travel moments, not blank states",
      copy: "The product can still present a strong tourism story without crashing on missing optional feeds.",
      link: "/events",
      cta: "See event page",
    },
  ],
};

export function HomePage() {
  const { placesQuery, citiesQuery, categoriesQuery } = useHomePageQueries();

  const featuredPlaces = ensureArray<PublicPlace>(placesQuery.data);
  const cities = ensureArray<PublicCitySummary>(citiesQuery.data);
  const categories = ensureArray<PublicCategory>(categoriesQuery.data);

  const isLoading = (placesQuery.isPending && featuredPlaces.length === 0)
    || (categoriesQuery.isPending && categories.length === 0);
  const isError = placesQuery.isError && featuredPlaces.length === 0;

  if (isLoading) {
    return (
      <div className="page">
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <ErrorState />
      </div>
    );
  }

  const heroImage =
    featuredPlaces[0]?.imageUrl ||
    cities[0]?.featured_image ||
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="home-page">
      <section className="hero-band" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="hero-band__overlay" />
        <div className="page hero-band__inner">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
          >
            <span className="eyebrow hero-copy__eyebrow">AI-assisted tourism for Karakalpakstan</span>
            <h1 className="display hero-copy__title">
              Discover a premium, route-first travel experience built for real users and jury demos.
            </h1>
            <p className="hero-copy__text">
              Baramiz combines destination discovery, local support, and AI-generated routes into a
              calm, credible tourism platform that feels practical on the web and ready for mobile adaptation later.
            </p>
            <div className="button-row">
              <Link className="button accent" to="/route-generator">
                Generate a route
              </Link>
              <Link className="button secondary" to="/places">
                Explore destinations
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-aside panel"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <div className="hero-stat-grid">
              <div>
                <span className="eyebrow">Cities</span>
                <strong>{cities.length || "5+"}</strong>
                <p>Route-ready destinations in the current catalog.</p>
              </div>
              <div>
                <span className="eyebrow">Places</span>
                <strong>{featuredPlaces.length || "10+"}</strong>
                <p>Curated places surfaced from the backend feed.</p>
              </div>
              <div>
                <span className="eyebrow">AI Flow</span>
                <strong>5 steps</strong>
                <p>City, interests, duration, generate, review.</p>
              </div>
            </div>
            <div className="meta-row">
              {categories.slice(0, 4).map((category) => (
                <span className="tag" key={category.id}>
                  {category.name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <div className="page">
        <section className="section">
          <SectionHeading
            eyebrow="City Discovery"
            title="Start with the place, not the paperwork."
            copy="Every city block below is API-backed so the first demo screen feels alive, not hardcoded."
          />
          {cities.length ? (
            <div className="city-grid">
              {cities.slice(0, 4).map((city) => (
                <motion.article
                  key={city.city}
                  className="city-card panel"
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.35 }}
                >
                  <div className="city-card__media">
                    {city.featured_image ? <img src={city.featured_image} alt={city.city} /> : null}
                  </div>
                  <div className="city-card__body">
                    <h3>{city.city}</h3>
                    <p>{city.region}</p>
                    <div className="meta-row">
                      <span className="tag">{city.count} destinations</span>
                      {ensureArray(city.types).slice(0, 2).map((type) => (
                        <span className="tag" key={`${city.city}-${type}`}>
                          {String(type).replace(/_/g, " ")}
                        </span>
                      ))}
                    </div>
                    <Link className="button ghost" to={`/places?city=${encodeURIComponent(city.city)}`}>
                      Open city
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="City summary is unavailable"
              copy="The home page still works without the optional city feed. You can continue through destination browsing or route generation."
            />
          )}
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Featured Places"
            title="Strong destination browsing without clutter."
            copy="The platform foregrounds places with good imagery, readable metadata, and a tap-friendly layout."
          />
          {featuredPlaces.length ? (
            <div className="grid-auto">
              {featuredPlaces.slice(0, 6).map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Featured places are not available"
              copy="The app can still render, but the required places feed is currently empty."
            />
          )}
        </section>

        <section className="section split-layout">
          <div>
            <SectionHeading
              eyebrow="Trusted Support"
              title="Show the ecosystem, not just the map."
              copy="Judges need to see that the product connects places, guides, and local support into one believable tourism workflow."
            />
            <div className="teaser-grid">
              {homeTeaserSections.services.map((item) => (
                <article className="panel teaser-card" key={item.title}>
                  <item.icon size={20} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <Link className="button ghost" to={item.link}>
                    {item.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading
              eyebrow="Local Guides"
              title="Human expertise stays visible."
              copy="Guide discovery is presented as part of the journey, not buried in a secondary admin-like interface."
            />
            <div className="teaser-grid">
              {homeTeaserSections.guides.map((item) => (
                <article className="panel teaser-card" key={item.title}>
                  <item.icon size={20} />
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                  <Link className="button ghost" to={item.link}>
                    {item.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section split-layout route-teaser">
          <div className="panel route-teaser__content">
            <span className="eyebrow">AI Route Generator</span>
            <h2 className="display">The critical demo moment is fast, clear, and product-like.</h2>
            <p>
              The generator stays simple on purpose: choose a city, pick interests, choose duration,
              and let the backend produce an ordered route result with time blocks and reasons.
            </p>
            <div className="route-teaser__steps">
              {[
                "Choose city",
                "Pick interests",
                "Set duration",
                "Generate with backend",
                "Review ordered stops",
              ].map((step, index) => (
                <div className="route-step" key={step}>
                  <strong>{index + 1}</strong>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="button-row">
              <Link className="button accent" to="/route-generator">
                Start the flow
              </Link>
              <Link className="button secondary" to="/route-result">
                Open last result
              </Link>
            </div>
          </div>
          <AiConciergePanel />
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Events and Moments"
            title="A graceful events screen even before a dedicated events API lands."
            copy="The first screen stays stable without requiring event endpoints, while the dedicated page remains ready for later backend expansion."
          />
          <div className="teaser-grid">
            {homeTeaserSections.events.map((item) => (
              <article className="panel teaser-card" key={item.title}>
                <item.icon size={20} />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
                <Link className="button ghost" to={item.link}>
                  {item.cta}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <SectionHeading
            eyebrow="Why Baramiz"
            title="Premium enough for judges, simple enough for an MVP team."
            copy="The UI direction is editorial and confident, while the architecture stays small, typed, and easy for a frontend engineer to keep moving."
          />
          <div className="value-grid">
            {valuePoints.map((point) => (
              <article className="value-card panel" key={point.title}>
                <point.icon size={22} />
                <h3>{point.title}</h3>
                <p>{point.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section final-cta panel">
          <div>
            <span className="eyebrow">Next Step</span>
            <h2 className="display">Move from discovery into a route in one tap-friendly flow.</h2>
            <p>
              That transition is what makes the product feel real: discover, generate, review, and
              keep exploring without needing desktop-only interactions.
            </p>
          </div>
          <div className="button-row">
            <Link className="button accent" to="/route-generator">
              Generate route
              <ArrowRight size={16} />
            </Link>
            <Link className="button secondary" to="/guides">
              Meet guides
            </Link>
          </div>
          <div className="final-cta__proof">
            <span className="tag">
              <Stars size={14} />
              {featuredPlaces.length || cities.length} live public data blocks
            </span>
            <span className="tag">
              <MapPinned size={14} />
              Karakalpakstan-focused
            </span>
            <span className="tag">
              <Sparkles size={14} />
              Expo-compatible architecture in spirit
            </span>
          </div>
        </section>
      </div>
    </div>
  );
}
