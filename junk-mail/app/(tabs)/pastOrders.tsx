import { useState, useCallback } from "react";
import {
  ScrollView, StyleSheet, Text, useColorScheme, View, LayoutAnimation, Pressable,
} from "react-native";

import { getCurrentUser } from "@/app/utils/accountStorage";
import { loadOrders } from "@/app/utils/orderStorage";
import { Title } from "@/components/ui/title";
import { Colors, Fonts } from "@/constants/theme";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/app/utils/firebaseConfig";
import { useFocusEffect } from "expo-router";

interface OrderItem {
  name: string;
  qty: number;
}
/* Displays past orders for the currently logged-in user */
export default function PastOrders() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<any[]>([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveOrdersEnabled, setSaveOrdersEnabled] = useState<boolean | null>(null);
  const [showReadyMessage, setShowReadyMessage] = useState(false);
  const router = useRouter();
  const [mostRecentCompletedOrder, setMostRecentCompletedOrder] = useState<any | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchOrders() {
        setLoading(true);

        try {
          const saveOrdersPref = await AsyncStorage.getItem("saveOrdersEnabled");
          const enabled = saveOrdersPref ? JSON.parse(saveOrdersPref) : false;

          if (!isActive) return;
          setSaveOrdersEnabled(enabled);

          console.log("Save orders enabled:", enabled);

          if (!enabled) {
            setGroupedOrders([]);
            return;
          }

          const user = getCurrentUser();
          if (!user) {
            setAllOrders([]);
            setGroupedOrders([]);
            setMostRecentCompletedOrder(null);
            return;
          }

          const orders = await loadOrders();
          if (!isActive) return;

          const userOrders = orders.filter(
            (order: any) => order.userId === user.uid
          );

          const sortedOrders = [...userOrders].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

          setAllOrders(sortedOrders)

          const completedOrder = sortedOrders.find(
            (order) => order.status === "completed"
          );
          setMostRecentCompletedOrder (completedOrder ?? null)

          setGroupedOrders(enabled ? sortedOrders : []);
        } catch (err) {
          console.error("Failed to load user's orders", err);
        } finally {
          if (isActive) setLoading(false);
        }
      }

      fetchOrders();

      return () => {
        isActive = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkNotification = async () => {
  const user = auth.currentUser;
  if (!user) {
    if (isActive) setShowReadyMessage(false);
    return;
  }

  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      if (isActive) setShowReadyMessage(false);
      return;
    }

    const userData = userDoc.data();
    const notif = userData?.notif;

    if (!notif) {
      if (isActive) setShowReadyMessage(false);
      return;
    }

    if (notif) {
      setShowReadyMessage(true);
      // Clear the notif bell flag
      await updateDoc(doc(db, "users", user.uid), {
        notif: null,
      });
    } else {
      setShowReadyMessage(false);
      // Also clear if its expired
      await updateDoc(doc(db, "users", user.uid), {
        notif: null,
      });
    }
  } catch (error) {
    console.error("Error checking notification:", error);
    if (isActive) setShowReadyMessage(false);
  }
};

      checkNotification();

      return () => {
        isActive = false;
      };
    }, [])
  );



  const toggle = (id: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => (prev === id ? null : id));
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}
        accessible={true}
        accessibilityLabel="Loading past orders"
        accessibilityRole="none">
      </View>
    )
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Title
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Past Orders"
      >Past Orders</Title>

      {groupedOrders.length === 0 ? (
        <View style={styles.placeholderContainer}>
          {saveOrdersEnabled === false &&
          mostRecentCompletedOrder ? (
            <Text style={styles.placeholderText}>
              Your most recent order placed on{" "}
              {new Date(
                mostRecentCompletedOrder.createdAt
              ).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              has been filled.
            </Text>
          ) : (
          <Text style={styles.placeholderText}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel="You do not have any past orders. You either have the Save Orders setting turned off or have not placed an order yet.">You do not have any past orders. You either have the Save Orders setting turned off or have not placed an order yet. </Text>
          )}
        </View>
      ) : (
        <ScrollView
          style={{ width: '100%' }}
          showsVerticalScrollIndicator={true}
          accessible={false}
          accessibilityLabel={`${groupedOrders.length} past orders`}
        >
          <View style={{ padding: 20, marginBottom: 120 }}>
            {groupedOrders.map((order) => {
              const isDelivered = order.status === "completed";

              return (
              <View key={order.id}>
                <View style={styles.shadowWrapper}>
                  <View style={styles.sectionContainer}>
                    <Pressable
                      onPress={() => toggle(order.id)}
                      style={styles.orderBox}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconSymbol name="chevron.right" size={14} color={colors.text} style={{ marginRight: 20, transform: [{ rotate: expanded === order.id ? '90deg' : '0deg' }] }} />
                        <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, fontFamily: Fonts.semiBold }}>
                          {new Date(order.createdAt).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </Text>
                      </View>

                      {/* Shows delivered on date when order filled*/}
                      {isDelivered && (
                        <Text style={styles.deliveredText}>
                          Delivered {""}
                          {new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            {month: "short",
                            day: "numeric",}
                          )}
                        </Text>
                      )}
                    </Pressable>

                    {expanded === order.id && (
                      <View
                        style={styles.orderDetails}
                      >
                        {(Object.entries(order.items) as [string, OrderItem][]).map(([key, value]) => (
                          <View
                            key={key}
                            style={{
                              flexDirection: 'row',
                              justifyContent: "flex-start",
                              gap: 20,
                              alignItems: 'center',
                              paddingVertical: 10,
                              width: '90%',
                            }}
                            accessible={true}
                            accessibilityRole="text"
                            accessibilityLabel={`${value.name}, quantity ${value.qty}`}
                          >
                            <View style={styles.badgeContainer}>
                              <Text
                                style={styles.badgeText}
                              >
                                {value.qty}
                              </Text>
                            </View>
                            <View
                              style={{
                                alignItems: 'flex-start',
                                flexShrink: 1,
                                flexGrow: 1,
                                flexWrap: 'wrap',
                                maxWidth: '60%',
                              }}
                            >
                              <Text
                                style={{
                                  paddingLeft: 15,
                                  fontSize: 16,
                                  fontFamily: Fonts.medium,
                                }}
                              >
                                {value.name}
                              </Text>
                            </View>
                          </View>
                        ))}
                        <View style={{ paddingLeft: 25, paddingRight: 25 }}>
                          <PrimaryButton
                            icon="cart.badge.plus"
                            title="Add To Cart"
                            onPress={() => router.push({
                              pathname: "/reviewOrder",
                              params: { orderToReorder: JSON.stringify(order) }
                            })}
                            accessible={true}
                            accessibilityLabel="Add To Cart"
                            accessibilityHint="Reorder this past order by adding all items to your cart"
                          >
                          </PrimaryButton>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              );
            })}
            <View>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  date: {
    marginTop: 20,
    fontFamily: Fonts.bold,
  },
  item: {
    marginLeft: 10,
  },
  placeholderContainer: {
    width: '90%',
    backgroundColor: '#ebebebff',
    padding: 14,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 20,
    marginBottom: 115,
    margin: 20,
    justifyContent: "center",
  },
  placeholderText: {
    marginLeft: 15,
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  shadowWrapper: {
    marginHorizontal: 5,
    marginTop: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  sectionContainer: {
    backgroundColor: '#FFF7F7',
    borderRadius: 8,
    overflow: 'hidden',
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 30,
  },
  orderBox: {
    backgroundColor: '#FFF7F7',
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  orderDetails: {
    backgroundColor: '#ebebebff',
    padding: 14,
  },
  badgeContainer: {
    backgroundColor: "#e27396",
    borderRadius: 15,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  badgeText: {
    color: "#FFF7F7",
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  readyContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 20
  },
    deliveredText: {
    fontSize: 14,
    color: "#999",
    fontFamily: Fonts.medium,
  },
});