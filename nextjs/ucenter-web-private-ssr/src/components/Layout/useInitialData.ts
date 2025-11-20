import { setCookies } from '@/services/user';
import { getTenantConfig } from '@/tenant';
import { init } from '@/tools/windowOpen';
import { kucoinv2Storage as storage } from 'gbiz-next/storage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';


export function useInitialData() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({
      type: 'user/pullUser',
    });
    init();
  }, []);

  // 初始化主题，逻辑为
  // 1. 如果 localStorage 中设置了主题，则不做任何处理；也就是如果用户主动切过主题，以用户的为准；
  // 2. 如果 localStorage 中没有设置主题，则强制设置为 dark；也就是如果用户没切过主题，则主动设置为黑色；
  useEffect(() => {
    const storageTheme = storage.getItem('kc_theme', { isPublic: true });
    if (!storageTheme) {
      const defaultTheme: 'light' | 'dark' = getTenantConfig().common.forceLightTheme ? 'light' : 'dark';
      storage.setItem('kc_theme', defaultTheme, { isPublic: true });
      setCookies([{ name: 'kc_theme', value: defaultTheme }]);
    }
  }, []);
}
