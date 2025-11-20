/**
 * Owner: garuda@kupotech.com
 * 在 app 里面使用，获取当前的域名（app 不能暴露 .plus）
 */

import { siteCfg } from 'config';

import { isInApp, useAppInfo } from './useApp';

export const useMainHost = () => {
  const appInfo = useAppInfo();
  const appMainHost = appInfo?.webHost ? `https://${appInfo.webHost}` : siteCfg?.KUCOIN_HOST_COM;
  return isInApp() ? appMainHost : siteCfg?.KUCOIN_HOST;
};
