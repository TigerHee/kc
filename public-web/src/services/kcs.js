/**
 * Owner: brick.fan@kupotech.com
 */
import { pull } from 'tools/request';
import siteCfg from 'utils/siteConfig';

const { MAIN_HOST } = siteCfg;

/**
 * 读取 kcs 落地页基本信息
 */
export function getProductKCSOverview() {
  return pull(`${MAIN_HOST}/_pxapi/pool-staking/kcs-staking/overview`, { with_switch: 0 });
}

/**
 * 获取指定币种的余额
 *
 * @param   {[type]}  {         [{ description]
 * @param   {[type]}  currency  币种
 * @param   {[type]}  type      MAIN: kucoin储蓄账户， POOL: 矿池账户
 * @param   {[type]}  }         [ description]}
 *
 * @return  {[type]}            [return description]
 */
export function getAccountBalance({ currency, type }) {
  return pull(`${MAIN_HOST}/_pxapi/pool-account/currency-balance`, {
    currency,
    type,
  });
}

/**
 * 获取强制kyc提示信息, 被动触发
 *
 * @export
 * @param {*} { bizType }
 * @return {*}
 */
export async function getKycConfig({ status }) {
  return pull(`${MAIN_HOST}/_api/user-dismiss/dismiss/notice/passive`, { status });
}
/**
 * 获取当前用户kyc状态
 *
 * @export
 * @return {*}
 */
export async function getKycStatus() {
  return pull(`${MAIN_HOST}/_pxapi/pool-ucenter/kyc/info`);
}

/**
 *  获取kcs权益
 *
 * @export
 * @return {*}
 */
export async function getKcsRights() {
  return pull(`${MAIN_HOST}/_pxapi/pool-staking/kcs-rights/biz-rights-configs`);
}
