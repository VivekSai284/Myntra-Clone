import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Appearance } from "react-native";
import { themes, ThemeType } from "./theme";

const STORAGE_KEY = "appTheme";

type ThemeContextType = {
  theme: typeof themes.light;
  themeName: ThemeType;
  toggleTheme: () => void;
  setTheme: (name: ThemeType) => void;
};

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

export const ThemeProvider = ({ children }: any) => {
  const [themeName, setThemeName] = useState<ThemeType>("light");

  // ✅ First launch detection
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);

      if (saved) {
        setThemeName(saved as ThemeType);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setThemeName(systemTheme === "dark" ? "dark" : "light");
      }
    } catch (err) {
      console.log("Theme load error", err);
    }
  };

  // ✅ persist theme
  const setTheme = async (name: ThemeType) => {
    setThemeName(name);
    await AsyncStorage.setItem(STORAGE_KEY, name);
  };

  const toggleTheme = () => {
    setTheme(themeName === "light" ? "dark" : "light");
  };

  const value: ThemeContextType = {
    theme: themes[themeName],
    themeName,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};