import { TDK_EXCLUDE_PATH, TDK_REPLACE_PATH } from '@/config/base';
import { bootConfig, getCurrentLang, getHostname } from 'kc-next/boot';
import { serverTdk } from '@kc/tdk';
import { IS_DEV } from 'kc-next/env';

export const excludeTdkPath = (pathname) => {
  if (
    TDK_REPLACE_PATH.some((item) => {
      return item.test(pathname);
    })
  ) {
    return false; // 如果是需要替换tdk的二级路由，则不排除
  }
  return TDK_EXCLUDE_PATH.some((item) => {
    return item.test(pathname);
  });
};

export const replaceTdkPath = (pathname) => {
  return pathname.replace(/\/page\/\d+$/, '');
};

export const getTdk = (path) => {
  return new Promise((resolve) => {
    try {
      serverTdk.init({
        host: IS_DEV
          ? new URL(process.env.NEXT_PUBLIC_API_URL!).hostname
          : getHostname(),
        brandName: bootConfig._BRAND_NAME_,
      });
      if (!excludeTdkPath(path)) {
        serverTdk
          .getTdkData({
            pathname: replaceTdkPath(path),
            language: getCurrentLang(),
          })
          .then((tdk) => {
            resolve(tdk || null);
          })
          .catch(() => {
            resolve(null);
          });
      } else {
        resolve(null);
      }
    } catch (tdkError) {
      //todo:dev:spa 网络报错
      console.warn('serverTdk init/getTdkData failed:', tdkError);
      resolve(null);
    }
  });
};
