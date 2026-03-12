import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Modal,
  Linking,
} from "react-native";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Title } from "@/components/ui/title";
import { PrimaryButton } from "@/components/ui/primaryButton";
import { AddToCart } from "@/components/ui/add-to-cart";
import { Colors, Fonts, Styles } from "@/constants/theme";
import { useOrder } from "@/context/orderContext";
import { itemsData, itemLimits, DEFAULT_LIMIT } from "@/constants/products";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import React from "react";

/* This is the Place Order page. On this page, the user can add products to
their cart. They can also increase or decrease the quantity of items in their cart 
and filter by category of reproductive and sexual health supplies. */

const MakeTile = React.memo(
  ({
    item,
    colors,
    renderAddToCartButton,
    openProductModal,
  }: {
    item: { name: string; image: any; category: string, alt: string};
    colors: any;
    renderAddToCartButton: Function;
    openProductModal: Function;
  }) => (
    <View style={styles.tile}>
      <View style={styles.tileDetails}>
        <Text style={styles.itemText} numberOfLines={undefined}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={item.name}>
          {item.name}
        </Text>
        <Pressable
          style={styles.infoButton}
          onPress={() => openProductModal(item)}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`Product information for ${item.name}`}
          accessibilityHint="Double tap to view product details"
        >
          <IconSymbol name="info.circle" size={28} color={colors.text} />
        </Pressable>
      </View>

      <Image
        source={item.image}
        style={styles.itemImage}
        contentFit="contain"
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={item.alt}
      />
      {renderAddToCartButton(item.name, "medium")}
    </View>
  ),
);
export default function PlaceOrderScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const colors = Colors[colorScheme];
  const router = useRouter();

  const { order, addItem, updateOrdercount } = useOrder();
  const totalItems = Object.values(order).reduce(
    (sum, count) => sum + count,
    0,
  );
  const [flippedItems, setFlippedItems] = useState<{ [key: string]: boolean }>(
    {},
  );

  //for info button
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setFlippedItems((prev) => {
      let changed = false;
      const next = { ...prev };

      // Make sure the quantity of every product in the current order 
      // is reflected in the +/- button (context: just added an order to cart from Past Orders)
      Object.keys(order).forEach((item) => {
        if (order[item] > 0 && !prev[item]) {
          next[item] = true;
          changed = true;
        }
      });

      // Make sure every product that is not in the current order renders
      // as "unflipped" (Add To Cart) in the +/- button
      Object.keys(prev).forEach((item) => {
        if (!order[item] || order[item] <= 0) {
          next[item] = false;
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [order]);

  const [selectedCategory, setSelectedCategory] = useState("All");

  const toggleFlip = useCallback(
    (item: string) => {
      setFlippedItems((prev) => {
        const nextFlip = !prev[item];
        if (nextFlip && !order[item]) {
          addItem(item);
        }
        return { ...prev, [item]: nextFlip };
      });
    },
    [order, addItem],
  );

  // Update the item count when the +/- button is clicked
  const handleCountChange = useCallback(
    (item: string, delta: number) => {
      const limit = itemLimits[item] || DEFAULT_LIMIT;
      const currentCount = order[item] || 0;
      const newCount = currentCount + delta;

      if (newCount <= 0) {
        setFlippedItems((flipPrev) => ({ ...flipPrev, [item]: false }));
        updateOrdercount(item, 0);
        return;
      }

      if (newCount > limit) return;
      updateOrdercount(item, newCount);
    },
    [order, updateOrdercount],
  );

  const openProductModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  //add to cart button for popup
  const renderAddToCartButton = useCallback(
    (item: string, size: "small" | "medium" | "large" = "medium") => {
      const isFlipped = flippedItems[item];
      const count = order[item] || 0;
      const limit = itemLimits[item] || DEFAULT_LIMIT;

      return (
        <AddToCart
          itemName={item}
          count={count}
          limit={limit}
          isInCart={isFlipped}
          onAdd={() => toggleFlip(item)}
          onIncrement={() => handleCountChange(item, +1)}
          onDecrement={() => handleCountChange(item, -1)}
          size={size}
        />
      );
    },
    [flippedItems, order, toggleFlip, handleCountChange],
  );

  const filteredItems =
    selectedCategory === "All"
      ? itemsData
      : itemsData.filter((item) => item.category === selectedCategory);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Title
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Place Order">Place Order</Title>

        <Link href="/reviewOrder" asChild>
          <Pressable
            style={{
              paddingTop: 90,
              paddingRight: 20,
              flexDirection: "row",
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`Shopping cart, ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
            accessibilityHint="Double tap to review your order"
          >
            <IconSymbol name="cart" size={38} color={colors.text} />
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          </Pressable>
        </Link>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
        bounces={false}
        directionalLockEnabled={true}
        style={{ height: 70, flexGrow: 0, flexShrink: 0 }}
      >
        {["All", "Menstrual", "Safer Sex", "Emergency Contraception"].map(
          (category) => (
            <Pressable
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                Styles.filterButton,
                selectedCategory === category && Styles.selectedFilterButton,
              ]}
            >
              <Text
                style={[
                  Styles.filterButtonText,
                  selectedCategory === category &&
                    Styles.selectedFilterButtonText,
                ]}
              >
                {category}
              </Text>
            </Pressable>
          ),
        )}
      </ScrollView>

      <FlatList
        // Renders each tile based on the title and image associated with each product
        data={filteredItems}
        renderItem={({ item }) => (
          <MakeTile
            item={item}
            colors={colors}
            renderAddToCartButton={renderAddToCartButton}
            openProductModal={openProductModal}
          />
        )}
        keyExtractor={(item) => item.name}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 115,
          justifyContent: "flex-start",
        }}
        columnWrapperStyle={{ justifyContent: "flex-start" }}
        style={{ backgroundColor: colors.background }}
      />

      <View style={styles.bottomButtonContainer}>
        <PrimaryButton
          icon="list.clipboard"
          title="Review"
          onPress={() => router.push("/reviewOrder")}
          accessible={true}
          accessibilityLabel="Review Order"
          accessibilityHint={`Review your cart with ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        accessible={true}
        accessibilityViewIsModal={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedItem && (
                <>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}
                      accessible={true}
                      accessibilityRole="header"
                      accessibilityLabel={`Product details for ${selectedItem.name}`}
                    >{selectedItem.name}</Text>
                    <Pressable
                      onPress={() => setModalVisible(false)}
                      style={styles.closeButton}
                      accessible={true}
                      accessibilityRole="button"
                      accessibilityLabel="Close product details"
                      accessibilityHint="Double tap to close this modal"
                    >
                      <IconSymbol
                        name="xmark.circle.fill"
                        size={30}
                        color="#1E325C"
                      />
                    </Pressable>
                  </View>

                  <View style={styles.modalImageContainer}>
                    <Image
                      source={selectedItem.image}
                      style={styles.modalImage}
                      contentFit="contain"
                      accessible={true}
                      accessibilityRole="image"
                      accessibilityLabel={selectedItem.alt}
                    />
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}
                      accessible={true}
                      accessibilityRole="header"
                      accessibilityLabel="Product Details">
                      Product Details
                    </Text>
                    {selectedItem.specs &&
                      selectedItem.specs.map((spec: string, index: number) => {
                        //check if spec contains a link
                        const linkMatch = spec.match(/\[([^\]]+)\]\(([^)]+)\)/);

                        if (linkMatch) {
                          const [fullMatch, linkText, url] = linkMatch;
                          const parts = spec.split(fullMatch);

                          return (
                            <View key={index} style={styles.specItem}>
                              <Text style={styles.specBullet}>•</Text>
                              <Text style={styles.specText}>
                                {parts[0]}
                                <Text
                                  style={styles.linkText}
                                  onPress={() => Linking.openURL(url)}
                                  accessible={true}
                                  accessibilityRole="link"
                                  accessibilityLabel={`Link: ${linkText}`}
                                  accessibilityHint="Double tap to open in browser"
                                >
                                  {linkText}
                                </Text>
                                {parts[1]}
                              </Text>
                            </View>
                          );
                        }

                        return (
                          <View key={index} style={styles.specItem}
                              accessible={true}
                              accessibilityRole="text"
                              accessibilityLabel={spec} >
                            <Text style={styles.specBullet}>•</Text>
                            <Text style={styles.specText}>{spec}</Text>
                          </View>
                        );
                      })}
                  </View>
                </>
              )}
            </ScrollView>

            {/*add to cart*/}
            <View style={styles.modalButtonSection}>
              {selectedItem &&
                renderAddToCartButton(selectedItem.name, "large")}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Defines style sheets for each component on the page
const styles = StyleSheet.create({
  filterBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: "center",
    height: 60,
  },
  tileDetails: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingVertical: 4,
    paddingLeft: "5%",
    paddingRight: 8,
    width: "100%",
    height:50,
  },
  itemText: {
    fontSize: 16,
    textAlign: "left",
    fontFamily: Fonts.medium,
    flex: 1,
    flexWrap: "wrap",
    paddingHorizontal: 1,
    paddingRight: 8,
    maxWidth: "80%",
    lineHeight: 20,
  },
    tile: {
    borderRadius: 8,
    width:'45%',
    backgroundColor: "#FFF7F7",
    margin: 10,
    alignItems: "center",
    paddingVertical: 8,
  },
  itemImage: {
    width: "90%",
    height: 140,
    marginTop: 4,
    marginBottom: 10,
  },

  bottomButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 20,
    alignItems: "center",
  },
  infoButton: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 6,
    marginTop: -4,
    flexShrink: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF7F7",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1E325C",
    fontFamily: Fonts.bold,
    flex: 1,
    paddingRight: 10,
  },
  closeButton: {
    padding: 4,
  },
  categoryText: {
    color: "#FFF7F7",
    fontSize: 12,
    fontWeight: "600",
    fontFamily:Fonts.regular,
  },
  modalImageContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalImage: {
    width: "100%",
    height: 200,
    maxWidth: 300,
  },
  modalSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E325C",
    marginBottom: 8,
    fontFamily: Fonts.semiBold,
  },
  modalButtonSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    alignItems: "center",
  },
  specItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 6,
  },
  specBullet: {
    fontSize: 16,
    color: "#324D7F",
    marginRight: 8,
    fontWeight: "bold",
    fontFamily: Fonts.regular,
  },
  specText: {
    fontSize: 14,
    color: "#444",
    fontFamily: Fonts.regular,
    flex: 1,
  },
  badgeContainer: {
    backgroundColor: "#ff4444ff",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: -10,
    marginTop: -5,
  },
  badgeText: {
    color: "#FFF7F7",
    fontSize: 12,
    fontFamily: Fonts.bold,
  },
  linkText: {
    color: "#324D7F",
    textDecorationLine: "underline",
    fontWeight: "600",
    fontFamily: Fonts.regular,
  },
});
