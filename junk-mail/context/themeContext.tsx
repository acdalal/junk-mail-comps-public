import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme as useSystemColorScheme } from "react-native";

type ColorScheme = "light" | "dark";

type ThemeContextType = {
  colorScheme: ColorScheme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  colorScheme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const system = useSystemColorScheme() ?? "light";
  const [colorScheme, setColorScheme] = useState<ColorScheme>(system);

  useEffect(() => {
    AsyncStorage.getItem("darkModeEnabled").then((saved) => {
      if (saved !== null) setColorScheme(JSON.parse(saved) ? "dark" : "light");
    });
  }, []);

  const toggleTheme = async () => {
    const next: ColorScheme = colorScheme === "light" ? "dark" : "light";
    setColorScheme(next);
    await AsyncStorage.setItem("darkModeEnabled", JSON.stringify(next === "dark"));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
