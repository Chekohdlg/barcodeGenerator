import { useEffect, useCallback } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { useAppStore } from '../store/appStore';

let themeStore: Awaited<ReturnType<typeof load>> | null = null;

async function getThemeStore() {
  if (!themeStore) {
    themeStore = await load('prefs.json', { defaults: {} });
  }
  return themeStore;
}

export function useTheme() {
  const { isDark, toggleTheme, setIsDark } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    async function loadTheme() {
      try {
        const store = await getThemeStore();
        const saved = await store.get<boolean>('isDark');
        if (saved !== null && saved !== undefined) {
          setIsDark(saved);
        }
      } catch {
        // use default
      }
    }
    loadTheme();
  }, [setIsDark]);

  const toggleAndSave = useCallback(async () => {
    toggleTheme();
    try {
      const store = await getThemeStore();
      await store.set('isDark', !isDark);
    } catch {
      // ignore
    }
  }, [isDark, toggleTheme]);

  return { isDark, toggleTheme: toggleAndSave };
}
