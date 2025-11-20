/**
 * Owner: john.zhang@kupotech.com
 */

import { addLangToPath } from 'src/tools/i18n';
import siteCfg from 'src/utils/siteConfig';

const APP_TRANSFER_PATH = '/account/transfer?appNeedLang=true';

export const getValidAppTransferLink = (appRoute = '') => {
  // http或https的链接直接返回
  if (appRoute.indexOf('http') === 0) {
    return addLangToPath(appRoute);
  }
  // &goBackUrl=https://host/account/transfer?appNeedLang=true，host按实际情况;
  const needGoBackUrlParamsLinks = ['account/asset', '/trade'];
  const isNeedAddGoBackUrl = needGoBackUrlParamsLinks.some((item) => appRoute.indexOf(item) > -1);
  if (isNeedAddGoBackUrl) {
    const { KUCOIN_HOST } = siteCfg || {};
    let goBackUrl = addLangToPath(`${KUCOIN_HOST}${APP_TRANSFER_PATH}`);
    if (checkIsAppMigrationContainer()) {
      goBackUrl += '&isMigrationContainer=true';
    }
    const hasParams = appRoute.indexOf('?') > -1;
    return hasParams
      ? `${appRoute}&goBackUrl=${encodeURIComponent(goBackUrl)}`
      : `${appRoute}?goBackUrl=${encodeURIComponent(goBackUrl)}`;
  }
  return appRoute;
};

/**
 * 检查当前是否为App侧新打开的迁移容器
 * @returns
 */
export const checkIsAppMigrationContainer = () => {
  return location.href.indexOf('isMigrationContainer=true') > -1;
};
