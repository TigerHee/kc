/**
 * Owner: willen@kupotech.com
 */
import { WITHOUT_QUERY_PARAM } from '@/config/base';
import { queryPersistence } from 'gbiz-next/QueryPersistence';


export function getUtmLink(url) {
  if (typeof url !== 'string') {
    throw new TypeError('Expected argument to be a string.');
  }
  if (url === '') {
    return '';
  }
  return queryPersistence.formatUrlWithStore(url, WITHOUT_QUERY_PARAM);
}

