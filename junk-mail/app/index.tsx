import { Image } from "expo-image";
import {
  StyleSheet, View
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { Colors, Fonts } from '@/constants/theme';
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { useColorScheme } from '@/hooks/use-color-scheme';
import { onAuthChange } from "@/app/utils/accountStorage";

/* This is the Sign Up/Log in page. On this page, the user can sign up for an account
for the Junk Mail app or log in if they already have one. */

export default function IndexScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
useEffect(() => {
  const unsubscribe = onAuthChange((user) => {
    console.log("Auth state loaded:", user ? user.email : "No user");
    if (user) {
      router.replace("/(tabs)/home");
    }
    setIsCheckingAuth(false);
  });

  return unsubscribe;
}, []);

if (isCheckingAuth) {
    return null; // or return a loading spinner
  }

  return (
    <View style={{flex: 1, backgroundColor: colors.background}}>
          <View style={styles.logoContainer}
            accessible={true}
            accessibilityLabel="Junk Mail logo header">
                <Image
                  source={require('@/assets/images/junkmaillogobackground.png')}
                  style={styles.JunkMailLogo}
                  contentFit="contain"
                  accessible={true}
                  accessibilityLabel="Junk Mail logo"
                  accessibilityRole="image"

                />
          </View>
  <ThemedText style={[styles.junkMailTitle, {color: colors.text, fontFamily: Fonts.bold}]}
    accessible={true}
    accessibilityRole="header"
    accessibilityLabel="Junk Mail">
      Junk Mail
  </ThemedText>

  <View style={{ height: 20 }} />

      {/* Styles and renders the Sign Up button. */}
      <ThemedView style={{ alignItems: 'center', marginTop: 20, }}>
        <Link href="/signUp" asChild>
          <PrimaryButton
            icon="person.badge.plus"
            title="Sign Up"
            onPress={() => {}}
            accessible={true}
            accessibilityLabel="Sign Up"
            accessibilityHint="Create a new Junk Mail account"
          />
        </Link>
      </ThemedView>

      {/* Styles and renders the Log In button. */}
      <ThemedView style={{ alignItems: 'center', marginTop: 20, }}>
        <Link href="/logIn" asChild>
          <PrimaryButton
            icon="person.crop.circle"
            title="Log In"
            onPress={() => {}}
            accessible={true}
            accessibilityLabel="Log In"
            accessibilityHint="Sign in to your existing account"
          />
        </Link>
      </ThemedView>
 </View>
  );
}

// Defines style sheets for each modular component on the page
const styles = StyleSheet.create({
   logoContainer: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  JunkMailLogo: {
    height: 160,
    width: 160,
  },
   junkMailTitle: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 70,
    lineHeight: 40,
  },
});