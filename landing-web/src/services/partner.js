/**
 * Owner: jesse.shao@kupotech.com
 */
import { post } from 'utils/request';

/**
 * 提交信息
 *
 * @returns {Object}
 */
export async function postMessage(message) {
  return post('https://ding.kcsfile.com/partner', { message });
  // return post('http://localhost:8010/partner', { message });
}
