/**
 * Owner: iron@kupotech.com
 */
import remoteEvent from '@tools/remoteEvent';
import storage from '@utils/storage';
import { tenantConfig } from '../tenantConfig';

export const FUTURES_TRADE_PATH = '/futures/trade';
export const TRADE_FUTURES_PATH = '/trade/futures';

// 用于获取神策匿名ID
export const getAnonymousID = () => {
  let id = '';
  remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
    id = sensors.getAnonymousID();
  });
  return id;
};

// 检测上次操作的时间是否未过期
// 未过期返回true，过期返回false
// 默认5秒过期
const lastPullDataTimestamp = {};
export const checkLastOperateTimestampUnexpired = (key, expireDuration = 5 * 1000) => {
  const select = lastPullDataTimestamp[key] || 0;
  const now = Date.now();
  if (now - select > expireDuration) {
    lastPullDataTimestamp[key] = now;
    return false;
  }
  return true;
};

/**
 * 通过步长获取精度 num >= 1 时， num<1，（仅限 0.0000...x 这种格式，如 0.01， 0.0005， 0.0000007等）
 * @param {*} num
 */
export const transStepToPrecision = (num) => {
  if (num > 1) {
    return 0;
  }
  const decimal = `${num}`.split('.')[1];
  return decimal ? decimal.length : 0;
};

// 删除过期缓存
export const resetLastOperateTimestampUnexpired = (key) => {
  const select = lastPullDataTimestamp[key];
  if (select) {
    delete lastPullDataTimestamp[key];
  }
};

// 获取神策 ab 结果
export const getSensorsABResult = (options) => {
  const _config = options || {};
  let getABFunc;
  try {
    remoteEvent.emit(remoteEvent.evts.GET_SENSORS, (sensors) => {
      getABFunc = sensors.fastFetchABTest;
    });
    if (getABFunc) {
      return getABFunc(_config);
    }
  } catch (e) {
    return Promise.resolve(_config.default_value);
  }
  return Promise.resolve(_config.default_value);
};

export function captureThemeError(msg) {
  const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
  try {
    if (window[sentryNamespace]) {
      window[sentryNamespace]?.captureEvent({
        message: `theme change error: ${msg}`,
        level: 'error',
        tags: {
          errorType: 'change_theme',
        },
        fingerprint: window.location.pathname,
      });
    }
  } catch (e) {
    console.log(e);
  }
}

// 获取new缓存 1代表关闭
export function getNewTagClosedState(key) {
  return storage.getItem(key) === '1';
}

// 设置new缓存 1代表关闭
export function closeNewTag(key) {
  return storage.setItem(key, '1');
}

export const sentryReport = (opt) => {
  const sentryNamespace = window.SENTRY_NAMESPACE || 'SentryLazy';
  try {
    if (window[sentryNamespace]) {
      window[sentryNamespace]?.captureEvent(opt);
    }
  } catch (e) {
    console.log(e);
  }
};

export function convertLegacyFuturesUri(uri) {
  // 使用正则从旧路径中提取 symbol，例如 /futures/trade/BTC_USDT => BTC_USDT
  // 匹配 /futures/trade/ 后面的第一个路径段（不含查询参数或 hash）
  const match = uri?.match(/^\/futures\/trade\/([^/?#]+)/);
  const symbol = match?.[1] || '';
  return `${TRADE_FUTURES_PATH}/${symbol}`;
}

/**
 * 获取合约跳转 url
 * @returns {string} 交易地址
 */
export const getFuturesUrl = (uri) => {
  if (!tenantConfig.futuresNewEntryEnabled) {
    return uri;
  }

  return convertLegacyFuturesUri(uri);
};

/**
 * 设置合约跳转来源
 */
export const setTradeSource = (url) => {
  if (url?.includes(TRADE_FUTURES_PATH)) {
    window.localStorage.setItem('trade:future:source', 'grayTest');
  }
};
