/**
 * Owner: solar@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { useEffect } from 'react';
import storage from 'utils/storage';
import { useLocation } from 'react-router-dom';
import { isFixedDarkTheme, isThemeDisabledRoute } from 'src/theme/blackRouteList';

function getTheme() {
  try {
    const _theme = storage.getItem('kc_theme', { isPublic: true });
    return ['light', 'dark'].includes(_theme) ? _theme : 'light';
  } catch (e) {
    console.log(e);
    return 'light';
  }
}

export default function ThemeChange({ children }) {
  const { setTheme } = useTheme();
  const storageTheme = getTheme();
  const location = useLocation();

  useEffect(() => {
    if (isFixedDarkTheme(location.pathname)) {
      setTheme('dark');
      return;
    }

    if (!isThemeDisabledRoute()) {
      setTheme(storageTheme);
    } else {
      setTheme('light');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageTheme, location.pathname]);

  return children;
}
