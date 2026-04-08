import { useMemo, useState } from "react";
import { Box, Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { Compass, Languages, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { writeOnboardingCompleted } from "@/features/onboarding/model/storage";
import { useI18n } from "@/shared/i18n/provider";
import type { Language } from "@/shared/types/api";

interface SlideCopy {
  title: string;
  description: string;
}

interface OnboardingCopy {
  skip: string;
  next: string;
  done: string;
  slides: [SlideCopy, SlideCopy, SlideCopy];
}

const onboardingCopyByLanguage: Record<Language, OnboardingCopy> = {
  en: {
    skip: "Skip",
    next: "Next",
    done: "Let's go",
    slides: [
      {
        title: "Discover Karakalpakstan",
        description: "Open the places, services, and essentials that matter most in your first 3 days.",
      },
      {
        title: "Baramiz AI finds places for you",
        description: "Choose a city and a few preferences to get smart travel picks without the noise.",
      },
      {
        title: "Sóyle AI helps you talk to anyone",
        description: "Translate what you need fast when you meet locals, drivers, hosts, or shop staff.",
      },
    ],
  },
  uz: {
    skip: "O‘tkazib yuborish",
    next: "Keyingi",
    done: "Boshlash",
    slides: [
      {
        title: "Qoraqalpog‘istonni kashf eting",
        description: "Birinchi 3 kuningizda kerak bo‘ladigan joylar, servislar va foydali nuqtalarni tez toping.",
      },
      {
        title: "Baramiz AI sizga joylarni topadi",
        description: "Shahar va afzalliklarni tanlang, keraksiz chalkashliksiz mos tavsiyalarni oling.",
      },
      {
        title: "Sóyle AI har kim bilan gaplashishga yordam beradi",
        description: "Mahalliy odamlar, haydovchilar, mezbonlar yoki sotuvchilar bilan kerakli gapni tez tarjima qiling.",
      },
    ],
  },
  ru: {
    skip: "Пропустить",
    next: "Далее",
    done: "Поехали",
    slides: [
      {
        title: "Откройте Каракалпакстан",
        description: "Быстро находите места, сервисы и важные точки, которые пригодятся в первые 3 дня.",
      },
      {
        title: "Baramiz AI подбирает места для вас",
        description: "Выберите город и предпочтения, чтобы получить умные рекомендации без лишнего шума.",
      },
      {
        title: "Sóyle AI помогает говорить с любым человеком",
        description: "Быстро переводите нужные фразы при разговоре с местными жителями, водителями, хозяевами и продавцами.",
      },
    ],
  },
  kaa: {
    skip: "Ótkerip jiberiw",
    next: "Keyingi",
    done: "Baslayıq",
    slides: [
      {
        title: "Qaraqalpaqstannı ashıń",
        description: "Birinshi 3 kún ishinde sizge kerek bolatuǵın orınlar, servisler hám paydalı noqatlardı tez tabıń.",
      },
      {
        title: "Baramiz AI sizge orınlardı tabıp beredi",
        description: "Qalanı hám qalawlarıńızdı saylań, artıqsha qıyınshılıqsız mas tavsiyalar alıń.",
      },
      {
        title: "Sóyle AI hár kim menen sóylesiwge járdem beredi",
        description: "Jergilikli adamlar, haydawshılar, qonaq iyeleri yamasa satıwshılar menen kerek sózdi tez awdarıń.",
      },
    ],
  },
};

const slideVisuals = [
  {
    icon: Compass,
    accent: "linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 100%), linear-gradient(135deg, #2f5fcf 0%, #173063 100%)",
    glow: "rgba(47, 95, 207, 0.22)",
  },
  {
    icon: Sparkles,
    accent: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%), linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)",
    glow: "var(--accent-glow)",
  },
  {
    icon: Languages,
    accent: "linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%), linear-gradient(135deg, #1c4d46 0%, #0f766e 100%)",
    glow: "rgba(15, 118, 110, 0.22)",
  },
] as const;

