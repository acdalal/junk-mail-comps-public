
// import { Pressable, StyleSheet, Text, View } from "react-native";
// import { IconSymbol } from "@/components/ui/icon-symbol";
// import { Fonts } from "@/constants/theme";

// interface AddToCartProps {
//   itemName: string;
//   count: number;
//   limit: number;
//   isInCart: boolean;
//   onAdd: () => void;
//   onIncrement: () => void;
//   onDecrement: () => void;
//   size?: "small" | "large";
// }

// export function AddToCart({
//   itemName,
//   count,
//   limit,
//   isInCart,
//   onAdd,
//   onIncrement,
//   onDecrement,
//   size = "small",
// }: AddToCartProps) {
//   const isLarge = size === "large";

//   //if item is not in cart, show add to cart button 
//   if (!isInCart) {
//     return (
//       <Pressable
//         style={[styles.addButton, isLarge && styles.addButtonLarge]}
//         onPress={onAdd}
//       >
//         <IconSymbol
//           name="cart.badge.plus"
//           size={isLarge ? 22 : 20}
//           color="#FFF7F7"
//         />
//         <Text style={[styles.addButtonText, isLarge && styles.addButtonTextLarge]}>
//           Add to Cart
//         </Text>
//       </Pressable>
//     );
//   }

//     // Renders the flip side of the "Add to Cart" button with
//     // +/- buttons to update the quantity
//   return (
//     <View style={[styles.counterContainer, isLarge && styles.counterContainerLarge]}>
//       <Pressable style={[styles.counterButton, isLarge && styles.counterButtonLarge]} onPress={onDecrement}>
//         <Text style={[styles.counterSymbol, isLarge && styles.counterSymbolLarge]}>-</Text>
//       </Pressable>

//       <Text style={[styles.counter, isLarge && styles.counterLarge]}>{count}</Text>

//       <Pressable
//         onPress={onIncrement}
//         disabled={count >= limit}
//         style={[
//           styles.counterButton, 
//           isLarge && styles.counterButtonLarge,
//           count >= limit && styles.disabledButton
//         ]}
//       >
//         <Text
//           style={[
//             styles.counterSymbol, 
//             isLarge && styles.counterSymbolLarge,
//             count >= limit && styles.disabledText
//           ]}
//         >
//           +
//         </Text>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   addButton: {
//     backgroundColor: "#324D7F",
//     borderRadius: 8,
//     paddingVertical: 14,
//     paddingHorizontal: 12,
//     width: "90%",
//     height: 50,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 6,
//   },
//   addButtonLarge: {
//     borderRadius: 8,
//     paddingVertical: 16,
//     paddingHorizontal: 16,
//     width: "100%",
//     height: 56,
//     gap: 8,
//   },
//   addButtonText: {
//     color: "#FFF7F7",
//     fontSize: 16,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   addButtonTextLarge: {
//     fontSize: 18,
//   },
//   counterContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#324D7F",
//     borderRadius: 8,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     width: "90%",
//     height: 50,
//     justifyContent: "space-between",
//   },
//   counterContainerLarge: {
//     borderRadius: 8,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     width: "100%",
//     height: 56,
//   },
//   counterButton: {
//     backgroundColor: "#FFF7F7",
//     borderRadius: 6,
//     width: 36,
//     height: 36,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   counterButtonLarge: {
//     width: 42,
//     height: 42,
//   },
//   counterSymbol: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1E325C",
//   },
//   counterSymbolLarge: {
//     fontSize: 22,
//   },
//   counter: {
//     color: "#FFF7F7",
//     fontSize: 20,
//     fontWeight: "bold",
//     marginHorizontal: 4,
//     minWidth: 28,
//     textAlign: "center",
//     lineHeight: 24,
//   },
//   counterLarge: {
//     fontSize: 22,
//     minWidth: 32,
//   },
//   disabledButton: {
//     backgroundColor: "#ccc",
//   },
//   disabledText: {
//     color: "#888",
//   },
// });


import { Pressable, StyleSheet, Text, View, AccessibilityProps  } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Fonts } from "@/constants/theme";

interface AddToCartProps {
  itemName: string;
  count: number;
  limit: number;
  isInCart: boolean;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "small" | "medium" | "large";
}

