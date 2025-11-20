/**
 * Owner: corki.bai@kupotech.com
 */
import { useTheme } from '@kux/mui';
import { getIsInApp, searchToJson } from 'helper';
import { useEffect } from 'react';
import storage from 'utils/storage';

const themeConfig = {
  dark: 'dark',
  light: 'light',
};

function getTheme() {
  // 获取本地存储的主题,未获取到默认为light
  try {
    const _theme = storage.getItem('kc_theme', {
      isPublic: true,
    });
    return [themeConfig.dark, themeConfig.light].includes(_theme) ? _theme : 'light';
  } catch (e) {
    console.log(e);
    return 'light';
  }
}

const saveLocalTheme = (theme) => {
  // 保存主题到本地localStorage
  if ([themeConfig.dark, themeConfig.light].includes(theme)) {
    storage.setItem('kc_theme', theme, {
      isPublic: true,
    });
  }
};

const getInitTheme = () => {
  const isInApp = getIsInApp();
  const query = searchToJson();

  let _currentTheme = themeConfig.light;
  const storageTheme = getTheme();

  if (isInApp) {
    // 不再使用JsBridge获取主题，app ssg service时，无法获取到JsBridge
    // JsBridge.open({ type: 'func', params: { name: 'getAppInfo' } }, (params) => {
    //   setTheme(params?.data?.darkMode ? 'dark' : 'light');
    // });

    // app 优先用path上面的theme
    let urlTheme = query?.night;
    if (!urlTheme) {
      _currentTheme = storageTheme;
    } else {
      const queryTheme = urlTheme === 'true' ? themeConfig.dark : themeConfig.light;
      _currentTheme = queryTheme;
      if (storageTheme !== queryTheme) {
        saveLocalTheme(queryTheme);
      }
    }
  } else {
    _currentTheme = storageTheme;
  }
  return _currentTheme;
};

export default function ThemeChange({ children }) {
  const { setTheme } = useTheme();

  useEffect(() => {
    const _currentTheme = getInitTheme();
    document.documentElement.setAttribute('data-theme', _currentTheme);
    setTheme(_currentTheme);
  }, []);

  return children;
}
