import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarInactiveBackgroundColor: Colors[colorScheme ?? "light"].primary,
        tabBarActiveBackgroundColor: Colors[colorScheme ?? "light"].primary,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tabIconSelected,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 10,
          backgroundColor: Colors[colorScheme ?? "light"].primary,
        },
      }}
    >
      <Tabs.Screen
        name="faq"
        options={{
          title: "FAQ",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="info.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="gearshape.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="placeOrder"
        options={{
          title: "Place Order",
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="pastOrders"
        options={{
          title: "Past Orders",
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="reviewOrder"
        options={{
          title: "Review",
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="orderConfirmation"
        options={{
          title: "Review",
          tabBarItemStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="SWApage"
        options={{
          title: "Review",
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
