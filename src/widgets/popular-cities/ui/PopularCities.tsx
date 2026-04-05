import { ScrollArea, Stack, Title } from "@mantine/core";
import { CityCard, type CityCardItem } from "@/entities/city";
import { useI18n } from "@/shared/i18n/provider";

interface PopularCitiesProps {
  cities: CityCardItem[];
}

export function PopularCitiesSection({ cities }: PopularCitiesProps) {
  const { t } = useI18n();

  return (
    <Stack gap="md">
      <Title order={2}>{t("home.cities.title")}</Title>
      <ScrollArea offsetScrollbars type="never">
        <div style={{ display: "flex", gap: 14, paddingBottom: 4 }}>
          {cities.map((city) => (
            <CityCard key={city.id} city={city} />
          ))}
        </div>
      </ScrollArea>
    </Stack>
  );
}
