/**
 * Owner: willen@kupotech.com
 */
import { getSiteConfig } from 'kc-next/boot';
import pathToRegexp from 'path-to-regexp';
import { ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG, ACCOUNT_TRANSFER_SPECIAL_DIALOG } from './constants';

export const composeUrl = (url: string): string => {
  const siteConfig = getSiteConfig();
  if (!url || !siteConfig) return '';
  return url.startsWith('http') ? url : `${siteConfig.KUCOIN_HOST}${url}`;
};

/**
 * 获取用户迁移的biz key
 * @param {string} pathname
 * @returns string
 */
export const getAccountTransferBizKey = (pathname: string): string => {
  const key = pathToRegexp('/').test(pathname)
    ? ACCOUNT_TRANSFER_HOMEPAGE_SPECIAL_DIALOG
    : ACCOUNT_TRANSFER_SPECIAL_DIALOG;

  return key;
};

export const siteKeyMap: Record<string, string> = {
  GLOBAL: 'KuCoin',
  EUROPE: 'KuCoin EU',
  AUSTRALIA: 'KuCoin Australia',
};
