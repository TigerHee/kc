import { queryPersistence } from 'tools/base/QueryPersistence';
import { WITHOUT_QUERY_PARAM } from '../config';

export function getUtmLink(url) {
  if (typeof url !== 'string') {
    throw new TypeError('Expected argument to be a string.');
  }
  if (url === '') {
    return '';
  }
  return queryPersistence.formatUrlWithStore(url, WITHOUT_QUERY_PARAM);
}
