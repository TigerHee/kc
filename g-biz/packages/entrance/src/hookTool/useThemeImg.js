/**
 * Owner: sean.shi@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useCallback } from 'react';

export default function useThemeImg() {
  const theme = useTheme();
  const currentTheme = theme?.currentTheme || 'light';

  const getThemeImg = useCallback(
    (imgs) => {
      const imgObject = {
        light: imgs?.light,
        dark: imgs?.dark,
      };
      if (Array.isArray(imgs)) {
        const [light, dark] = imgs;
        imgObject.light = light;
        imgObject.dark = dark;
      }
      return currentTheme === 'light' ? imgObject.light : imgObject.dark;
    },
    [currentTheme],
  );

  return {
    getThemeImg,
  };
}
