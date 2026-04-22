import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';

export function useTheme() {
  const { isDark, toggleTheme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return { isDark, toggleTheme };
}
