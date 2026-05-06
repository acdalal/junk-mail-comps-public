import { Image } from "expo-image";
import { Pressable, StyleSheet, View } from "react-native";

import { getCurrentUser } from "@/app/utils/accountStorage";
import { auth, db } from "@/app/utils/firebaseConfig";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { Colors, Fonts } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useCallback, useState } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";


/* This is the Home page. On this page, the user is introduced to the Junk Mail
program and can place a new order or view their past orders. */

// This creates the bell icon when an order has been delivered.
export function NotificationBell() {
  return (
    <View style={styles.container}>
      <Ionicons name="notifications-outline" size={24} color="black" />


      {/* Red dot */}
      <View style={styles.badge} />
    </View>
  );
}

export default function HomeScreen() {
  const user = getCurrentUser();
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkNotification = async () => {
        const user = auth.currentUser;
        if (!user) {
          if (isActive) setShowNotification(false);
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (!userDoc.exists()) {
            if (isActive) setShowNotification(false);
            return;
          }

          const userData = userDoc.data();
          const notif = userData?.notif;

          console.log("notif:", notif);

          if (notif) {
            if (isActive) setShowNotification(true);
          } else {
            if (isActive) setShowNotification(false);
          }
        } catch (error) {
          console.error("Error checking notification:", error);
          if (isActive) setShowNotification(false);
        }
      };

      checkNotification();

      return () => {
        isActive = false;
      };
    }, [])
  );



  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ThemedText
        type="title"
        style={[
          styles.title,
          {
            paddingTop: 70,
            paddingRight: 30,
            fontSize: 15,
            color: colors.text,
            fontFamily: Fonts.medium,
            textAlign: "right",
          },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Hi, ${user?.displayName}!`}
      >
        Hi, {user?.displayName}!
      </ThemedText>
      <View
        style={styles.logoContainer}
        accessible={true}
        accessibilityLabel="Junk Mail logo header"
      >
        <Image
          source={require("@/assets/images/junkmaillogobackground.png")}
          style={styles.JunkMailLogo}
          contentFit="contain"
          accessible={true}
          accessibilityLabel="Junk Mail logo"
          accessibilityRole="image"
        />
      </View>
      <ThemedText
        style={[
          styles.junkMailTitle,
          { color: colors.text, fontFamily: Fonts.bold },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Junk Mail"
      >
        Junk Mail
      </ThemedText>

      <ThemedText
        style={[
          styles.description,
          { color: colors.text, fontFamily: Fonts.regular, marginTop: 10, },
        ]}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel="A delivery service offered by the Office of Health Promotion for free sexual health supplies at Carleton College. Junk Mail is delivered to students' campus mailboxes, not off-campus."
      >
        Junk Mail is a delivery service for free sexual health and menstrual supplies
        offered by the Office of Health Promotion at Carleton College. Products are
        delivered to Carleton students' on-campus mailboxes.
      </ThemedText>

      {/* <ThemedText
        type="title"
        style={[
          styles.title,
          {
            paddingTop: 35,
            fontSize: 20,
            color: colors.text,
            fontFamily: Fonts.medium,
          },
        ]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`Hi, ${user?.displayName}!`}
      >
        Hi, {user?.displayName}!
      </ThemedText> */}

      {/* Styles and renders the Place Order button. */}
      <ThemedView style={{ alignItems: "center", marginTop: 20 }}>
        <Link href="/placeOrder" asChild>
          <PrimaryButton
            icon="bag"
            title="Place Order"
            onPress={() => { }}
            accessible={true}
            accessibilityLabel="Place Order"
            accessibilityHint="Navigate to place a new order for sexual health supplies"
            accessibilityRole="button"
          />
        </Link>
      </ThemedView>

      {/* Styles and renders the Past Orders button. */}
      <ThemedView style={{ alignItems: 'center' }}>
        <Link href="/pastOrders" asChild>
          <ThemedView style={styles.container}>
            <Pressable
              onPress={() => router.push("/pastOrders")}
              accessible={true}
              accessibilityLabel="Past Orders"
              accessibilityHint="Navigate to view your order history"
              accessibilityRole="button"
              accessibilityState={{ disabled: false }}
              style={[
                styles.button,
                { backgroundColor: false ? '#E0E0E0' : colors.buttonBackground }
              ]}
            >
              <ThemedView style={styles.content}>
                <IconSymbol
                  name="clock"
                  size={24}
                  color={colors.buttonText}
                />


                <ThemedView style={styles.textRow}>
                  <ThemedText
                    type="defaultSemiBold"
                    style={[
                      styles.text,
                      { color: colors.buttonText, fontFamily: Fonts.semiBold }
                    ]}
                  >
                    Past Orders
                  </ThemedText>


                  {/* Bell */}
                  {showNotification && (
                    <ThemedView style={styles.bellContainer}>
                      <Ionicons
                        name="notifications-outline"
                        size={28}
                        accessibilityLabel="Notifications"
                        accessibilityHint="You have unread notifications"
                        color="white"
                      />
                      <ThemedView style={styles.badge} />
                    </ThemedView>
                  )}


                </ThemedView>


              </ThemedView>


            </Pressable>
          </ThemedView>
        </Link>
      </ThemedView>

    </View>
  );
}

// Defines style sheets for each modular component on the page
const styles = StyleSheet.create({
  logoContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  JunkMailLogo: {
    height: 160,
    width: 160,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: -10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 35,
  },
  junkMailTitle: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 30,
    lineHeight: 40,
  },
  bellContainer: {
    position: "absolute",
    left: -75,
    backgroundColor: 'transparent',
    top: "25%",
    transform: [{ translateY: -9 }],
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "red",
  },
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    borderRadius: 8,
    width: 280,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 16,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    position: 'relative',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'transparent',
  },

});
