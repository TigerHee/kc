/**
 * Owner: andy.wu@kupotech.com
 */
import {
  gaClickNew,
  getGaElement,
  kcsensorsClick,
} from './common/tools';
import { includes } from 'lodash-es';

export const FUTURES_TRADE_PATH = '/futures/trade';
export const TRADE_FUTURES_PATH = '/trade/futures';

export const isFuturesNewEntryEnabled = () => {
  if (typeof window === 'undefined') {
    return true;
  }

  const preferredVersion = window.localStorage.getItem('future:preferredVersion');
  const isIntegrateTradeUser = window.localStorage.getItem('futures.isIntegrateTradeUser');

  if (preferredVersion === 'legacy_v2' && isIntegrateTradeUser === 'true') {
    // 如果用户选择了返回旧版，且为灰度名单用户，则不启用新版入口
    return false;
  }

  return true;
};

const regexHeader = /headers\d/;

export const headerGa = (e) => {
  // 捕获冒泡，统一上报，后续上报新标准统一了再统一处理
  const { target } = e;
  if (target) {
    let useNode: HTMLElement | null = null;
    if (target.getAttribute('data-modid')) {
      useNode = target;
    } else {
      useNode = getGaElement(target, 'data-ga');
    }
    if (useNode) {
      const modid = useNode.getAttribute('data-modid') || '';
      const idx = useNode.getAttribute('data-idx') || 0;
      if (modid) {
        // 可上报新格式
        const map = {
          siteid: 'kucoinWeb',
          pageid: 'homepage',
          modid,
          eleid: Number(idx),
        } as any;
        if (regexHeader.test(modid)) {
          // 头部导航需要上报id
          const id = useNode.getAttribute('data-ga') || '';
          map.id = id;
        }
        gaClickNew('eleClickCollectionV1', map);
        if (includes(['person', 'assets', 'orders', 'appDowload'], modid)) {
          kcsensorsClick([modid, String(idx || 1)]);
        }
      }
    }
};

}