import { createTheme, rem, type CSSVariablesResolver } from "@mantine/core";
import { designTokens } from "@/shared/config/design-tokens";

const { color, layout, radius, shadow, spacing, typography } = designTokens;

export const mantineTheme = createTheme({
  primaryColor: "baramizGold",
  defaultRadius: "xl",
  white: color.surface.primary,
  black: color.text.primary,
  fontFamily: "Manrope, system-ui, sans-serif",
  fontSizes: {
    xs: rem(12),
    sm: rem(14),
    md: rem(15),
    lg: rem(16),
    xl: rem(18),
  },
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(12),
    lg: rem(16),
    xl: rem(20),
  },
  radius: {
    xs: rem(8),
    sm: rem(12),
    md: rem(16),
    lg: rem(20),
    xl: rem(24),
  },
  headings: {
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: typography.display.fontWeight,
    sizes: {
      h1: {
        fontSize: typography.display.fontSize,
        lineHeight: typography.display.lineHeight,
        fontWeight: typography.display.fontWeight,
      },
      h2: {
        fontSize: typography.headingLg.fontSize,
        lineHeight: typography.headingLg.lineHeight,
        fontWeight: typography.headingLg.fontWeight,
      },
      h3: {
        fontSize: typography.headingMd.fontSize,
        lineHeight: typography.headingMd.lineHeight,
        fontWeight: typography.headingMd.fontWeight,
      },
      h4: {
        fontSize: typography.headingSm.fontSize,
        lineHeight: typography.headingSm.lineHeight,
        fontWeight: typography.headingSm.fontWeight,
      },
    },
  },
  colors: {
    baramizGold: color.brandScale,
    baramizInk: color.inkScale,
    baramizSand: color.sandScale,
    baramizTeal: color.tealScale,
  },
  shadows: {
    xs: shadow.xs,
    sm: shadow.sm,
    md: shadow.md,
    xl: shadow.lg,
  },
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
        size: "md",
      },
      styles: {
        root: {
          minHeight: "var(--baramiz-layout-touch-target-min)",
          paddingInline: "var(--baramiz-space-xl)",
          fontWeight: 700,
          letterSpacing: "-0.01em",
        },
        label: {
          fontSize: "var(--baramiz-type-button-size)",
          lineHeight: "var(--baramiz-type-button-line-height)",
        },
      },
    },
    ActionIcon: {
      defaultProps: {
        radius: "xl",
        size: "lg",
      },
      styles: {
        root: {
          minWidth: "var(--baramiz-layout-touch-target-min)",
          minHeight: "var(--baramiz-layout-touch-target-min)",
        },
      },
    },
    Input: {
      defaultProps: {
        size: "md",
        radius: "xl",
      },
      styles: {
        input: {
          minHeight: "var(--baramiz-layout-touch-target-min)",
          backgroundColor: "var(--baramiz-color-surface-primary)",
          borderColor: "var(--baramiz-color-border-soft)",
          color: "var(--baramiz-color-text-primary)",
          fontSize: "var(--baramiz-type-body-size)",
          lineHeight: "var(--baramiz-type-body-line-height)",
        },
        label: {
          fontSize: "var(--baramiz-type-label-size)",
          lineHeight: "var(--baramiz-type-label-line-height)",
          fontWeight: 700,
          color: "var(--baramiz-color-text-secondary)",
          marginBottom: rem(6),
        },
        description: {
          fontSize: "var(--baramiz-type-helper-size)",
          lineHeight: "var(--baramiz-type-helper-line-height)",
          color: "var(--baramiz-color-text-muted)",
        },
        error: {
          fontSize: "var(--baramiz-type-helper-size)",
          lineHeight: "var(--baramiz-type-helper-line-height)",
          fontWeight: 600,
        },
      },
    },
    Card: {
      defaultProps: {
        radius: "xl",
        shadow: "md",
      },
    },
    Paper: {
      defaultProps: {
        radius: "xl",
      },
    },
    Badge: {
      defaultProps: {
        radius: "xl",
        variant: "light",
      },
      styles: {
        root: {
          minHeight: rem(28),
          fontWeight: 700,
        },
      },
    },
    SegmentedControl: {
      styles: {
        root: {
          minHeight: "var(--baramiz-layout-touch-target-min)",
          backgroundColor: "var(--baramiz-color-surface-secondary)",
          borderRadius: "var(--baramiz-radius-xl)",
        },
        label: {
          minHeight: "var(--baramiz-layout-touch-target-min)",
          fontSize: "var(--baramiz-type-body-sm-size)",
          fontWeight: 700,
        },
      },
    },
  },
});

