import { create } from "zustand";
import type { Category } from "./catalog";

type UI = {
  category: Category | null;
  setCategory: (c: Category | null) => void;
  customizeId: string | null;
  setCustomizeId: (id: string | null) => void;
  quickViewId: string | null;
  setQuickViewId: (id: string | null) => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (o: boolean) => void;
  requestOpen: boolean;
  setRequestOpen: (o: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (o: boolean) => void;
};

export const useUI = create<UI>()((set) => ({
  category: null,
  setCategory: (category) => set({ category }),
  customizeId: null,
  setCustomizeId: (customizeId) => set({ customizeId, quickViewId: null }),
  quickViewId: null,
  setQuickViewId: (quickViewId) => set({ quickViewId }),
  checkoutOpen: false,
  setCheckoutOpen: (checkoutOpen) => set({ checkoutOpen }),
  requestOpen: false,
  setRequestOpen: (requestOpen) => set({ requestOpen }),
  favoritesOnly: false,
  setFavoritesOnly: (favoritesOnly) => set({ favoritesOnly }),
}));

export const scrollToCatalog = () =>
  document.getElementById("koleksiyon")?.scrollIntoView({ behavior: "smooth", block: "start" });
