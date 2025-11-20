import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { setTheme as setThemeDesign } from '@kux/design';
import { useTheme as useThemeMui } from '@kux/mui-next';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { useInitialProps } from 'gbiz-next/InitialProvider';
import { IS_SSR_MODE, IS_DEV } from 'kc-next/env';
import Cookies from 'js-cookie';

type ThemeType = 'light' | 'dark';

export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
}

const THEME_STORAGE_KEY = 'kc_theme';
const DEFAULT_THEME: ThemeType = 'dark';

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeChangeProps {
  children: React.ReactNode;
}

interface InitialProps {
  theme?: ThemeType;
}

export default function ThemeChange({ children }: ThemeChangeProps) {
  const initialProps = useInitialProps() as InitialProps;
  const { setTheme: setThemeMui } = useThemeMui();
  const [theme, setTheme] = useState<ThemeType>(() => {
    if (IS_SSR_MODE) {
      return initialProps?.theme || DEFAULT_THEME;
    }
    try {
      const storedTheme = storage.getItem(THEME_STORAGE_KEY) as ThemeType;
      return storedTheme || DEFAULT_THEME;
    } catch (error) {
      console.warn('Failed to read theme from storage:', error);
      return DEFAULT_THEME;
    }
  });

  const updateThemeSettings = useCallback((newTheme: ThemeType) => {
    try {
      setThemeDesign(newTheme);
      setThemeMui(newTheme);
      if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', newTheme);
        // 只在开发环境模拟 cookie 主题
        if (IS_DEV) {
          Cookies.set(THEME_STORAGE_KEY, newTheme);
        }
      }
    } catch (error) {
      console.error('Failed to update theme settings:', error);
    }
  }, [setThemeMui]);

  const handleSetTheme = useCallback((newTheme: ThemeType) => {
    if (newTheme === theme) return;
    try {
      setTheme(newTheme);
      updateThemeSettings(newTheme);
      storage.setItem(THEME_STORAGE_KEY, newTheme, { isPublic: true });
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }, [theme, updateThemeSettings]);

  // 初始化主题（仅在SPA客户端）- 只执行一次
  useEffect(() => {
    if (IS_SSR_MODE) return;
    try {
      const storedTheme = storage.getItem(THEME_STORAGE_KEY) as ThemeType;
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme);
        updateThemeSettings(storedTheme);
      } else {
        updateThemeSettings(theme);
      }
    } catch (error) {
      console.warn('Failed to initialize theme from storage:', error);
      updateThemeSettings(DEFAULT_THEME);
    }
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: handleSetTheme,
  }), [theme, handleSetTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeChange provider');
  }
  return context;
};


// SSR / CSR SPA

