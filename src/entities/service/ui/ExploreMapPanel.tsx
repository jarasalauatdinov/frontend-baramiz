import { useEffect, useMemo, useState } from "react";
import { Button, Group, Paper, Stack, Text } from "@mantine/core";
import { ExternalLink, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useI18n } from "@/shared/i18n/provider";

export interface ExploreMapPoint {
  id: string;
  image?: string;
  internalPath: string;
  mapPath?: string;
  subtitle: string;
  title: string;
  x: number;
  y: number;
}

interface ExploreMapPanelProps {
  emptyCopy: string;
  emptyTitle: string;
  points: ExploreMapPoint[];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function ExploreMapPanel({ emptyCopy, emptyTitle, points }: ExploreMapPanelProps) {
  const { t } = useI18n();
  const [activePointId, setActivePointId] = useState<string | null>(points[0]?.id ?? null);

  useEffect(() => {
    setActivePointId((current) => {
      if (!points.length) {
        return null;
      }

      return points.some((point) => point.id === current) ? current : points[0].id;
    });
  }, [points]);

  const activePoint = useMemo(
    () => points.find((point) => point.id === activePointId) ?? points[0] ?? null,
    [activePointId, points],
  );

  if (!points.length) {
    return (
      <Paper className="explore-map-panel explore-map-panel--empty" radius={28} p={18} shadow="sm">
        <Stack gap={6}>
          <Text fw={800}>{emptyTitle}</Text>
          <Text c="dimmed" size="sm">
            {emptyCopy}
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper className="explore-map-panel" radius={28} p={12} shadow="sm">
      <Stack gap={12}>
        <div className="explore-map-panel__surface">
          <div className="explore-map-panel__grid" aria-hidden="true" />
          {points.map((point) => (
            <button
              key={point.id}
              type="button"
              aria-label={point.title}
              className={`explore-map-panel__pin${point.id === activePoint?.id ? " is-active" : ""}`}
              style={{
                left: `${clamp(point.x, 10, 90)}%`,
                top: `${clamp(point.y, 12, 88)}%`,
              }}
              onClick={() => setActivePointId(point.id)}
            >
              <MapPin size={16} />
            </button>
          ))}
        </div>

        {activePoint ? (
          <div className="explore-map-panel__sheet">
            <div className="explore-map-panel__sheet-media">
              {activePoint.image ? <img src={activePoint.image} alt={activePoint.title} loading="lazy" /> : null}
            </div>
            <div className="explore-map-panel__sheet-copy">
              <Text fw={800} size="sm">
                {activePoint.title}
              </Text>
              <Text c="dimmed" lineClamp={2} size="xs">
                {activePoint.subtitle}
              </Text>
              <Group gap={8} mt={4} wrap="wrap">
                <Button
                  component={Link}
                  to={activePoint.internalPath}
                  color="baramizGold"
                  radius="xl"
                  size="xs"
                >
                  {t("explore.actions.viewPlace")}
                </Button>
                {activePoint.mapPath ? (
                  <Button
                    component="a"
                    href={activePoint.mapPath}
                    leftSection={<ExternalLink size={14} />}
                    radius="xl"
                    rel="noreferrer"
                    size="xs"
                    target="_blank"
                    variant="default"
                  >
                    {t("explore.actions.openMap")}
                  </Button>
                ) : null}
              </Group>
            </div>
          </div>
        ) : null}
      </Stack>
    </Paper>
  );
}
