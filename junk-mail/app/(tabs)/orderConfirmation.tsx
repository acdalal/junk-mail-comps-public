import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  LayoutAnimation,
  Pressable,
} from 'react-native';

import { ThemedText } from "@/components/themed-text";
import { getCurrentUser } from '@/app/utils/accountStorage';
import { Colors, Fonts } from '@/constants/theme';
import { Order, useOrder } from '@/context/orderContext';
import { Title } from "@/components/ui/title";
import { Image } from "expo-image";
import { useFocusEffect } from 'expo-router';
import { IconSymbol } from "@/components/ui/icon-symbol";
import { loadOrders } from "@/app/utils/orderStorage";
import React from 'react';

/* This is the order confirmation page, which displays after an order is placed. 
   The order information as well as info on how/when the order will be delivered
   is also displayed. */

export default function OrderConfirmationScreen() {
  const user = getCurrentUser();
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { order, clearOrder } = useOrder();
  const [orders, setOrders] = useState<any[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchOrders() {
        const loadedOrders = await loadOrders();
        setOrders(loadedOrders);
      }
      fetchOrders();
      return () => {
        clearOrder();
      };
    }, [clearOrder])
  );

  //flips the boxes between expanded state and unexpanded state, but maintains
  //the state of the box that was not pressed
  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Title style={{ lineHeight: 45 }}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Order Confirmation">Order Confirmation</Title>
      <ScrollView
        style={{ width: '100%', flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 60
        }}
      >
        <View style={styles.reviewTile}>
          <Image
            source={require('@/assets/images/junkmaillogobackground.png')}
            style={styles.JunkMailLogo}
            contentFit="contain"
            accessible={true}
            accessibilityLabel="Junk Mail logo"
            accessibilityRole="image"
          />
          <ThemedText style={[styles.description, { color: colors.text, fontFamily: Fonts.semiBold, fontSize: 20, fontWeight: "bold", paddingBottom: 20 }]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel="Thank you for your order!">
            Thank you for your order!
          </ThemedText>
          <ThemedText style={[styles.description, { color: colors.text, fontFamily: Fonts.regular, paddingBottom: 10 }]}
            accessible={true}
            accessibilityRole="text"
          >
            Orders are filled on a rolling basis. Each week, if you place your order by 12pm on Thursday,
            it will be ready for pickup by Friday at 5pm. Check your mailbox or turn on notifications in
            case your order is delivered early!
          </ThemedText>
        </View>
        <View style={styles.shadowWrapper}>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => toggle(order.id + '-summary')}
              style={styles.orderBox}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Order Summary"
              accessibilityHint={expanded[order.id + '-summary'] ? "Double tap to collapse" : "Double tap to expand"}
              accessibilityState={{ expanded: expanded[order.id + '-summary'] }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {/* Flips > symbol between > and v depending on toggle state*/}
                <IconSymbol name="chevron.right" size={14} color={colors.text} style={{ marginRight: 20, transform: [{ rotate: expanded[order.id + '-summary'] ? '90deg' : '0deg' }] }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, fontFamily: Fonts.semiBold }}>
                  Order Summary
                </Text>
              </View>
            </Pressable>
            {/*Logic for when the box is expanded*/}
            {expanded[order.id + '-summary'] && (
              <View
                style={styles.orderDetails}
                accessible={true}
                accessibilityRole="summary"
                accessibilityLabel={`Order contains ${Object.keys(order).length} items`}
              >
                {/*{orders.map((order) => (
                  <Text key={order.id}>
                    {order.notes}
                  </Text>
                ))}*/}
                {Object.entries(order).map(([key, value]) => (
                  <View
                    key={key}
                    style={{
                      flexDirection: 'row',
                      //justifyContent: 'space-between',
                      justifyContent: "flex-start",
                      gap: 20,
                      alignItems: 'flex-start',
                      paddingVertical: 10,
                      width: '90%',
                    }}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel={`${key}, quantity ${value}`}
                  >
                    <View style={styles.badgeContainer}>
                      <Text
                        style={styles.badgeText}
                      >
                        {value}
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
                        {key}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={styles.shadowWrapper}>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => toggle(order.id + '-delivery')}
              style={styles.orderBox}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Delivery Info"
              accessibilityHint={expanded[order.id + '-delivery'] ? "Double tap to collapse" : "Double tap to expand"}
              accessibilityState={{ expanded: expanded[order.id + '-delivery'] }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol name="chevron.right" size={14} color={colors.text} style={{ marginRight: 20, transform: [{ rotate: expanded[order.id + '-delivery'] ? '90deg' : '0deg' }] }} />
                <Text style={{ fontSize: 18, fontWeight: "600", color: colors.text, fontFamily: Fonts.semiBold }}>
                  Delivery Info
                </Text>
              </View>
            </Pressable>
            {expanded[order.id + '-delivery'] && (
              <View
                style={styles.orderDetails}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={`Delivery information for ${user?.displayName || "No Name Provided"}, email ${user?.email}`}
              >
                <View style={{ paddingHorizontal: 15, paddingVertical: 10 }}>
                  <Text style={{
                    fontFamily: Fonts.medium,
                    color: colors.text,
                    fontSize: 16,
                    marginBottom: 10
                  }}>
                    {user?.displayName || "No Name Provided"}
                  </Text>

                  <Text style={{
                    fontFamily: Fonts.regular,
                    color: colors.text,
                    fontSize: 16,
                  }}>
                    {user?.email}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  reviewTile: {
    backgroundColor: '#FFF7F7',
    marginTop: 15,
    marginBottom: 0,
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    // Drop Shadow/Elevation
    shadowColor: "black",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  JunkMailLogo: {
    height: 120,
    width: 120,
  },
  shadowWrapper: {
    marginHorizontal: 20,
    marginTop: 20,
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
});