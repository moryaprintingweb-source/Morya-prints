import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { SelectedProductOption } from "../data/product-options";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  quantity: number;
  selectedOptions: SelectedProductOption[];
  artworkName?: string;
};

type CartItemInput = Omit<CartItem, "id" | "quantity" | "selectedOptions"> & {
  selectedOptions?: SelectedProductOption[];
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: CartItemInput, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "morya-printing-cart";

const getCartItemId = (item: CartItemInput) => {
  const configuration = (item.selectedOptions ?? [])
    .map((option) => `${option.id}=${option.value}`)
    .join("&");
  return [item.slug, configuration, item.artworkName ?? ""].join("::");
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<CartItem>[];
        setItems(
          parsed.map((item) => {
            const normalized = {
              ...item,
              selectedOptions: Array.isArray(item.selectedOptions) ? item.selectedOptions : [],
            } as CartItemInput;
            return {
              ...normalized,
              id: item.id ?? getCartItemId(normalized),
              quantity: Math.max(1, Number(item.quantity) || 1),
            } as CartItem;
          }),
        );
      }
    } catch {
      setItems([]);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Local storage can be unavailable in restricted browser modes.
    }
  }, [hydrated, items]);

  const addItem = useCallback((item: CartItemInput, quantity = 1) => {
    setItems((current) => {
      const id = getCartItemId(item);
      const existing = current.find((entry) => entry.id === id);
      if (existing) {
        return current.map((entry) =>
          entry.id === id ? { ...entry, quantity: Math.max(1, entry.quantity + quantity) } : entry,
        );
      }
      return [
        ...current,
        {
          ...item,
          id,
          selectedOptions: item.selectedOptions ?? [],
          quantity: Math.max(1, quantity),
        },
      ];
    });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current
        .map((entry) => (entry.id === id ? { ...entry, quantity: Math.max(1, quantity) } : entry))
        .filter((entry) => entry.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((current) => current.filter((entry) => entry.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [addItem, clearCart, items, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const cart = useContext(CartContext);
  if (!cart) throw new Error("useCart must be used inside CartProvider");
  return cart;
}
