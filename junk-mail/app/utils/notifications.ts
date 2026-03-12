import * as Notifications from "expo-notifications";

/* This function asks the user if they want to allow notifications from the junk mail app */
export async function allowNotificationsCheck() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/* This function schedules a reminder based on the user's frequency choice */
export async function scheduleReminder(
  frequency: "Daily" | "Weekly" | "Biweekly" | "Monthly" | "Never"
) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (frequency === "Never") {
    console.log("Reminder is turned off. No notifications scheduled.");
    return;
  }

  let seconds = 0;

  switch (frequency) {
    case "Daily":
      seconds = 10; // testing
      // seconds = 24 * 3600; // actual
      break;
    case "Weekly":
      seconds = 15; // testing
      // seconds = 7 * 24 * 3600; // actual
      break;
    case "Biweekly":
      seconds = 20; // testing
      // seconds = 14 * 24 * 3600; // actual
      break;
    case "Monthly":
      seconds = 25; // testing
      // seconds = 30 * 24 * 3600; // actual
      break;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Reminder",
      body: "Don't forget to place your order!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false, // Needs to be false for testint because can't have repeats true when
                    // seconds <60s (OS issue)
    },
  });

  console.log(`Reminder scheduled (${frequency}) every ${seconds} seconds`);
}
