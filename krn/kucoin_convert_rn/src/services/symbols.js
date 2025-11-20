/**
 * Owner: willen@kupotech.com
 */
import {pull} from 'utils/request';

/**
 * 获取所有币种
 *
 * @returns {Object}
 */
export async function getCoinsCategory() {
  return pull('/currency/site/transfer-currencies', {flat: 1});
}
