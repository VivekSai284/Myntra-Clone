import { lightColors, darkColors } from "./colors";

export const themes = {
  light: {
    name: "light",
    colors: lightColors,
  },
  dark: {
    name: "dark",
    colors: darkColors,
  },
};

export type ThemeType = keyof typeof themes;