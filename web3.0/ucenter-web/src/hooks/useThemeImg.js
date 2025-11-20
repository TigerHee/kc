/**
 * Owner: eli.xiang@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useCallback } from 'react';

export default function useThemeImg() {
  const theme = useTheme();
  const currentTheme = theme?.currentTheme || 'light';

  const getThemeImg = useCallback(
    (imgs) => {
      let imgObject = {
        light: imgs?.light,
        dark: imgs?.dark,
      };
      if (Array.isArray(imgs)) {
        imgObject.light = imgs[0];
        imgObject.dark = imgs[1];
      }
      return currentTheme === 'light' ? imgObject.light : imgObject.dark;
    },
    [currentTheme],
  );

  return {
    getThemeImg,
  };
}
