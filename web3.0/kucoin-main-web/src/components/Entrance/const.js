/**
 * Owner: willen@kupotech.com
 */
import storage from 'utils/storage';

// 未迁移用户在谷歌不可用时跳转链接不一样
export const G2FALinks = {
  zh_CN: 'https://support.kucoin.plus/hc/zh-cn/requests/new',
  en_US: 'https://support.kucoin.plus/hc/en-us/requests/new',
  default: 'https://support.kucoin.plus/hc/en-us/requests/new',
};

export const $loginKey = storage.getItem('login_key');
