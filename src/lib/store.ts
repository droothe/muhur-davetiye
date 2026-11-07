import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_PRODUCTS, type Product } from "./catalog";
import { lineTotal, type ExtraKey, type QuantityTier } from "./pricing";

export type Personalization = {
  bride: string;
  groom: string;
  date: string;
  time: string;
  venue: string;
  message: string;
  font: "script" | "serif" | "sans";
  ink: "gold" | "charcoal" | "rose";
};

export type CartItem = {
  key: string;
  productId: string;
  title: string;
  image: string;
  basePrice: number;
  qty: QuantityTier;
  extras: ExtraKey[];
  personalization: Personalization;
};

export type OrderStatus = "Grafik Onayı Bekliyor" | "Baskıda" | "Kargoda" | "Teslim Edildi";
export type Order = {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; email: string; city: string; address: string };
  payment: "Kapıda Ödeme" | "Kredi Kartı" | "Havale / EFT";
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
};

type State = {
  products: Product[];
  cart: CartItem[];
  favorites: string[];
  orders: Order[];
  cartOpen: boolean;
  search: string;
  setSearch: (s: string) => void;
  setCartOpen: (o: boolean) => void;
  addToCart: (i: Omit<CartItem, "key">) => void;
  updateQty: (key: string, qty: QuantityTier) => void;
  removeFromCart: (key: string) => void;
  clearCart: () => void;
  toggleFavorite: (id: string) => void;
  placeOrder: (o: Omit<Order, "id" | "createdAt" | "status">) => Order;
  setOrderStatus: (id: string, s: OrderStatus) => void;
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;
};

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      cart: [],
      favorites: [],
      orders: [],
      cartOpen: false,
      search: "",
      setSearch: (search) => set({ search }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      addToCart: (i) =>
        set((s) => ({ cart: [...s.cart, { ...i, key: crypto.randomUUID() }], cartOpen: true })),
      updateQty: (key, qty) =>
        set((s) => ({ cart: s.cart.map((c) => (c.key === key ? { ...c, qty } : c)) })),
      removeFromCart: (key) => set((s) => ({ cart: s.cart.filter((c) => c.key !== key) })),
      clearCart: () => set({ cart: [] }),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
      placeOrder: (o) => {
        const order: Order = {
          ...o,
          id: "KD" + Math.floor(100000 + Math.random() * 900000),
          createdAt: new Date().toISOString(),
          status: "Grafik Onayı Bekliyor",
        };
        set((s) => ({ orders: [order, ...s.orders], cart: [] }));
        return order;
      },
      setOrderStatus: (id, status) =>
        set((s) => ({ orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)) })),
      upsertProduct: (p) =>
        set((s) => ({
          products: s.products.some((x) => x.id === p.id)
            ? s.products.map((x) => (x.id === p.id ? p : x))
            : [p, ...s.products],
        })),
      deleteProduct: (id) => set((s) => ({ products: s.products.filter((p) => p.id !== id) })),
      resetProducts: () => set({ products: SEED_PRODUCTS }),
    }),
    {
      name: "koala-davetiye",
      skipHydration: true,
      partialize: (s) => ({
        products: s.products,
        cart: s.cart,
        favorites: s.favorites,
        orders: s.orders,
      }),
    },
  ),
);

export const cartSubtotal = (cart: CartItem[]) =>
  cart.reduce((s, c) => s + lineTotal(c.basePrice, c.qty, c.extras), 0);
