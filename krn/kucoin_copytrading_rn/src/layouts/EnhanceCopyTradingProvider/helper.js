import {RouterNameMap} from 'constants/router-name-map';

/**
 * 通过 nativeProps.name 判断是否在跟单主页 兼容routerName为空场景
 */
export const checkIsMainPage = routerName => {
  return (
    routerName === RouterNameMap.CopyTradeMain ||
    routerName === 'undefined' ||
    !routerName
  );
};
