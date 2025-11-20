/**
 * Owner: borden@kupotech.com
 */
import _ from 'lodash';
import storage from 'utils/storage';
// import { formatUtmAndRcodeUrl } from '@kucoin-biz/entrance';
import { queryPersistence } from '@kc/gbiz-base/lib/QueryPersistence';

// 参数映射字段
const utmMap = {
  thirdPartClient: 'utm_source',
  utmCampaign: 'utm_campaign',
  utmMedium: 'utm_medium',
};

export function getUtmLink(url, params) {
  if (typeof url !== 'string') {
    throw new TypeError('Expected argument to be a string.');
  }
  if (url === '') {
    return '';
  }

  return queryPersistence.formatUrlWithStore(url, params);
}

/** @deprecated */
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
