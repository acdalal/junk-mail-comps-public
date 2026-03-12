import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { OrderProvider } from "@/context/orderContext";
import { PinProvider } from "@/context/pinContext";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  // Sets the notification behavior once when the app starts
  useEffect(() => {
    // Handles how notifications work in the foreground (App is running)
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true, // Gets the actual notif to pop up
        shouldShowList: true, // Saves the notification to the notification history
      }),
    });
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <OrderProvider>
        <PinProvider>
          <Stack screenOptions={{ headerShown: false }}></Stack>
          <StatusBar style="auto" />
        </PinProvider>
      </OrderProvider>
    </ThemeProvider>
  );
}
