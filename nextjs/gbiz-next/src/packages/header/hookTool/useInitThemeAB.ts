/**
 * Owner: victor.ren@kupotech.com
 */
import { useEffect } from 'react';
import { IS_SSG_ENV, IS_CLIENT_ENV } from 'kc-next/env'
import storage from 'tools/storage';
import { isInApp } from '../common/tools';
import { _DEV_ } from 'config/env';
import { captureThemeError } from '../Header/tools';
import { usePageProps } from 'provider/PageProvider';

// TODO 后面移除
export default function useInitThemeAB() {
  useEffect(() => {
    if (IS_SSG_ENV || isInApp) return;
    const storageTheme = storage.getItem('kc_theme', { isPublic: true });
    const pageProps = usePageProps();
    const htmlTheme = pageProps?.globalTheme;

    if (
      !_DEV_ &&
      IS_CLIENT_ENV && window.SSG_theme && // 有SSG模式下
      htmlTheme && // 有SSG模式下
      storageTheme && // 做过主题切换
      htmlTheme !== storageTheme // SSG和运行时主题不一致
    ) {
      captureThemeError(`ssg - runtime theme not match -> ${htmlTheme} - ${storageTheme}`);
    }
  }, []);
}
