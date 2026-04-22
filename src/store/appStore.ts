import { create } from 'zustand';
import type { ActivePage, BarcodeConfig } from '../types';

interface AppState {
  activePage: ActivePage;
  isDark: boolean;
  barcodeConfig: BarcodeConfig;
  setActivePage: (page: ActivePage) => void;
  toggleTheme: () => void;
  setBarcodeConfig: (partial: Partial<BarcodeConfig>) => void;
}

const defaultConfig: BarcodeConfig = {
  type: 'qrcode',
  value: '',
  width: 300,
  height: 300,
  color: '#000000',
  backgroundColor: '#ffffff',
  showText: true,
};

export const useAppStore = create<AppState>((set) => ({
  activePage: 'generator',
  isDark: true,
  barcodeConfig: defaultConfig,
  setActivePage: (page) => set({ activePage: page }),
  toggleTheme: () => set((s) => ({ isDark: !s.isDark })),
  setBarcodeConfig: (partial) =>
    set((s) => ({ barcodeConfig: { ...s.barcodeConfig, ...partial } })),
}));
