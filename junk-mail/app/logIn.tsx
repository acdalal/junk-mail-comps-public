import {
  KeyboardAvoidingView,
  Platform, Pressable, ScrollView, StyleSheet,
  TextInput,
  Alert,
  View
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { resetPassword, signIn } from "@/app/utils/accountStorage";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";
import React, { useState } from "react";
import { registerPushNotifications } from "./utils/pushNotifications";

/* This is the sign up page, where users can create an account. They must
   use a Carleton email address in order to successfully make an account. */

export default function IndexScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidAccountError, setShowInvalidAccountError] = useState(false);

  const handleLogIn = async () => {
    if (!email) {
      setShowInvalidAccountError(true);
      return;
    }
    if (!password) {
      setShowInvalidAccountError(true);
      return;
    }

    setShowInvalidAccountError(false);

    try {
      const result = await signIn(email, password);

      if (result.success) {
        setEmail("");
        setPassword("");
        router.push("/home");
        registerPushNotifications().catch(console.log);
      } else {
        setShowInvalidAccountError(true);
      }
    } catch (e) {
      setShowInvalidAccountError(true);
    } finally {
    }
  };

  const handleForgotPassword = async () => {
  if (!email) {
    Alert.alert("Reset Password", "Please enter your email address first, then click 'Forgot password?'");
    return;
  }

  const result = await resetPassword(email);
  if (result.success) {
    Alert.alert("Reset Password", "If an account exists for this email, a password reset link will be sent to your email");
  } else {
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={[
            styles.screenTitle,
            { color: colors.text, fontFamily: Fonts.bold },
          ]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Log In"
        >
          Log In
        </ThemedText>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Pressable onPress={() => router.back()} style={styles.addMoreButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                accessibilityHint="Returns to the previous screen">
              <Ionicons
                name="arrow-back-circle-outline"
                size={38}
                color={colors.text}
                style={{ marginRight: 8 }}
                />
                <View
                style={{
                  flexShrink: 1,
                  flexGrow: 1,
                  flexWrap: "wrap",
                }}
              >
                <ThemedText style={{ fontSize: 16, fontFamily:Fonts.regular }}>Back</ThemedText>
              </View>
            </Pressable>
          </View>

          {/* Input area with fields: first name, last name, email, password */}
          <View style={styles.accountBox}>
            <ThemedText style={styles.accountText}
              accessible={true}
              accessibilityRole="text">Email</ThemedText>
            <TextInput
              style={{
                backgroundColor: colors.container,
                opacity: 0.6,
                padding: 10,
                marginBottom: 20,
                borderRadius: 8,
                marginTop: 5,
                marginLeft: 50,
                marginRight: 50,
                fontFamily: Fonts.regular,
                fontSize: 14,
              }}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Your email"
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              accessible={true}
              accessibilityLabel="Email input"
              accessibilityHint="Enter your Carleton.edu email address"
              accessibilityValue={{ text: email || "Empty" }}
            />
            <ThemedText style={styles.accountText}
              accessible={true}
              accessibilityRole="text">Password</ThemedText>
            <TextInput
              style={{
                backgroundColor: colors.container,
                opacity: 0.6,
                padding: 10,
                marginBottom: 10,
                borderRadius: 8,
                marginTop: 5,
                marginLeft: 50,
                marginRight: 50,
                fontFamily: Fonts.regular,
                fontSize: 14,
              }}
              value={password}
              onChangeText={(text) => setPassword(text)}
              placeholder="Your password"
              secureTextEntry={true}
              placeholderTextColor={colors.text}
              autoCapitalize="none"
              textContentType="password"
              accessible={true}
              accessibilityLabel="Password input"
              accessibilityHint="Enter your password"
              accessibilityValue={{ text: password ? "Password entered" : "Empty" }}
            />
            <View style={{ marginBottom: 20 }}>
              {invalidAccountError && (
                <ThemedText style={styles.errorText}
                  accessible={true}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  accessibilityLabel="Error: The email or password you entered is incorrect">
                  The email or password you entered is incorrect.
                </ThemedText>
              )}
            </View>
            <Pressable
                onPress={handleForgotPassword}
                style={{ alignItems: "flex-end", marginRight: 125, marginTop: -15 }}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Forgot password"
                accessibilityHint="Sends a password reset link to your email"
              >
                <ThemedText style={{ fontSize: 13, fontFamily: Fonts.medium, color: colors.text, opacity: 0.7,  textDecorationLine: "underline" }}>
                  Forgot password?
                </ThemedText>
              </Pressable>
          </View>
          <ThemedView style={{ alignItems: "center", marginVertical: 40 }}>
            <ThemedView style={{ alignItems: 'center' }}>
              <PrimaryButton
                icon="person.crop.circle"
                title="Log In"
                onPress={handleLogIn}
                accessible={true}
                accessibilityLabel="Log In"
                accessibilityHint="Sign in to your Junk Mail account"
              />
            </ThemedView>
          </ThemedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 5,
  },
  screenTitle: {
    fontSize: 45,
    fontFamily: Fonts.bold,
    textAlign: "left",
    paddingTop: 75,
    paddingLeft: 20,
    lineHeight: 50,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    paddingHorizontal: 15,
    paddingLeft: 30,
    justifyContent: "flex-start",
  },
  accountText: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: Fonts.semiBold,
    paddingHorizontal: 4,
    marginLeft: 50,
  },
  accountBox: {
    backgroundColor: "#FABFD7",
    borderRadius: 12,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 0,
    padding: 30,
    paddingLeft: 5,
    // Drop Shadow/Elevation
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  errorText: {
    fontSize: 12,
    fontFamily: Fonts.medium,
    color: "red",
    marginLeft: 50,
    marginRight: 30,
    textAlign: "left",
    marginTop: 0,
  },
});