export function OnboardingPage() {
  const navigate = useNavigate();
  const { language } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const content = useMemo(() => onboardingCopyByLanguage[language] ?? onboardingCopyByLanguage.en, [language]);

  function completeOnboarding() {
    writeOnboardingCompleted();
    navigate("/", { replace: true });
  }

  function handleNext() {
    if (activeIndex >= content.slides.length - 1) {
      completeOnboarding();
      return;
    }

    setActiveIndex((current) => current + 1);
  }

  function handleTouchStart(clientX: number) {
    setTouchStartX(clientX);
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX === null) {
      return;
    }

    const deltaX = clientX - touchStartX;
    setTouchStartX(null);

    if (Math.abs(deltaX) < 42) {
      return;
    }

    if (deltaX < 0 && activeIndex < content.slides.length - 1) {
      setActiveIndex((current) => current + 1);
    }

    if (deltaX > 0 && activeIndex > 0) {
      setActiveIndex((current) => current - 1);
    }
  }

  return (
    <Box
      style={{
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        background:
          "radial-gradient(circle at top, rgba(232, 137, 58, 0.10), transparent 34%), linear-gradient(180deg, var(--bg) 0%, var(--baramiz-color-bg-subtle) 100%)",
      }}
    >
      <Stack
        gap={18}
        style={{
          width: "100%",
          maxWidth: "var(--app-max-width)",
          minHeight: "100dvh",
          padding: "max(12px, env(safe-area-inset-top, 0px)) 16px max(24px, calc(env(safe-area-inset-bottom, 0px) + 18px))",
        }}
      >
        <Group justify="space-between" align="center" style={{ minHeight: "var(--header-height)" }}>
          <Box
            aria-hidden="true"
            style={{
              width: "var(--touch-target-min)",
              height: "var(--touch-target-min)",
            }}
          />

          <Button
            variant="subtle"
            color="gray"
            onClick={completeOnboarding}
            styles={{
              root: {
                minHeight: "var(--touch-target-min)",
                paddingInline: 10,
              },
              label: {
                fontSize: "var(--font-size-body-sm)",
                fontWeight: 700,
                color: "var(--text-secondary)",
              },
            }}
          >
            {content.skip}
          </Button>
        </Group>

        <Stack justify="space-between" style={{ flex: 1 }}>
          <Stack gap={20}>
            <Box
              onTouchStart={(event) => handleTouchStart(event.changedTouches[0]?.clientX ?? 0)}
              onTouchEnd={(event) => handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
              style={{
                overflow: "hidden",
                borderRadius: "var(--radius-2xl)",
              }}
            >
              <Box
                style={{
                  display: "flex",
                  width: `${content.slides.length * 100}%`,
                  transform: `translateX(-${activeIndex * (100 / content.slides.length)}%)`,
                  transition: "transform 220ms ease",
                }}
              >
                {content.slides.map((slide, index) => {
                  const visual = slideVisuals[index];
                  const Icon = visual.icon;

                  return (
                    <Box
                      key={slide.title}
                      style={{
                        width: `${100 / content.slides.length}%`,
                        flexShrink: 0,
                      }}
                    >
                      <Paper
                        radius={32}
                        p="lg"
                        style={{
                          minHeight: 332,
                          background: "color-mix(in srgb, var(--bg-card) 95%, transparent)",
                          border: "1px solid var(--line)",
                          boxShadow: "var(--shadow-md)",
                        }}
                      >
                        <Stack gap={18}>
                          <Box
                            aria-hidden="true"
                            style={{
                              minHeight: 188,
                              borderRadius: 28,
                              background: visual.accent,
                              boxShadow: `0 18px 36px ${visual.glow}`,
                              position: "relative",
                              overflow: "hidden",
                            }}
                          >
                            <Box
                              style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "radial-gradient(circle at top right, rgba(255,255,255,0.28), transparent 30%), radial-gradient(circle at bottom left, rgba(255,255,255,0.14), transparent 36%)",
                              }}
                            />
                            <Box
                              style={{
                                position: "absolute",
                                top: 18,
                                left: 18,
                                width: 54,
                                height: 54,
                                borderRadius: 18,
                                display: "grid",
                                placeItems: "center",
                                color: "white",
                                background: "rgba(255,255,255,0.16)",
                                backdropFilter: "blur(8px)",
                                WebkitBackdropFilter: "blur(8px)",
                              }}
                            >
                              <Icon size={24} />
                            </Box>
                            <Box
                              style={{
                                position: "absolute",
                                right: -24,
                                bottom: -22,
                                width: 148,
                                height: 148,
                                borderRadius: 40,
                                background: "rgba(255,255,255,0.18)",
                              }}
                            />
                          </Box>

                          <Stack gap={8}>
                            <Title
                              order={2}
                              style={{
                                fontFamily: '"Cormorant Garamond", serif',
                                fontSize: "clamp(2rem, 8vw, 2.6rem)",
                                lineHeight: 0.94,
                                letterSpacing: "-0.04em",
                                color: "var(--text)",
                              }}
                            >
                              {slide.title}
                            </Title>
                            <Text
                              c="var(--text-secondary)"
                              style={{
                                fontSize: "var(--font-size-body)",
                                lineHeight: "var(--line-height-body)",
                                maxWidth: 300,
                              }}
                            >
                              {slide.description}
                            </Text>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Box>
                  );
                })}
              </Box>
            </Box>

            <Group justify="center" gap={8} aria-label="Onboarding progress">
              {content.slides.map((slide, index) => (
                <Box
                  key={slide.title}
                  aria-hidden="true"
                  style={{
                    width: index === activeIndex ? 24 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: index === activeIndex ? "var(--accent)" : "rgba(116, 85, 48, 0.18)",
                    transition: "width 180ms ease, background 180ms ease",
                  }}
                />
              ))}
            </Group>
          </Stack>

          <Button
            color="baramizGold"
            fullWidth
            onClick={handleNext}
            styles={{
              root: {
                minHeight: 52,
                boxShadow: "0 16px 28px var(--accent-glow)",
              },
              label: {
                fontSize: "var(--font-size-button)",
                fontWeight: 800,
              },
            }}
          >
            {activeIndex === content.slides.length - 1 ? content.done : content.next}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
