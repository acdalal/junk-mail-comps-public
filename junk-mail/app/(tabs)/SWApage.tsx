import {
  LayoutAnimation,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Modal,
} from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";

import {
  clearOrders,
  loadCheckedOrders,
  loadOrders,
  saveCheckedOrder,
} from "@/app/utils/orderStorage";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors, Fonts } from "@/constants/theme";
import { Order } from "@/context/orderContext";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  sendDeliveryPushNotif,
  updateBellNotif,
} from "../utils/pushNotifications";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebaseConfig";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

/* This page is meant for use by the SWAs. All orders show up here, sorted by most
   recently placed. Each order contains the products ordered and the delivery info  
   via a dropdown. Once a SWA has fulfilled an order, they can check it off, causing
   the order to turn green and go to the bottom of the page. */

export default function OrderConfirmationScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];

  const [menuVisible, setMenuVisible] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(null);

  const [checkedOrders, setCheckedOrders] = useState<{
    [key: string]: boolean;
  }>({});

  const [deliveredBy, setDeliveredBy] = useState<{
    [key: string]: string;
  }>({});

  useFocusEffect(
    useCallback(() => {
      async function fetchOrders() {
        const loadedOrders = await loadOrders();
        setOrders(loadedOrders);

        const loadedCheckedOrders = await loadCheckedOrders();
        setCheckedOrders(loadedCheckedOrders);

        const deliveredByMap: { [key: string]: string } = {};
        loadedOrders.forEach((o: any) => {
          if (o?.deliveredBy) {
            deliveredByMap[o.id] = o.deliveredBy;
          }
        });
        setDeliveredBy(deliveredByMap);
      }

      fetchOrders();
      return () => {
        loadOrders().then(setOrders);
        loadCheckedOrders().then(setCheckedOrders);
      };
    }, []),
  );

  const toggle = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === id ? null : id));
  };

  const handleClear = async () => {
    setMenuVisible(false);
    Alert.alert(
      "Clear all orders",
      "Are you sure you want to clear all orders? You will not be able to recover them.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Clear All",
          style: "destructive", // red
          onPress: () => {
            clearOrders();
            setOrders([]);
          },
        },
      ],
      { cancelable: true },
    );
  };
  const handleStatsNavigation = () => {
    setMenuVisible(false);
    router.push("/stats");
  };

  const toggleCheck = async (id: any) => {
    Alert.alert(
      "Confirm Fulfillment",
      "Once you check off this order, the student will receive notification of its delivery.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            console.log("Button Pressed", id);

            const newValue = !checkedOrders[id];
            setCheckedOrders((prev) => ({
              ...prev,
              [id]: newValue,
            }));
            await saveCheckedOrder(id, newValue);

            // Gets the user ID of the user whose order is being delivered
            const order = orders.find((orderItem) => orderItem.id === id);
            if (!order) return;

            // Gets the first and last name of the user (SWA) fulfilling the order
            const swaUser = auth.currentUser;
            let deliveredByName = "Unknown";

            if (swaUser) {
              const swaDoc = await getDoc(doc(db, "users", swaUser.uid));
              const swaData = swaDoc.data();
              if (swaData?.firstName && swaData?.lastName) {
                deliveredByName = `${swaData.firstName} ${swaData.lastName}`;
              }
            }
            await updateDoc(doc(db, "orders", id), {
              status: "completed",
              deliveredBy: deliveredByName,
            });

            setDeliveredBy((prev) => ({
              ...prev,
              [id]: deliveredByName,
            }));

            // Gets the firestore doc of the user who placed the order that is being delivered
            const userDoc = await getDoc(
              doc(db, "users", order.userId.toString()),
            );
            const userData = userDoc.data();

            await updateBellNotif(order.userId.toString());
            // Only sends push notification if the user who placed the order has a push token AND has delivery notifications toggled ON
            if (
              userData?.expoPushToken &&
              userData?.deliveryNotificationsEnabled
            ) {
              await sendDeliveryPushNotif(
                userData.expoPushToken.toString(),
                order.id.toString(),
              );

              console.log(`Push notification sent for order ${order.id}`);
            } else {
              console.log(
                "No push token found for user OR delivery notifications OFF, skipping notification.",
              );
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const aIsChecked = !!checkedOrders[a.id];
    const bIsChecked = !!checkedOrders[b.id];

    if (aIsChecked && !bIsChecked) {
      return 1;
    }

    if (!aIsChecked && bIsChecked) {
      return -1;
    }

    return 0;
  });

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: 20,
          paddingTop: 20,
        }}
      >
        <ThemedText
          type="title"
          style={[
            styles.screenTitle,
            { color: colors.text, fontFamily: Fonts.bold },
          ]}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Orders"
        >
          Orders
        </ThemedText>
        {/* menu button */}
        <Pressable
          onPress={() => setMenuVisible(true)}
          style={styles.hamburgerButton}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu" size={28} color={colors.text} />
        </Pressable>
      </View>
      {/* menu modal */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={[styles.menuContainer, { backgroundColor: colors.surface }]}>
            <Pressable
              onPress={handleStatsNavigation}
              style={styles.menuItem}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="View statistics"
            >
              <Ionicons name="bar-chart" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Stats
              </Text>
            </Pressable>

            <View style={styles.menuDivider} />

            <Pressable
              onPress={handleClear}
              style={styles.menuItem}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Clear all orders"
            >
              <Ionicons name="close-circle" size={24} color={colors.text} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Clear All Orders
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true}>
        <View style={{ padding: 20, marginBottom: 40 }}>
          {sortedOrders.map((order, index) => (
            <View key={order.id}>
              <View style={styles.shadowWrapper}>
                <View style={[styles.sectionContainer, { backgroundColor: colors.surface }]}>
                  <Pressable
                    onPress={() => toggle(order.id)}
                    style={[
                      styles.orderBox,
                      { backgroundColor: colors.surface },
                      checkedOrders[order.id] && styles.orderBoxChecked,
                    ]}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Ionicons
                        name="chevron-forward"
                        size={14}
                        color={colors.text}
                        style={{
                          marginRight: 20,
                          transform: [
                            {
                              rotate: expanded === order.id ? "90deg" : "0deg",
                            },
                          ],
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "600",
                          color: colors.text,
                          fontFamily: Fonts.semiBold,
                          marginRight: 5,
                        }}
                      >
                        {order.userName
                          ? String(order.userName).trim().split(" ").pop()
                          : "???"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "400",
                          color: colors.text,
                          fontFamily: Fonts.medium,
                        }}
                      >
                        •{" "}
                        {new Date(order.createdAt).toLocaleDateString(
                          undefined,
                          {
                            month: "numeric",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          },
                        )}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => toggleCheck(order.id)}
                      disabled={checkedOrders[order.id]}
                      hitSlop={15}
                      style={[
                        styles.checkboxBase,
                        checkedOrders[order.id] && styles.checkboxChecked,
                      ]}
                    >
                      {checkedOrders[order.id] && (
                        <IconSymbol name="checkmark" size={12} color="white" />
                      )}
                    </Pressable>
                  </Pressable>

                  {expanded === order.id && (
                    <View style={[styles.orderDetails, { backgroundColor: colors.container }]}>
                      <View>
                        <Text
                          style={{
                            fontFamily: Fonts.semiBold,
                            color: colors.text,
                          }}
                          accessibilityRole="text"
                          accessibilityLabel={`Deliver to: ${order.userName}, ${order.userEmail}`}
                        >
                          Deliver to:
                        </Text>
                        <Text
                          style={{
                            marginTop: 6,
                            color: colors.text,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {order.userName}
                        </Text>
                        <Text
                          style={{
                            color: colors.text,
                            fontFamily: Fonts.regular,
                          }}
                        >
                          {order.userEmail}
                        </Text>
                        {(checkedOrders[order.id] ||
                          order.status === "completed") &&
                          (deliveredBy[order.id] || order.deliveredBy) && (
                            <Text
                              style={{
                                marginTop: 8,
                                fontFamily: Fonts.semiBold,
                                color: colors.text,
                              }}
                            >
                              Order delivered by: {deliveredBy[order.id]}
                            </Text>
                          )}
                        <Text
                          style={{
                            fontFamily: Fonts.semiBold,
                            marginTop: 8,
                            marginBottom: 6,
                            color: colors.text,
                          }}
                          accessible={true}
                          accessibilityRole="header"
                          accessibilityLabel="Order items"
                        >
                          Order:
                        </Text>
                      </View>
                      <View style={[styles.tableContainer, { backgroundColor: colors.surface }]}>
                        <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: colors.primary }]}>
                          <Text
                            style={[
                              styles.tableCell,
                              styles.tableHeaderText,
                              { flex: 2, color: colors.buttonText },
                            ]}
                          >
                            Item
                          </Text>
                          <Text
                            style={[
                              styles.tableCell,
                              styles.tableHeaderText,
                              { flex: 1, textAlign: "center", color: colors.buttonText },
                            ]}
                          >
                            Quantity
                          </Text>
                        </View>
                        {Object.entries(order.items).map(([key, value]) => (
                          <View key={key} style={styles.tableRow}>
                            <Text style={[styles.tableCell, { flex: 2 }]}>
                              {value.name}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                { flex: 1, textAlign: "center" },
                              ]}
                            >
                              {value.qty}
                            </Text>
                          </View>
                        ))}
                      </View>
                      {!!order.notes && (
                        <View>
                          <Text
                            style={{
                              fontFamily: Fonts.semiBold,
                              marginTop: 8,
                              marginBottom: 6,
                              color: colors.text,
                            }}
                            accessible={true}
                            accessibilityRole="header"
                            accessibilityLabel="Order notes"
                          >
                            Notes:
                          </Text>
                          <Text
                            style={{
                              fontFamily: Fonts.regular,
                              color: colors.text,
                            }}
                          >
                            {order.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
    height: 50,
  },

  filterButton: {
    backgroundColor: "#324D7F",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  filterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF7F7",
  },

  reviewTile: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 15,
    marginBottom: 115,
    marginLeft: 20,
    marginRight: 20,
    height: 200,
    alignItems: "center",
    paddingVertical: 10,
    // Drop Shadow/Elevation
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  tile: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 10,
    height: 200,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    // Drop Shadow/Elevation
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  itemText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: Fonts.bold,
  },

  addButton: {
    backgroundColor: "#324D7F",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  addButtonText: {
    color: "#FFF7F7",
  },

  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "black",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  counterButton: {
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  counterSymbol: {
    fontSize: 18,
    color: "black",
    fontFamily: Fonts.bold,
  },
  counter: {
    color: "white",
    fontSize: 18,
    fontFamily: Fonts.bold,
    marginHorizontal: 8,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "transparent",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },

  JunkMailLogo: {
    height: 100,
    width: 100,
  },
  title: {
    fontSize: 30,
    fontFamily: Fonts.bold,
    textAlign: "center",
    marginTop: -10,
  },
  screenTitle: {
    fontSize: 45,
    fontFamily: Fonts.bold,
    textAlign: "left",
    paddingTop: 75,
    paddingLeft: 20,
    lineHeight: 45,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    fontFamily: Fonts.bold,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
    fontFamily: Fonts.bold,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  contentContainer: {
    paddingBottom: 115,
  },
  dottedLine: {
    width: "90%",
    alignSelf: "center",
    marginVertical: 16,
    height: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.light.text,
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  shadowWrapper: {
    marginHorizontal: 5,
    marginTop: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: "transparent",
  },
  sectionContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    overflow: "hidden",
  },
  orderBox: {
    backgroundColor: 'transparent',
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderDetails: {
    backgroundColor: 'transparent',
    padding: 14,
  },

  orderBoxChecked: {
    backgroundColor: "#cfffd3ff",
  },

  arrowUntoggled: {
    marginTop: 5,
    paddingRight: 40,
    transform: [{ rotate: "0deg" }],
  },

  arrowToggled: {
    transform: [{ rotate: "45deg" }],
  },
  hamburgerButton: {
    paddingTop: 75,
    paddingRight: 10,
    padding: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  menuContainer: {
    backgroundColor: 'transparent',
    marginTop: 120,
    marginRight: 20,
    borderRadius: 12,
    padding: 8,
    minWidth: 220,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 12,
  },

  menuItemText: {
    fontSize: 16,
    fontFamily: Fonts.semiBold,
  },

  menuDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 8,
  },
  tableContainer: {
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#ebebebff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  tableHeader: {
    backgroundColor: 'transparent',
  },
  tableHeaderText: {
    fontFamily: Fonts.semiBold,
    color: 'transparent',
    textAlign: "left",
  },
  tableCell: {
    fontSize: 14,
    fontFamily: Fonts.regular,
  },
});
