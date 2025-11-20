/**
 * Owner: victor.ren@kupotech.com
 */
import { useEffect } from 'react';
import storage from '@utils/storage';
import { isInApp, isSSG } from '../common/tools';
import { captureThemeError } from '../Header/tools';

export default function useInitThemeAB() {
  useEffect(() => {
    if (isSSG || isInApp) return;
    const storageTheme = storage.getItem('kc_theme', { isPublic: true });

    if (
      __env__ !== 'development' &&
      window.SSG_theme && // 有SSG模式下
      storageTheme && // 做过主题切换
      window.SSG_theme !== storageTheme // SSG和运行时主题不一致
    ) {
      captureThemeError(`ssg - runtime theme not match -> ${window.SSG_theme} - ${storageTheme}`);
    }
  }, []);
}
