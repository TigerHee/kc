/**
 * Owner: sean.shi@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useCallback } from 'react';

interface ThemeImages {
  light?: string;
  dark?: string;
}

type ThemeImageTuple = [string, string];

export default function useThemeImg() {
  const theme = useTheme();
  const currentTheme = theme?.currentTheme || 'light';

  const getThemeImg = useCallback(
    (imgs: ThemeImages | ThemeImageTuple): string | undefined => {
      const imgObject: ThemeImages = {
        light: undefined,
        dark: undefined,
      };

      if (Array.isArray(imgs)) {
        const [light, dark] = imgs;
        imgObject.light = light;
        imgObject.dark = dark;
      } else {
        imgObject.light = imgs.light;
        imgObject.dark = imgs.dark;
      }

      return currentTheme === 'light' ? imgObject.light : imgObject.dark;
    },
    [currentTheme],
  );

  return {
    getThemeImg,
  };
}
