import { useTheme as useThemeContext } from '@/components/ThemeChange';

export default function useTheme() {
  const { theme, setTheme } = useThemeContext();

  return {
    theme,
    setTheme,
  };
}
