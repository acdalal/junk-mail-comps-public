import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useColorScheme } from "@/hooks/use-color-scheme";
import { loadOrders } from './utils/orderStorage';
import { itemsData } from '@/constants/products';

export default function Stats() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const router = useRouter();

  const [totalOrders, setTotalOrders] = useState(0);
  const [productCounts, setProductCounts] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const orders = await loadOrders();
      const currentYear = new Date().getFullYear();
      
      //filter orders for current year
      const yearOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === currentYear;
      });

      //set total orders
      setTotalOrders(yearOrders.length);

      //  product counts
      const counts: { [key: string]: number } = {};

      // Count products from orders
      yearOrders.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productName = item.name || item.product?.name;
            if (productName) {
              counts[productName] = (counts[productName] || 0) + (item.qty || 1);
            }
          });
        }
      });

      itemsData.forEach(product => {
        if (!(product.name in counts)) {
          counts[product.name] = 0;
        }
      });
      setProductCounts(counts);
      setLoading(false);
    } catch (error) {
      console.error('Error loading stats:', error);
      setLoading(false);
    }
  };


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* back button */}
    <Pressable 
      onPress={() => router.back()} 
      style={styles.backButtonTopRight}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      accessibilityHint="Returns to the previous screen"
    >
      <Ionicons
        name="chevron-back"
        size={40}
        color={colors.text}
      />
    </Pressable>

      <ThemedText
        type="title"
        style={[styles.screenTitle, { color: colors.text, fontFamily: Fonts.bold }]}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Statistics"
      >
        Stats
      </ThemedText>

      <ScrollView style={{ width: '100%' }} showsVerticalScrollIndicator={true}>
        <View style={{ padding: 20, marginBottom: 40 }}>
          
          {/* Total Orders */}
          <View style={styles.shadowWrapper}>
            <ThemedView style={[styles.card, { backgroundColor: colors.surface }]}>
              <ThemedText 
                type="subtitle" 
                style={[styles.cardTitle, { fontFamily: Fonts.semiBold }]}
              >
                Total Orders {new Date().getFullYear()}
              </ThemedText>
              <ThemedText
                style={[styles.totalNumber, { fontFamily: Fonts.bold, color: colors.primary }]}
              >
                {totalOrders}
              </ThemedText>
            </ThemedView>
          </View>

          {/* Product Counts */}
          <View style={styles.shadowWrapper}>
            <ThemedView style={[styles.card, { backgroundColor: colors.surface }]}>
              <ThemedText 
                type="subtitle" 
                style={[styles.cardTitle, { fontFamily: Fonts.semiBold }]}
              >
                Product Counts
              </ThemedText>
              {Object.entries(productCounts) .sort((a, b) => b[1] - a[1]).map(([productName, count]) => (

                <View key={productName} style={[styles.productRow, { borderBottomColor: colors.border }]}>
                  <ThemedText style={[styles.productName, { fontFamily: Fonts.regular }]}>
                    {productName}
                  </ThemedText>
                  <ThemedText style={[styles.productCount, { fontFamily: Fonts.semiBold }]}>
                    {count}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontSize: 45,
    textAlign: 'left',
    paddingTop: 75,
    paddingLeft: 20,
    lineHeight: 45,
  },
  backButtonTopRight: {
    position: 'absolute',
    top: 75,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
  },
  shadowWrapper: {
    marginHorizontal: 5,
    marginTop: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: 'transparent',
    borderRadius: 8,
    padding: 20,
    overflow: 'hidden',
    minHeight: 120,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  totalNumber: {
    fontSize: 48,
    textAlign: 'center',
    color: 'transparent',
    paddingVertical: 15,
    lineHeight: 40,
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  productName: {
    fontSize: 16,
    flex: 1,
  },
  productCount: {
    fontSize: 16,
    minWidth: 40,
    textAlign: 'right',
  },
});