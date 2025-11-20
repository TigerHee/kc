import { create } from 'zustand';

interface GlobalState {
  totalHeaderHeight: number;
  voiceOpen: boolean;
  setTotalHeaderHeight: (height: number) => void;
  setVoiceOpen: (open: boolean) => void;
}

export const useGlobalStore = create<GlobalState>(set => ({
  totalHeaderHeight: 0,
  voiceOpen: false,
  setTotalHeaderHeight: (height: number) => {
    set({ totalHeaderHeight: height });
  },
  setVoiceOpen: (open: boolean) => {
    set({ voiceOpen: open });
  },
}));
