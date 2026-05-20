import { useTheme } from "@/context/themeContext";

export function useColorScheme() {
  return useTheme().colorScheme;
}
