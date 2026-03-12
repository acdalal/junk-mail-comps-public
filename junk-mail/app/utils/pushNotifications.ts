import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/app/utils/firebaseConfig";

/*
A good amount of code was sourced from Expo's official 'Expo push notifications setup'
https://docs.expo.dev/push-notifications/push-notifications-setup/
*/

// Registers user's device for push notifications & saves their Expo push token to Firestore
export async function registerPushNotifications() {
  if (!Device.isDevice) return null;

  /*
  Android Only:
  Controls how notifications appear on Android (sound/vibration)
  Without a channel for android notifications, notifications may be silent or not show
  */
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") return null;

  // This retrieves the EAS projectId from app.json
  // This makes sure that the Expo push token is linked to the right project (Required for EAS builds, optional in Expo Go)
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  const token = (
    await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined,
    )
  ).data;

  const user = auth.currentUser;

  if (!user) return token;

  await updateDoc(doc(db, "users", user.uid), {
    expoPushToken: token,
  });
  console.log(`Push token ${token} successfully saved to Firestore`);
  return token;
}

export async function sendDeliveryPushNotif(
  expoPushToken: string,
  orderId: string,
) {
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      to: expoPushToken,
      title: "Order Delivered 🚚",
      body: `Your Junk Mail order #${orderId.slice(-5)} has been delivered!`,
      sound: "default",
    }),
  });
}

// Update the notification visibility for the relevant user
export async function updateBellNotif(userId: string) {
  console.log("Notif: true");
  await updateDoc(doc(db, "users", userId), {
    notif: true,
  });
}
