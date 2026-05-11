import { useEffect, useRef } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { useAppStore } from '../store/appStore';
import type { BarcodeConfig } from '../types';

// Shared prefs.json instance (same file as useTheme, different key)
let prefsStore: Awaited<ReturnType<typeof load>> | null = null;

async function getPrefsStore() {
  if (!prefsStore) {
    prefsStore = await load('prefs.json', { defaults: {} });
  }
  return prefsStore;
}

export function useConfig() {
  const { setBarcodeConfig } = useAppStore();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved config on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const store = await getPrefsStore();
        const saved = await store.get<BarcodeConfig>('barcodeConfig');
        if (saved && typeof saved === 'object') {
          setBarcodeConfig(saved);
        }
      } catch {
        // use defaults if store unavailable
      }
    }
    loadConfig();
  }, [setBarcodeConfig]);

  // Update store and persist to disk with 600ms debounce
  const setBarcodeConfigAndSave = (partial: Partial<BarcodeConfig>) => {
    // Update Zustand immediately (reactive UI)
    setBarcodeConfig(partial);

    // Debounce the disk write
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const store = await getPrefsStore();
        // Read the latest merged state at save time
        const current = useAppStore.getState().barcodeConfig;
        await store.set('barcodeConfig', current);
      } catch {
        // ignore write errors silently
      }
    }, 600);
  };

  return { setBarcodeConfigAndSave };
}
