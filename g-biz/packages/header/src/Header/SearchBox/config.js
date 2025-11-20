import { padStart } from 'lodash';
import storage from '@utils/storage';
import siteConfig from '../siteConfig';

/**
 * 将秒转化为 时、分、秒 三个部分
 * @param totalSeconds
 * @returns {[number,number,number,number]}
 */
export const getTimeData = (totalSeconds) => {
  const data = [0, 0, 0];
  if (!totalSeconds) {
    return data;
  }

  const day = Math.floor(totalSeconds / (60 * 60 * 24)); // 天
  totalSeconds %= 60 * 60 * 24;
  // 特殊处理，只要时分秒
  data[0] = Math.floor(totalSeconds / 3600) + day * 24; // 时
  data[0] = data[0] > 999 ? 999 : data[0];
  totalSeconds %= 3600;
  data[1] = Math.floor(totalSeconds / 60); // 分
  data[2] = totalSeconds % 60; // 秒

  data[0] = padStart(data[0], 2, '0');
  data[1] = padStart(data[1], 2, '0');
  data[2] = padStart(data[2], 2, '0');
  return data;
};

export const pushHistory = (data) => {
  const history = storage.getItem(WEB_SEARCH_KEY);
  const newHistory = history || [];
  // 删除相同的
  const someIndex = newHistory.findIndex((item) => {
    return item.type === data.type && item.showName === data.showName;
  });
  if (someIndex > -1) {
    newHistory.splice(someIndex, 1);
  }
  newHistory.unshift(data);
  newHistory.splice(5);
  storage.setItem(WEB_SEARCH_KEY, newHistory);
};

export const removeHistory = () => {
  storage.removeItem(WEB_SEARCH_KEY);
};

export const getHistory = () => {
  const history = storage.getItem(WEB_SEARCH_KEY);
  return history;
};

export const changeHistorySort = (a, b) => {
  const history = storage.getItem(WEB_SEARCH_KEY);
  [history[a], history[b]] = [history[b], history[a]];
  storage.setItem(WEB_SEARCH_KEY, history);
};

export const defaultLimitNumber = 3;

export const WEB_SEARCH_KEY = 'KC_NAV_WEB_SEARCH_KEY';

/**
 * 获取默认的earn URL(不含lang path)
 * @param webJumpUrl 地址
 * @param productCategory 类型
 */
export const getEarnUrl = ({ webJumpUrl, productCategory }) => {
  const { KUCOIN_HOST } = siteConfig;
  // url优先使用接口返回的字段
  let url = `${KUCOIN_HOST}${webJumpUrl || ''}`;
  if (productCategory === 'B2C_LENDING') {
    url = `${KUCOIN_HOST}/margin/v2/lend`;
  }
  return url;
};
