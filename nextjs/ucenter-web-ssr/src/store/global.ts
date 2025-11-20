import { create } from 'zustand';

interface GlobalState {
  totalHeaderHeight: number;
  setTotalHeaderHeight: (height: number) => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
  totalHeaderHeight: 72,
  setTotalHeaderHeight: (height: number) => {
    set({ totalHeaderHeight: height });
  },
}));
