/**
 * Owner: willen@kupotech.com
 */
import { post, pull as originPull } from 'gbiz-next/request';
// import { async } from 'q';

const pull = originPull;
// setXVersion('subaccount');


/**
 * 查询用户高频账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryUserHasHighAccount() {
  return pull('/account-front/query/hf-account-exists?baseAmount');
}

