/**
 * Owner: willen@kupotech.com
 */
import { del, post, pull, put } from 'tools/request';

export function searchMarketList(params) {
  return pull('/market-front/search', params);
}
