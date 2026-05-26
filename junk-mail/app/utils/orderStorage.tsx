/**
 * @file Data persistence utility for managing order data in a React Native application.
 * * This module utilizes `@react-native-async-storage/async-storage` to localy save, load, 
 * and clear two types of order-related data across app sessions:
 * 1. "all_orders" (ORDERS_KEY): Stores an array of all order objects.
 * 2. "checked_orders" (CHECKED_KEY): Stores an object tracking the "checked" or completion status of orders.
 * * All storage operations are asynchronous and safely wrapped in try/catch blocks 
 * with fallback return values (empty array/object) to handle potential read/write errors.
 */

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
