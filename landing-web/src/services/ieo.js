/**
 * Owner: jesse.shao@kupotech.com
 */
// import { pull, post } from 'utils/request';
import { post, pull } from 'utils/request';


const prefix = '/promotion';
/**
 * 查询
 * @param 
 * @returns {Promise<*>}
 */
 export async function query(data) {
  return pull(`${prefix}/IEO-NFT/query`, data);
}

/**
 * 提现
 * @param 
 * @returns {Promise<*>}
 */
 export async function withdraw(data) {
  return post(`${prefix}/IEO-NFT/withdraw`, data);
}
