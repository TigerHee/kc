/**
 * Owner: willen@kupotech.com
 */

import pathToRegexp from 'path-to-regexp';
import {
  ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG,
  ACCOUNT_TRANSFER_SPECIAL_DIALOG,
} from './constants';

export const composeUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `${siteConfig.KUCOIN_HOST}${url}`;
};

const siteConfig = window._WEB_RELATION_ || {};

/**
 * 获取用户迁移的biz key
 * @param {string} pathname
 * @returns string
 */
export const getAccountTransferBizKey = (pathname) => {
  const key = pathToRegexp('/').test(pathname)
    ? ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG
    : ACCOUNT_TRANSFER_SPECIAL_DIALOG;

  return key;
};

export const siteKeyMap = {
  GLOBAL: 'KuCoin',
  EUROPE: 'KuCoin Europe',
  AUSTRALIA: 'KuCoin Australia',
};
