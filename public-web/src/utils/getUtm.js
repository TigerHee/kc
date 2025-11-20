/**
 * Owner: willen@kupotech.com
 */
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';
import { WITHOUT_QUERY_PARAM } from 'config/base';
import _ from 'lodash';
import storage from 'utils/storage';
import siteCfg from 'utils/siteConfig';

// 参数映射字段
const utmMap = {
  thirdPartClient: 'utm_source',
  utmCampaign: 'utm_campaign',
  utmMedium: 'utm_medium',
};

export function getUtmLink(url) {
  if (typeof url !== 'string') {
    throw new TypeError('Expected argument to be a string.');
  }
  if (url === '') {
    return '';
  }
  // let newUrl = url;
  // const end = newUrl.length - 1;
  // let sperator = newUrl.indexOf('?') > -1 ? '&' : '?';
  // let utmSearch = '';
  // if (newUrl[end] === '&') {
  //   newUrl = newUrl.substring(0, end);
  // }
  // const utm = getUtm();
  // _.forEach(Object.keys(utm), (v) => {
  //   if (sperator !== '?') {
  //     utmSearch = `${utmSearch}${sperator}${utmMap[v]}=${utm[v]}`;
  //   } else {
  //     utmSearch = `${sperator}${utmMap[v]}=${utm[v]}`;
  //     sperator = '&';
  //   }
  // });
  // return `${newUrl}${utmSearch}`;
  return queryPersistence.formatUrlWithStore(url, WITHOUT_QUERY_PARAM);
}

/** @deprecated 外部已经不会调用 */
export function getUtm() {
  const option = {};
  const fields = Object.keys(utmMap);
  _.forEach(fields, (v) => {
    const key = utmMap[v];
    const utm = storage.getItem(key);
    if (utm && utm !== 'undefined') {
      option[v] = utm;
    }
  });
  return option;
}

// 构造url, 避免直接拼接 query 导致的各种问题
export function getShareLink(query) {
  const u = (siteCfg.MAINSITE_HOST_COM || location.origin) + location.pathname + location.search;
  const url = new URL(u);
  if (!query) return url.href;
  Object.keys(query).forEach(key => {
    url.searchParams.set(key, query[key]);
  });
  return url.href;
}
