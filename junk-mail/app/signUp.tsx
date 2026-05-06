import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

import { signUp } from "@/app/utils/accountStorage";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { registerPushNotifications } from "./utils/pushNotifications";

/* This is the sign up page, where users can create an account. They must
   use a unique Carleton email address and a password of length >= 6 in order 
   to successfully make an account. */

export default function IndexScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidEmailPasswordError, setShowInvalidEmailPasswordError] =
    useState(false);
  const [alreadyAccountErrorMessage, setAlreadyAccountErrorMessage] =
    useState(false);

  //checks for email validity
  const isEmailValid = () => {
    if (email.endsWith("@carleton.edu")) {
      return true;
    } else {
      return false;
    }
  };

  const buildAndAddAccount = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => {
    //resets to false each time user hits sign up (in case they corrected their mistake)
    setAlreadyAccountErrorMessage(false);
    // this logic checks if email or password is invalid and sets error message accordingly
    if (!isEmailValid()) {
      setShowInvalidEmailPasswordError(true);
      return;
    } else if (password.length < 6) {
      setShowInvalidEmailPasswordError(true);
      return;
    }
    //resets to false if the user enters good email and password
    else {
      setShowInvalidEmailPasswordError(false);
    }

    try {
      // signing up using firebase auth
      const result = await signUp(email, password, firstName, lastName);

      if (result.success) {
        console.log("Account created successfully:", result.user?.email);

        //clear form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");

        // Registers user for push notifications if permission granted
        const token = await registerPushNotifications();
        console.log("Expo push token:", token);
        if (!token) {
          alert(
            "Notifications are disabled. You can enable them later in your phone settings to get reminders and updates.",
          );
        }

        //immediately redirects to home
        router.push("/home");
      } else {
        //checks if email is already associated with an account and triggers error message
        if (result.error?.includes("email-already-in-use")) {
          setAlreadyAccountErrorMessage(true);
        }
      }
    } catch (e) {
      console.error("Failed to create account:", e);
      alert("An unexpected error occurred. Please try again.");
    } finally {
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
          accessibilityLabel="Sign Up"
        >
          Sign Up
        </ThemedText>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView keyboardShouldPersistTaps="handled" style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              flexGrow: 1,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={styles.addMoreButton}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
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
                <ThemedText style={{ fontSize: 16, fontFamily: Fonts.regular }}>
                  Back
                </ThemedText>
              </View>
            </Pressable>
          </View>
          {/* Input area with fields: first name, last name, email, password */}
          <View
            style={styles.accountBox}
            accessible={true}
            accessibilityRole="text"
          >
            <ThemedText style={styles.accountText}>First Name</ThemedText>
            <TextInput
              style={{
                backgroundColor: colors.container,
                opacity: 0.6,
                padding: 10,
                marginBottom: 30,
                borderRadius: 8,
                marginTop: 5,
                marginLeft: 50,
                marginRight: 50,
                fontFamily: Fonts.regular,
                fontSize: 14,
              }}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              placeholder="Your first name"
              placeholderTextColor={colors.text}
              accessible={true}
              accessibilityLabel="First name input"
              accessibilityHint="Enter your first name"
              accessibilityValue={{ text: firstName || "Empty" }}
            />
            <ThemedText
              style={styles.accountText}
              accessible={true}
              accessibilityRole="text"
            >
              Last Name
            </ThemedText>
            <TextInput
              style={{
                backgroundColor: colors.container,
                opacity: 0.6,
                padding: 10,
                marginBottom: 30,
                borderRadius: 8,
                marginTop: 5,
                marginLeft: 50,
                marginRight: 50,
                fontFamily: Fonts.regular,
                fontSize: 14,
              }}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              placeholder="Your last name"
              placeholderTextColor={colors.text}
              accessible={true}
              accessibilityLabel="Last name input"
              accessibilityHint="Enter your last name"
              accessibilityValue={{ text: lastName || "Empty" }}
            />
            <ThemedText
              style={styles.accountText}
              accessible={true}
              accessibilityRole="text"
            >
              Email
            </ThemedText>
            <TextInput
              style={{
                backgroundColor: colors.container,
                opacity: 0.6,
                padding: 10,
                marginBottom: 30,
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
              accessibilityHint="Enter your carleton.edu email address"
              accessibilityValue={{ text: email || "Empty" }}
            />
            <ThemedText
              style={styles.accountText}
              accessible={true}
              accessibilityRole="text"
            >
              Password
            </ThemedText>
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
              textContentType="newPassword"
              accessible={true}
              accessibilityLabel="Password input"
              accessibilityHint="Enter a password with at least 6 characters"
              accessibilityValue={{
                text: password ? "Password entered" : "Empty",
              }}
            />
            <View style={{ marginBottom: 0 }}>
              {/* Error message logic */}
              {invalidEmailPasswordError && (
                <ThemedText
                  style={styles.errorText}
                  accessible={true}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  accessibilityLabel="Error: Please ensure you are using a valid carleton.edu email address and your password is at least six characters long"
                >
                  You must enter a valid Carleton email and your password must
                  be at least six characters long.
                </ThemedText>
              )}
              {alreadyAccountErrorMessage && (
                <ThemedText
                  style={styles.errorText}
                  accessible={true}
                  accessibilityRole="alert"
                  accessibilityLiveRegion="polite"
                  accessibilityLabel="Error: An account already exists with this email."
                >
                  This email is already associated with an account.
                </ThemedText>
              )}
            </View>
          </View>
          <ThemedView style={{ alignItems: "center", marginVertical: 40 }}>
            <ThemedView style={{ alignItems: "center" }}>
              <PrimaryButton
                icon="person.badge.plus"
                title="Sign Up"
                onPress={() =>
                  buildAndAddAccount(firstName, lastName, email, password)
                }
                accessible={true}
                accessibilityLabel="Sign Up"
                accessibilityHint="Create your Junk Mail account"
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
