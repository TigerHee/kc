import { create } from 'zustand';

interface CoinData {
  currencyName?: string;
  iconUrl?: string;
  symbol?: string;
  type?: string;
  [key: string]: any;
}

interface CategoriesState {
  categories: Record<string, CoinData>;
  setCategories: (categories: Record<string, CoinData>) => void;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: {},
  setCategories: (categories: Record<string, CoinData>) => {
    set({ categories });
  },
}));
