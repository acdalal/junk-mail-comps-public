// import AsyncStorage from "@react-native-async-storage/async-storage";

// const ORDERS_KEY = "all_orders";
// const CHECKED_KEY = "checked_orders";

// export async function loadOrders() {
//   try {
//     const stored = await AsyncStorage.getItem(ORDERS_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch (e) {
//     console.error("Load orders error:", e);
//     return [];
//   }
// }

// export async function saveOrder(order: any) {
//   try {
//     const existing = await loadOrders();
//     const updated = [...existing, order];
//     await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
//   } catch (e) {
//     console.error("Save order error:", e);
//   }
// }

// export async function loadCheckedOrders() {
//   try {
//     const stored = await AsyncStorage.getItem(CHECKED_KEY);
//     return stored ? JSON.parse(stored) : {};
//   } catch (e) {
//     console.error("Load checked orders error:", e);
//     return {};
//   }
// }

// export async function saveCheckedOrders(checked: any) {
//   try {
//     await AsyncStorage.setItem(CHECKED_KEY, JSON.stringify(checked));
//   } catch (e) {
//     console.error("Save checked orders error:", e);
//   }
// }

//  export async function clearOrders(){
//   await AsyncStorage.removeItem(ORDERS_KEY)
//   await AsyncStorage.removeItem(CHECKED_KEY)
// }
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { getCurrentUser, getCurrentUserWithToken } from "./accountStorage";
import { db } from "./firebaseConfig";

const ORDERS_COLLECTION = "orders";

export async function loadOrders() {
  try {
    const q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc"),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("Load orders error:", e);
    return [];
  }
}

export async function saveOrder(order: any) {
  try {
    const user = await getCurrentUserWithToken();

    if (!user) {
      console.error("No logged-in user found. Cannot save order.");
      return;
    }

    await addDoc(collection(db, ORDERS_COLLECTION), {
      ...order,
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      expoPushToken: user.expoPushToken || null,
      checked: false,
      createdAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Save order error:", e);
  }
}

export async function loadCheckedOrders() {
  try {
    const orders = await loadOrders();
    const checked: any = {};
    orders.forEach((order: any) => {
      if (order.checked) {
        checked[order.id] = true;
      }
    });
    return checked;
  } catch (e) {
    console.error("Load checked orders error:", e);
    return {};
  }
}

export async function saveCheckedOrder(orderId: string, isChecked: boolean) {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(orderRef, { checked: isChecked });
  } catch (e) {
    console.error("Save checked order error:", e);
  }
}

export async function clearOrders() {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const deletions = snapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletions);
  } catch (e) {
    console.error("Clear orders error:", e);
  }
}
