import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  View
} from 'react-native';
import { useColorScheme } from "@/hooks/use-color-scheme";

import { getCurrentUser } from '@/app/utils/accountStorage';
import { saveOrder } from "@/app/utils/orderStorage";
import { ThemedText } from "@/components/themed-text";
import { AddToCart } from "@/components/ui/add-to-cart";
import { PrimaryButton } from '@/components/ui/primaryButton';
import { Title } from "@/components/ui/title";
import { DEFAULT_LIMIT, itemLimits } from "@/constants/products";
import { Colors, Fonts } from '@/constants/theme';
import { Order, useOrder } from "@/context/orderContext";
import { Ionicons } from '@expo/vector-icons';
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from 'react';

// /* This is the review order page where the user can see all of the items they
//    added to their cart before placing their order. This page also allows them 
//    to confirm their information (name, email). */

export default function ReviewOrderScreen() {
  const user = getCurrentUser();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { order, updateOrdercount, removeItem, updateOrder } = useOrder();
  const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(false);
  const { orderToReorder } = useLocalSearchParams();
  const [text, setText] = useState("");

  useEffect(() => {
    if (orderToReorder) {
      const orderData = typeof orderToReorder === 'string' ? JSON.parse(orderToReorder) : orderToReorder;
      const translatedOrderData: Order = orderData.items.reduce((accumulator: Order, item: any) => {
        accumulator[item.name] = item.qty;
        return accumulator;
      }, {} as Order);
      updateOrder(translatedOrderData);
    }
  }, [orderToReorder]);

  const updateCount = (item: string, delta: number) => {
    const limit = itemLimits[item] || DEFAULT_LIMIT;
    const current = order[item] || 0;
    const newCount = current + delta;
    if (newCount <= 0) {
      removeItem(item);
    }
    else if (newCount > limit) {
      return;
    }
    else {
      updateOrdercount(item, newCount);
    }
  };

  const isOrderEmpty = () => {
    if (Object.keys(order).length == 0) {
      return true;
    } else {
      return false;
    }
  };

  const saveSubmit = async () => {
    if (isOrderEmpty()) return;

    const formattedItems = Object.entries(order).map(([name, qty]) => ({
      name,
      qty,
    }));

    await saveOrder({
      // firebase generates id
      timestamp: Date.now(),
      items: formattedItems,
      notes: text,
    });
  };

  useEffect(() => {
    setIsSubmitButtonDisabled(isOrderEmpty());
  });

  return (
    <ScrollView style={{ backgroundColor: colors.background, flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Title
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Review Order"
        >Review Order</Title>
        <View style={[styles.reviewTile, { backgroundColor: colors.surface }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}>
            <Link href="/placeOrder" asChild>
              <Pressable
                style={styles.addMoreButton}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Add more to cart"
                accessibilityHint="Returns to product page to add more items">
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
                    flexWrap: 'wrap',
                  }}
                >
                  <ThemedText style={{ fontSize: 16, fontFamily: Fonts.regular }}>
                    Add more to cart
                  </ThemedText>
                </View>
              </Pressable>
            </Link>
          </View>
          <ScrollView
            style={{ width: '100%', maxHeight: 300 }}
            contentContainerStyle={{ alignItems: 'center' }}
          >
            {Object.entries(order).map(([item, qty]) => (
              <View key={item} style={[styles.orderContainer, { backgroundColor: colors.container }]}>
                <View style={styles.orderRow}>
                  <View style={styles.itemLabelRow}>
                    <Pressable onPress={() => removeItem(item)}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${item} from cart`}
                      accessibilityHint="Double tap to delete this item from your order">
                      <View>
                        <Ionicons name="trash" size={26} color="red" />
                      </View>
                    </Pressable>
                    <Text
                      style={styles.orderItemText}
                      numberOfLines={2}
                      accessible={true}
                      accessibilityRole="text"
                      accessibilityLabel={item}
                    >
                      {item}
                    </Text>
                  </View>

                  <View style={{ transform: [{ scale: 0.8 }] }}>
                    <AddToCart
                      itemName={item}
                      count={qty}
                      limit={itemLimits[item] || DEFAULT_LIMIT}
                      isInCart={true}
                      onAdd={() => { }}
                      onIncrement={() => updateCount(item, +1)}
                      onDecrement={() => updateCount(item, -1)}
                      size="small"
                    />
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
        {/*<View style={styles.notesTitleBox}>*/}
          <View>
          {/* <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, fontFamily: Fonts.bold, }}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Delivery Info">
            Optional Notes
          </Text> */}
          <TextInput
            style={[styles.notesBox, { backgroundColor: colors.container }]}
            multiline
            placeholder="Add an optional note..."
            placeholderTextColor={colors.text}
            value={text}
            onChangeText={newText => setText(newText)}>
          </TextInput>
        </View>
        <View style={[styles.deliveryBox, { backgroundColor: colors.container }]}>
          <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 10, fontFamily: Fonts.bold, }}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Delivery Info">
            Delivery Info
          </Text>

          <View style={{ paddingLeft: 5 }}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Delivering to ${user?.displayName || "No Name Provided"}, ${user?.email}`}
          >
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 6, fontFamily: Fonts.regular }}>
              {user?.displayName || "No Name Provided"}
            </Text>

            <Text style={{ fontSize: 16, fontFamily: Fonts.regular }}>
              {user?.email}
            </Text>
          </View>
        </View>

        <View style={styles.bottomButtonContainer}>
          <Link
            href="./orderConfirmation"
            asChild
            onPress={(e) => {
              if (isOrderEmpty()) {
                e.preventDefault();
                return;
              }
              saveSubmit();
            }}
          >
            <PrimaryButton
              icon="checkmark.circle"
              title="Submit"
              onPress={() => setText("")}
              disabled={isOrderEmpty()}
              accessible={true}
              accessibilityLabel="Submit Order"
              accessibilityState={{ disabled: isOrderEmpty() }}
            />
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'flex-start',
  },
  reviewTile: {
    flex: 1,
    backgroundColor: 'transparent',
    margin: 20,
    marginBottom: 5,
    borderRadius: 8,
    paddingVertical: 10,
    // drop shadow
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  orderContainer: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    width: '90%',
    marginVertical: 6,
    padding: 10,
  },
  orderItems: {
    flexDirection: 'row',
    flexShrink: 1,
    flexGrow: 1,
    flexWrap: 'wrap',
    maxWidth: '60%',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingLeft: 5,
  },
  orderItemText: {
    fontSize: 16,
    flex: 1,
    paddingLeft: 10,
    textAlign: "center",
    fontFamily: Fonts.regular,
  },
  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: 'center',
  },
  deliveryBox: {
    width: '90%',
    backgroundColor: 'transparent',
    padding: 14,
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 4,
    marginBottom: 115,
    margin: 20,
    justifyContent: "center",
  },
  notesBox: {
    backgroundColor: 'transparent',
    height: 65,
    marginTop: 10,
    marginBottom: 10,
    margin: 20,
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    fontFamily: Fonts.regular,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  notesTitleBox: {
   flex: 1,
    backgroundColor: '#FFF7F7',
    margin: 20,
    borderRadius: 8,
    paddingVertical: 10,
    // drop shadow
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});