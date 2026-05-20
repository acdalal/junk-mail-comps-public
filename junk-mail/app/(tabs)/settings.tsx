import {
  Alert,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { faqStyles } from "@/components/ui/faq-styles";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Title } from "@/components/ui/title";
import { Colors, Fonts } from "@/constants/theme";
import { usePin } from "@/context/pinContext";
import { useTheme } from "@/context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TextInput } from "react-native";
import { getCurrentUserWithToken, logOut } from "../utils/accountStorage";
import { db } from "../utils/firebaseConfig";
import {
  allowNotificationsCheck,
  scheduleReminder,
} from "../utils/notifications";
import { registerPushNotifications } from "../utils/pushNotifications";

/* This is the settings page, where various settings like notifications and reminder
frequency can be enabled/disabled and modified.*/

export default function TabTwoScreen() {
  const { colorScheme, toggleTheme } = useTheme();
  const colors = Colors[colorScheme];

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [saveOrdersEnabled, setSaveOrdersEnabled] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState("Never");

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");

  useEffect(() => {
    async function loadSettings() {
      const notif = await AsyncStorage.getItem("notificationsEnabled");
      const saveOrders = await AsyncStorage.getItem("saveOrdersEnabled");
      const reminder = await AsyncStorage.getItem("reminderFrequency");

      if (notif !== null) setNotificationsEnabled(JSON.parse(notif));
      if (saveOrders !== null) setSaveOrdersEnabled(JSON.parse(saveOrders));
      if (reminder !== null) setReminderFrequency(reminder);
    }
    loadSettings();
  }, []);

  // Alerts the user to confirm before logging out
  // redirects to the root screen
  const handleLogout = () => {
    Alert.alert(
      "Log out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive", // red
          onPress: () => {
            logOut();
            router.replace("/"); // replace prevents user going back/undoing
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Toggles push notification preference on/off
  const toggleNotifs = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem(
      "notificationsEnabled",
      JSON.stringify(newValue),
    );

    const user = await getCurrentUserWithToken();
    if (user) {
      const userReference = doc(db, "users", user.uid);
      await updateDoc(userReference, {
        deliveryNotificationsEnabled: newValue,
      });
    }

    if (newValue) {
      const token = await registerPushNotifications();
      if (!token) {
        Alert.alert(
          "Notifications Disabled",
          "Enabled notifications in your device settings to use delivery notifications.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        setNotificationsEnabled(false);
        await AsyncStorage.setItem(
          "notificationsEnabled",
          JSON.stringify(false),
        );

        if (user) {
          await updateDoc(doc(db, "users", user.uid), {
            deliveryNotificationsEnabled: false,
          });
        }
      }
    }
  };

  // Toggles whether completed orders are saved to Past Orders
  const toggleOrderSaving = async () => {
    const newValue = !saveOrdersEnabled;
    setSaveOrdersEnabled(newValue);
    await AsyncStorage.setItem("saveOrdersEnabled", JSON.stringify(newValue));
  };

  // Updates reminder frequency and schedules the related notification
  // Passing "Never" cancels any existing scheduled reminders
  const handleReminderFrequencyChange = async (value: string) => {
    if (value === reminderFrequency) return;

    if (value === "Never") {
      setReminderFrequency(value);
      await AsyncStorage.setItem("reminderFrequency", value);
      await scheduleReminder("Never");
      console.log("Reminders turned off");
      return;
    }

    const allowed = await allowNotificationsCheck();
    if (!allowed) {
      Alert.alert(
        "Notifications Disabled",
        "You need to enable notifications in your device settings to set reminders.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => {
              if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
              } else {
                Linking.openSettings();
              }
            },
          },
        ],
      );
      return;
    }
    setReminderFrequency(value);
    await AsyncStorage.setItem("reminderFrequency", value);
    scheduleReminder(
      value as "Daily" | "Weekly" | "Biweekly" | "Monthly" | "Never",
    )
      .then(() => console.log(`Scheduled reminder for ${value}`))
      .catch((err) => console.error("Failed to schedule reminder:", err));
  };

  const router = useRouter();
  const { pin } = usePin();

  // Opens the SWA side of the app when clicked.
  // The user must enter a pin to be granted access.
  const handleSWA = () => {
    setPinModalVisible(true);
  };
  // decided to use type for modularity. Makes it easier to add more settings nodes later
  type SettingsRowProps = {
    title: string;
    description: string;
    type?: "checkbox" | "dropdown";
    checked?: boolean;

    // for dropdown
    options?: string[];
    value?: string;
    onSelect?: (value: string) => void;
  };

  // Reusable settings row component
  // Supports checkbox (toggle) and dropdown variants
  // Designed to make adding new settings super easy
  const SettingsRow = ({
    title,
    description,
    type = "checkbox",
    checked = false,
    options = [],
    value,
    onSelect,
  }: SettingsRowProps) => {
    const [open, setOpen] = useState(false);

    //checkbox
    if (type === "checkbox") {
      return (
        <Pressable style={[faqStyles.faqItem, { width: "98%", backgroundColor: colors.surface }]}>
          <View style={faqStyles.questionContainer}>
            <View style={{ flex: 1 }}>
              <Text style={[faqStyles.questionText, { color: colors.text }]}>{title}</Text>
              {description && (
                <Text
                  style={{ color: colors.text, opacity: 0.6, marginTop: 4, marginRight: 4 }}
                >
                  {description}
                </Text>
              )}
            </View>
            <Pressable
              onPress={() => onSelect?.(checked ? "false" : "true")}
              accessible={true}
              accessibilityRole="switch"
              accessibilityLabel={`${title}. ${description}`}
              accessibilityState={{ checked: checked }}
              accessibilityHint={
                checked ? "Double tap to turn off" : "Double tap to turn on"
              }
            >
              <Switch
                value={checked}
                onValueChange={() => onSelect?.(!checked ? "true" : "false")}
                trackColor={{ false: "#d1d1d6", true: colors.secondary }}
                thumbColor="#ffffff"
                ios_backgroundColor="#d1d1d6"
              />
            </Pressable>
          </View>
        </Pressable>
      );
    }

    //smaller dropdown componenet
    return (
      <View
        style={[
          faqStyles.faqItem,
          { width: "98%", zIndex: open ? 1000 : 1, overflow: "visible", backgroundColor: colors.surface },
        ]}
      >
        <Pressable
          onPress={() => setOpen((prev) => !prev)}
          style={faqStyles.questionContainer}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${title}. ${description}. Current value: ${value}`}
          accessibilityHint={
            open
              ? "Double tap to collapse options"
              : "Double tap to expand options"
          }
          accessibilityState={{ expanded: open }}
        >
          <View style={{ flex: 1 }}>
            <Text style={[faqStyles.questionText, { color: colors.text }]}>{title}</Text>
            {description && (
              <Text style={{ color: colors.text, opacity: 0.6, marginTop: 4, marginRight: 4 }}>
                {description}
              </Text>
            )}
          </View>
          <View
            style={{ minWidth: 75, alignItems: "flex-end", marginRight: 8 }}
          >
            <Text style={[styles.dropdownValue, { color: colors.text }]}>{value}</Text>
          </View>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={14}
            color={colors.primary}
          />
        </Pressable>
        {open && (
          <View
            style={{
              position: "absolute",
              right: 0,
              top: "80%",
              width: 140,
              maxHeight: 160,
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              zIndex: 1001,
            }}
          >
            <ScrollView nestedScrollEnabled={true}>
              <View style={[faqStyles.answerContainer, { borderTopColor: colors.border }]}>
                {options.map((option) => (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onSelect?.(option);
                      setOpen(false);
                    }}
                    style={{ paddingVertical: 8 }}
                    accessible={true}
                    accessibilityRole="button"
                    accessibilityLabel={option}
                    accessibilityHint={`Select ${option} as reminder frequency`}
                    accessibilityState={{ selected: option === value }}
                  >
                    <Text
                      style={[
                        { textAlign: "center" },
                        option === value && [
                          faqStyles.answerText,
                          {
                            fontWeight: "600",
                            fontFamily: Fonts.regular,
                            color: colors.text,
                          },
                        ],
                        option !== value && {
                          color: colors.text,
                          opacity: 0.5,
                          marginTop: 4,
                          marginRight: 4,
                        },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  // Renders the main settings container and all settings options
  const MakeSettingsTile = () => {
    return (
      <View
        style={[styles.reviewTile, { padding: 16, backgroundColor: colors.surface }]}
      >
        <ScrollView
          style={{ width: "100%", maxHeight: 800 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          scrollEnabled={false}
        >
          <SettingsRow
            title="Delivery Notifications"
            description="Enable push notifications when your order is ready"
            checked={notificationsEnabled}
            onSelect={toggleNotifs}
          />

          <SettingsRow
            title="Save Orders"
            description="Save your completed orders so you can view them later in Past Orders"
            checked={saveOrdersEnabled}
            onSelect={toggleOrderSaving}
          />

          <SettingsRow
            title="Dark Mode"
            description="Switch between light and dark appearance"
            checked={colorScheme === "dark"}
            onSelect={toggleTheme}
          />

          <SettingsRow
            type="dropdown"
            title="Reminders"
            description="Indicate how often you want to be reminded to order products"
            value={reminderFrequency}
            options={["Never", "Daily", "Weekly", "Biweekly", "Monthly"]}
            onSelect={handleReminderFrequencyChange}
          />

          <Pressable
            onPress={handleSWA}
            style={[
              styles.button,
              {
                alignSelf: "center",
                backgroundColor: colors.buttonBackground,
                borderRadius: 8,
                marginTop: 5,
                height: 70,
                justifyContent: "center",
                alignItems: "center",

                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Admin Access"
            accessibilityHint="Opens admin panel for OHP staff. Requires PIN code"
          >
            <ThemedView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                type="defaultSemiBold"
                style={{ color: colors.buttonText, fontFamily: Fonts.semiBold }}
              >
                Admin Access
              </ThemedText>
            </ThemedView>
          </Pressable>

          <Pressable
            onPress={handleLogout}
            style={[
              styles.button,
              {
                alignSelf: "center",
                backgroundColor: "#c44242", // red
                borderRadius: 8,
                marginTop: 25,
                height: 70,
                justifyContent: "center",
                alignItems: "center",

                // Drop Shadow/Elevation
                shadowColor: "black",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 4,
                elevation: 5,
              },
            ]}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            accessibilityHint="Sign out of your Junk Mail account"
          >
            <ThemedView
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: "transparent",
              }}
            >
              <IconSymbol
                name="rectangle.portrait.and.arrow.right"
                size={24}
                color={colors.buttonText}
              />
              <ThemedText
                type="defaultSemiBold"
                style={{ color: colors.buttonText, fontFamily: Fonts.semiBold }}
              >
                Logout
              </ThemedText>
            </ThemedView>
          </Pressable>
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Title>Settings</Title>
      <MakeSettingsTile />
      <Modal
        transparent
        animationType="fade"
        visible={pinModalVisible}
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter your SWA PIN</Text>
            <Text style={styles.modalSubtitle}>
              This page is for OHP staff only
            </Text>

            <TextInput
              secureTextEntry
              value={enteredPin}
              onChangeText={setEnteredPin}
              style={styles.pinInput}
            />

            <View style={styles.modalButtonRow}>
              <Pressable onPress={() => setPinModalVisible(false)}>
                <Text style={[styles.modalCancelText, { borderColor: colors.text, color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (enteredPin === pin) {
                    setPinModalVisible(false);
                    setEnteredPin("");
                    router.push("/SWApage");
                  } else {
                    Alert.alert("Incorrect PIN");
                  }
                }}
              >
                <Text style={[styles.modalConfirmText, { borderColor: colors.text, color: colors.text }]}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewTile: {
    backgroundColor: "#FFF7F7",
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
    // height: 560,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
    // Drop Shadow/Elevation
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: Fonts.regular,
  },

  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "Black",
    backgroundColor: "white",
  },

  checkboxChecked: {
    backgroundColor: "green",
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },
  row: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1c1c1e",
    fontFamily: Fonts.regular,
  },

  dropdownValue: {
    fontSize: 14,
    color: "#6e6e73",
    fontFamily: Fonts.regular,
    fontWeight: "700",
  },

  dropdownOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },

  dropdownOptionText: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },

  button: {
    borderRadius: 8,
    width: 280,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  modalContainer: {
    width: 300,
    backgroundColor: "#FABFD7",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
    marginBottom: 12,
    color: "#1c1c1e",
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    marginBottom: 12,
    color: "#1c1c1e",
  },

  pinInput: {
    borderWidth: 1,
    borderColor: "#d1d1d6",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: Fonts.regular,
    backgroundColor: "#f0f0f0",
    opacity: 0.6,
  },

  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 15,
    marginLeft: 30,
    fontFamily: Fonts.medium,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 12,
    color: Colors.light.text,
    padding: 6,
    paddingHorizontal: 16,
  },

  modalConfirmText: {
    fontSize: 15,
    marginRight: 30,
    fontFamily: Fonts.medium,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.text,
    borderRadius: 12,
    padding: 6,
    paddingHorizontal: 30,
  },
});
