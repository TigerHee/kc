/**
 * Owner: jesse.shao@kupotech.com
 */
import storage from 'utils/storage';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';


// 参数映射字段
const utmMap = {
  thirdPartClient: 'utm_source',
  utmCampaign: 'utm_campaign',
  utmMedium: 'utm_medium',
};

// const formatUtmAndRcodeUrl = queryPersistence.formatUrlWithStore;


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
  return queryPersistence.formatUrlWithStore(url);
}

/** @deprecated 外部已经不会调用 */
// export function getUtm() {
//   const option = {};
//   const fields = Object.keys(utmMap);
//   _.forEach(fields, (v) => {
//     const key = utmMap[v];
//     const utm = storage.getItem(key);
//     if (utm && utm !== 'undefined') {
//       option[v] = utm;
//     }
//   });
//   return option;
// }