export function AddToCart({
  itemName,
  count,
  limit,
  isInCart,
  onAdd,
  onIncrement,
  onDecrement,
  size = "medium",
}: AddToCartProps) {
  const isLarge = size === "large";
  const isSmall = size === "small";

  //if item is not in cart, show add to cart button 
  if (!isInCart) {
    return (
      <Pressable
        style={[
          styles.addButton,
          isSmall && styles.addButtonSmall,
          isLarge && styles.addButtonLarge
        ]}
        onPress={onAdd}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Add ${itemName} to cart`}
        accessibilityHint="Double tap to add this item to your order"
      >
        <IconSymbol
          name="cart.badge.plus"
          size={isLarge ? 22 : isSmall ? 18 : 20}
          color="#FFF7F7"
        />
        <Text style={[
          styles.addButtonText,
          isSmall && styles.addButtonTextSmall,
          isLarge && styles.addButtonTextLarge
        ]}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={`${itemName} quantity: ${count} of ${limit}`}
        accessibilityHint="Swipe up to increase, swipe down to decrease quantity"
        accessibilityValue={{
          min: 0,
          max: limit,
          now: count,
          text: `${count} items`
        }}
    >
          Add to Cart
        </Text>
      </Pressable>
    );
  }

    // Renders the flip side of the "Add to Cart" button with
    // +/- buttons to update the quantity
  return (
    <View style={[
      styles.counterContainer,
      isSmall && styles.counterContainerSmall,
      isLarge && styles.counterContainerLarge
    ]}>
      <Pressable style={[
        styles.counterButton,
        isSmall && styles.counterButtonSmall,
        isLarge && styles.counterButtonLarge
      ]} onPress={onDecrement}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${itemName} quantity`}
        accessibilityHint={count > 0 ? `Current quantity is ${count}. Double tap to decrease` : "Item will be removed from cart"}
      >
        <Text style={[
          styles.counterSymbol,
          isSmall && styles.counterSymbolSmall,
          isLarge && styles.counterSymbolLarge
        ]}>-</Text>
      </Pressable>

      <Text style={[
        styles.counter,
        isSmall && styles.counterSmall,
        isLarge && styles.counterLarge
      ]}>{count}</Text>

      <Pressable
        onPress={onIncrement}
        disabled={count >= limit}
        style={[
          styles.counterButton,
          isSmall && styles.counterButtonSmall,
          isLarge && styles.counterButtonLarge,
          count >= limit && styles.disabledButton
        ]}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${itemName} quantity`}
        accessibilityHint={count >= limit ? `Maximum limit of ${limit} reached` : `Current quantity is ${count}. Double tap to increase`}
        accessibilityState={{ disabled: count >= limit }}
      >
        <Text
          style={[
            styles.counterSymbol,
            isSmall && styles.counterSymbolSmall,
            isLarge && styles.counterSymbolLarge,
            count >= limit && styles.disabledText
          ]}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#324D7F",
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 12,
    width: "90%",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addButtonSmall: {
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    width: 120,
    height: 42,
    gap: 4,
  },
  addButtonLarge: {
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: "100%",
    height: 56,
    gap: 8,
  },
  addButtonText: {
    color: "#FFF7F7",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  addButtonTextSmall: {
    fontSize: 15,
  },
  addButtonTextLarge: {
    fontSize: 18,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#324D7F",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "90%",
    height: 50,
    justifyContent: "space-between",
  },
  counterContainerSmall: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    width: 120,
    height: 42,
  },
  counterContainerLarge: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    height: 56,
  },
  counterButton: {
    backgroundColor: "#FFF7F7",
    borderRadius: 6,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  counterButtonSmall: {
    borderRadius: 4,
    width: 32,
    height: 32,
  },
  counterButtonLarge: {
    width: 42,
    height: 42,
  },
  counterSymbol: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E325C",
  },
  counterSymbolSmall: {
    fontSize: 18,
  },
  counterSymbolLarge: {
    fontSize: 22,
  },
  counter: {
    color: "#FFF7F7",
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 4,
    minWidth: 28,
    textAlign: "center",
    lineHeight: 24,
  },
  counterSmall: {
    fontSize: 18,
    marginHorizontal: 2,
    minWidth: 20,
    lineHeight: 22,
  },
  counterLarge: {
    fontSize: 22,
    minWidth: 32,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  disabledText: {
    color: "#888",
  },
});