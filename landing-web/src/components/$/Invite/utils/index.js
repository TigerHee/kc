/**
 * Owner: terry@kupotech.com
 */
import qs from 'qs';
import { isEmpty } from 'lodash';
import { getIsAndroid } from 'helper';
import { APP_HOST } from 'config';
import { addLangToPath } from 'utils/lang';
import siteConfig from 'utils/siteConfig';

const { KUCOIN_HOST } = siteConfig;

export const getTop = () => {
  const isAndroid = getIsAndroid();
  return isAndroid ? 24 : 44;
};

// 返回活动主页
export const backToLottery = (
  { subject, utm_source, ...params } = {},
  { redirect = true, isInApp, appInfo } = {}
) => {
  if (!subject) return;
  const query = !isEmpty(params) ? {
    ...params
  } : {}
  if (utm_source) query.utm_source = utm_source;
  const _params = !isEmpty(query) ? `?${qs.stringify(query)}` : '';
  const host = appInfo && isInApp ? (appInfo.webHost || APP_HOST) : KUCOIN_HOST;
  const link = addLangToPath(`${host}/land/activity/${subject}${_params || ''}`);
  if (!redirect) return link;
  window.location.href = link;
};

// 
export const getLotteryShareLink = (config, params) => {
  const link = backToLottery(config, { ...params, redirect: false });
  return link;
};