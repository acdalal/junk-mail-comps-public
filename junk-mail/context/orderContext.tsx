import React, { createContext, useContext, useState, ReactNode } from "react";

export type Order = {
  [key: string]: number;
};

type OrderContextType = {
  order: Order;
  addItem: (itemName: string) => void;
  updateOrdercount: (itemName: string, count: number) => void;
  removeItem: (itemName: string) => void;
  clearOrder: () => void;
  updateOrder: (updatedOrder: Order) => void;
};

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [order, setOrder] = useState<Order>({});

  const addItem = (item: string) => {
    setOrder((prev) => ({
      ...prev,
      [item]: (prev[item] || 0) + 1,
    }));
  };

  const updateOrdercount = (item: string, count: number) => {
    setOrder((prev) => {
      const newOrder = { ...prev };
      if (count <= 0) {
        delete newOrder[item];
      } else {
        newOrder[item] = count;
      }
      return newOrder;
    });
  };

  const removeItem = (item: string) => {
    setOrder((prev) => {
      const newOrder = { ...prev };
      delete newOrder[item];
      return newOrder;
    });
  };

  const clearOrder = () => {
    setOrder({});
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

  return (
    <OrderContext.Provider
      value={{ order, addItem, updateOrdercount, removeItem, clearOrder, updateOrder }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrder must be used within an OrderProvider");
  return ctx;
};