export const mantineCssVariablesResolver: CSSVariablesResolver = () => ({
  variables: {
    "--baramiz-color-brand-50": color.brandScale[0],
    "--baramiz-color-brand-100": color.brandScale[1],
    "--baramiz-color-brand-200": color.brandScale[2],
    "--baramiz-color-brand-300": color.brandScale[3],
    "--baramiz-color-brand-400": color.brandScale[4],
    "--baramiz-color-brand-500": color.brandScale[5],
    "--baramiz-color-brand-600": color.brandScale[6],
    "--baramiz-color-brand-700": color.brandScale[7],
    "--baramiz-color-bg-canvas": color.background.canvas,
    "--baramiz-color-bg-tint": color.background.canvasTint,
    "--baramiz-color-bg-subtle": color.background.subtle,
    "--baramiz-color-surface-primary": color.surface.primary,
    "--baramiz-color-surface-secondary": color.surface.secondary,
    "--baramiz-color-surface-elevated": color.surface.elevated,
    "--baramiz-color-surface-dark": color.surface.dark,
    "--baramiz-color-text-primary": color.text.primary,
    "--baramiz-color-text-secondary": color.text.secondary,
    "--baramiz-color-text-muted": color.text.muted,
    "--baramiz-color-text-inverse": color.text.inverse,
    "--baramiz-color-border-soft": color.border.soft,
    "--baramiz-color-border-strong": color.border.strong,
    "--baramiz-color-accent-soft": color.accent.soft,
    "--baramiz-color-accent-glow": color.accent.glow,
    "--baramiz-color-teal": color.support.teal,
    "--baramiz-color-teal-soft": color.support.tealSoft,
    "--baramiz-color-success": color.support.success,
    "--baramiz-color-danger": color.support.danger,
    "--baramiz-space-xs": spacing.xs,
    "--baramiz-space-sm": spacing.sm,
    "--baramiz-space-md": spacing.md,
    "--baramiz-space-lg": spacing.lg,
    "--baramiz-space-xl": spacing.xl,
    "--baramiz-space-2xl": spacing.xxl,
    "--baramiz-space-3xl": spacing.xxxl,
    "--baramiz-space-4xl": spacing.xxxxl,
    "--baramiz-radius-xs": radius.xs,
    "--baramiz-radius-sm": radius.sm,
    "--baramiz-radius-md": radius.md,
    "--baramiz-radius-lg": radius.lg,
    "--baramiz-radius-xl": radius.xl,
    "--baramiz-radius-2xl": radius.xxl,
    "--baramiz-radius-full": radius.full,
    "--baramiz-shadow-xs": shadow.xs,
    "--baramiz-shadow-sm": shadow.sm,
    "--baramiz-shadow-md": shadow.md,
    "--baramiz-shadow-lg": shadow.lg,
    "--baramiz-shadow-floating": shadow.floating,
    "--baramiz-type-display-size": typography.display.fontSize,
    "--baramiz-type-display-line-height": typography.display.lineHeight,
    "--baramiz-type-display-weight": typography.display.fontWeight,
    "--baramiz-type-h1-size": typography.headingLg.fontSize,
    "--baramiz-type-h1-line-height": typography.headingLg.lineHeight,
    "--baramiz-type-h1-weight": typography.headingLg.fontWeight,
    "--baramiz-type-h2-size": typography.headingMd.fontSize,
    "--baramiz-type-h2-line-height": typography.headingMd.lineHeight,
    "--baramiz-type-h2-weight": typography.headingMd.fontWeight,
    "--baramiz-type-h3-size": typography.headingSm.fontSize,
    "--baramiz-type-h3-line-height": typography.headingSm.lineHeight,
    "--baramiz-type-h3-weight": typography.headingSm.fontWeight,
    "--baramiz-type-body-size": typography.body.fontSize,
    "--baramiz-type-body-line-height": typography.body.lineHeight,
    "--baramiz-type-body-weight": typography.body.fontWeight,
    "--baramiz-type-body-sm-size": typography.bodySm.fontSize,
    "--baramiz-type-body-sm-line-height": typography.bodySm.lineHeight,
    "--baramiz-type-body-sm-weight": typography.bodySm.fontWeight,
    "--baramiz-type-label-size": typography.label.fontSize,
    "--baramiz-type-label-line-height": typography.label.lineHeight,
    "--baramiz-type-label-weight": typography.label.fontWeight,
    "--baramiz-type-helper-size": typography.helper.fontSize,
    "--baramiz-type-helper-line-height": typography.helper.lineHeight,
    "--baramiz-type-helper-weight": typography.helper.fontWeight,
    "--baramiz-type-button-size": typography.button.fontSize,
    "--baramiz-type-button-line-height": typography.button.lineHeight,
    "--baramiz-type-button-weight": typography.button.fontWeight,
    "--baramiz-layout-app-max-width": layout.appMaxWidth,
    "--baramiz-layout-header-height": layout.headerHeight,
    "--baramiz-layout-tab-bar-height": layout.tabBarHeight,
    "--baramiz-layout-touch-target-min": layout.touchTargetMin,
  },
  light: {},
  dark: {},
});
