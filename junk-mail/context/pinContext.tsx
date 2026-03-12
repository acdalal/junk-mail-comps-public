import React, { createContext, ReactNode, useContext, useState } from "react";

type PinContextType = {
  pin: string;
  setPin: (newPin: string) => void;
};

const PinContext = createContext<PinContextType>({
  pin: "",
  setPin: () => {},
});


export const PinProvider = ({ children }: { children: ReactNode }) => {
  const [pin, setPin] = useState("awesomeswasome#1");

  return (
    <PinContext.Provider value={{ pin, setPin }}>
      {children}
    </PinContext.Provider>
  );
};

export const usePin = () => {
  const context = useContext(PinContext);
  return context;
};
