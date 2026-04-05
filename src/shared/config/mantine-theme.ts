import { createTheme } from "@mantine/core";

export const mantineTheme = createTheme({
  primaryColor: "baramizGold",
  defaultRadius: "xl",
  fontFamily: "Manrope, system-ui, sans-serif",
  headings: {
    fontFamily: '"Cormorant Garamond", serif',
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "2.35rem", lineHeight: "0.95" },
      h2: { fontSize: "1.65rem", lineHeight: "1" },
      h3: { fontSize: "1.2rem", lineHeight: "1.1" },
    },
  },
  colors: {
    baramizGold: [
      "#fff5e6",
      "#fde7c3",
      "#f7cf89",
      "#f1b750",
      "#eda324",
      "#eb9710",
      "#d17f05",
      "#a86400",
      "#875000",
      "#6f4200",
    ],
    baramizInk: [
      "#eef2f6",
      "#d7dee7",
      "#afbccb",
      "#8598ae",
      "#627a92",
      "#4f6a84",
      "#435d77",
      "#374d63",
      "#2d4052",
      "#223242",
    ],
    baramizSand: [
      "#fbf8f2",
      "#f4eee1",
      "#e9dcc0",
      "#deca9f",
      "#d5bb83",
      "#cfb175",
      "#c39b5f",
      "#ac8650",
      "#967244",
      "#80603a",
    ],
    baramizTeal: [
      "#ebf7f4",
      "#d6ece6",
      "#acdacd",
      "#7fc6b4",
      "#59b69e",
      "#41ab90",
      "#31937b",
      "#267565",
      "#1d5d51",
      "#13463d",
    ],
  },
  shadows: {
    md: "0 18px 38px rgba(37, 27, 15, 0.12)",
    xl: "0 26px 60px rgba(37, 27, 15, 0.18)",
  },
  components: {
    Button: {
      defaultProps: {
        radius: "xl",
        size: "md",
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
    },
  },
});
