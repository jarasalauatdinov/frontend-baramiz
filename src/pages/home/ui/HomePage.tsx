import { useMemo, useState, type FormEvent } from "react";
import { Badge, Box, Button, Paper, ScrollArea, Skeleton, Stack, Text, Title } from "@mantine/core";
import { ChevronRight, MapPinned, MessageSquareText, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "@/features/language-switcher";
import { useI18n } from "@/shared/i18n/provider";
import { AppHeader } from "@/shared/ui/layout/AppHeader";
import { useHomePageModel } from "@/pages/home/model/useHomePageModel";
import type { FeaturedPlaceItem } from "@/shared/types/home";

function HomePageSkeleton() {
  return (
    <Stack gap="md">
      <Skeleton height={54} radius={18} />
      <Skeleton height={102} radius={24} />
      <Skeleton height={34} radius={12} width="42%" />
      <Skeleton height={248} radius={28} />
      <Skeleton height={212} radius={28} />
    </Stack>
  );
}

function HomeSearchBar() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = query.trim();
    navigate(value ? `/places?search=${encodeURIComponent(value)}` : "/places");
  }

  return (
    <form className="search-bar home-command-search" onSubmit={handleSubmit}>
      <Search size={18} />
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("places.search.placeholder")}
        aria-label={t("places.search.placeholder")}
      />
      <button type="submit" className="home-command-search__submit" aria-label={t("places.search.placeholder")}>
        <ChevronRight size={18} />
      </button>
    </form>
  );
}

function QuickActionsRow() {
  const { t } = useI18n();

  const items = useMemo(
    () => [
      {
        id: "baramiz-ai",
        label: "Baramiz AI",
        to: "/route",
        icon: Sparkles,
      },
      {
        id: "suyle-ai",
        label: "Sóyle AI",
        to: "/suyle-ai",
        icon: MessageSquareText,
      },
      {
        id: "near-me",
        label: t("home.quick.nearby.short"),
        to: "/service",
        icon: MapPinned,
      },
    ],
    [t],
  );

  return (
    <div className="home-command-actions">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Link key={item.id} to={item.to} className="home-command-action">
            <span className="home-command-action__icon" aria-hidden="true">
              <Icon size={18} />
            </span>
            <span className="home-command-action__label">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

interface FeaturedHighlightsSectionProps {
  title: string;
  viewAllLabel: string;
  viewAllTo: string;
  items: FeaturedPlaceItem[];
}

function FeaturedHighlightsSection({
  title,
  viewAllLabel,
  viewAllTo,
  items,
}: FeaturedHighlightsSectionProps) {
  if (!items.length) {
    return null;
  }

  return (
    <Stack gap="sm">
      <div className="section-header">
        <Title order={2} className="section-header__title">
          {title}
        </Title>
        <Text component={Link} to={viewAllTo} className="section-header__link">
          {viewAllLabel}
        </Text>
      </div>

      <ScrollArea type="never" offsetScrollbars={false}>
        <div className="home-featured-row">
          {items.map((item) => (
            <Paper
              key={item.id}
              component={Link}
              to={item.to}
              className="home-featured-card"
              radius={30}
              shadow="xl"
            >
              <Box className="home-featured-card__media">
                <img src={item.image} alt="" loading="lazy" />
              </Box>
              <div className="home-featured-card__overlay" />
              <div className="home-featured-card__body">
                <div className="home-featured-card__badges">
                  {item.tag ? <Badge color="baramizGold">{item.tag}</Badge> : null}
                  {item.location ? <Badge color="dark">{item.location}</Badge> : null}
                </div>

                <div className="home-featured-card__copy">
                  <Title order={3} className="home-featured-card__title">
                    <Text component="span" inherit lineClamp={2} style={{ textWrap: "balance" }}>
                      {item.title}
                    </Text>
                  </Title>
                  {item.subtitle ? (
                    <Text className="home-featured-card__subtitle" lineClamp={3}>
                      {item.subtitle}
                    </Text>
                  ) : null}
                </div>

                <div className="home-featured-card__footer">
                  <span>{item.location}</span>
                  <span className="home-featured-card__footer-link">
                    {viewAllLabel}
                    <ChevronRight size={16} />
                  </span>
                </div>
              </div>
            </Paper>
          ))}
        </div>
      </ScrollArea>
    </Stack>
  );
}

function BaramizAiNudgeCard() {
  const { t } = useI18n();

  return (
    <Paper className="home-ai-nudge" radius={28} p="lg">
      <Stack gap="md">
        <div className="home-ai-nudge__topline">
          <Badge color="baramizGold">{t("home.ai.badge")}</Badge>
          <span className="home-ai-nudge__mark" aria-hidden="true">
            <Sparkles size={16} />
          </span>
        </div>

        <div className="home-ai-nudge__copy">
          <Title order={2}>{t("home.ai.title")}</Title>
          <Text>{t("home.ai.copy")}</Text>
        </div>

        <Button component={Link} to="/route" color="baramizGold" radius="xl" h={50} rightSection={<ChevronRight size={18} />}>
          {t("home.ai.primary")}
        </Button>
      </Stack>
    </Paper>
  );
}

export function HomePage() {
  const { t } = useI18n();
  const { featuredPlaceItems, isInitialLoading } = useHomePageModel();

  return (
    <>
      <AppHeader title={t("home.header.title")} brand actions={<LanguageSwitcher iconOnly />} />
      <div className="screen home-redesign-screen home-app-screen">
        {isInitialLoading ? (
          <HomePageSkeleton />
        ) : (
          <Stack gap={12} className="home-page-stack">
            <HomeSearchBar />
            <QuickActionsRow />
            <FeaturedHighlightsSection
              title={t("home.experiences.title")}
              viewAllLabel={t("home.viewAll")}
              viewAllTo="/places"
              items={featuredPlaceItems}
            />
            <BaramizAiNudgeCard />
          </Stack>
        )}
      </div>
    </>
  );
}
