import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type {IVehicle} from "@/features/admin/protected/vehicle/types/vehicle.type"
import type { DateRange } from "react-day-picker";

type CartItem = {
  vehicle: IVehicle;
  dateRange: DateRange;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  setCartItems: (items: CartItem[]) => void;
  removeVehicle: (vehicleId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};

function deserializeCartItems(items: any[]): CartItem[] {
  return items.map((item) => ({
    ...item,
    dateRange: {
      from: item.dateRange.from ? new Date(item.dateRange.from) : null,
      to: item.dateRange.to ? new Date(item.dateRange.to) : null,
    },
  }));
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = sessionStorage.getItem("cart");
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return deserializeCartItems(parsed);
    } catch (err) {
      console.error("Failed to parse cart from sessionStorage:", err);
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
        
        const existingItem = prevCart.find(cartItem => cartItem.vehicle.id === item.vehicle.id);
        if (existingItem) {
            console.log("Vehicle already in cart.");
            return prevCart;
        }
        return [...prevCart, item];
    });
  };

  const setCartItems = (items: CartItem[]) => {
      setCart(items);
  }

  const removeVehicle = (vehicleId: string) => {
    setCart((prev) => prev.filter((item) => item.vehicle.id !== vehicleId));
  };

  const clearCart = useCallback(() => {
    console.log("Clearing cart...");
    setCart([]);
    sessionStorage.removeItem("cart"); 
  }, []);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, setCartItems, removeVehicle, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
