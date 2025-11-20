/**
 * Owner: willen@kupotech.com
 */
import { pull as originPull, post, postJson } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';
import siteConfig from 'utils/siteConfig';
// import { async } from 'q';

const { KUMEX_GATE_WAY } = siteConfig;

const pull = pullWrapper(originPull);
// setXVersion('subaccount');

/**
 * 查询用户储蓄账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryMainAccount(baseAmount, baseCurrency) {
  return pull(
    `/account-front/query/main-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}
/**
 * 查询用户高频账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryHighFrequencyAccount(baseAmount, baseCurrency) {
  return pull(
    `/account-front/query/high-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}

export async function queryTotalAssets(baseAmount, baseCurrency) {
  return pull(
    `/account-front/query/total-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}
// 通过账户类型查询资产列表
export async function queryAssetsByType(params) {
  return post('/kucoin-web-front/v2/asset/accounts-by-type', params);
}

/**
 * 查询用户交易账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryTradeAccount(baseAmount, baseCurrency) {
  return pull(
    `/account-front/v2/query/trade-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}

/**
 * @description 获取充值下拉列表币种
 * @returns {Promise<void>}
 */
export async function getDepositCoinList() {
  return pull('/account-front/query/currency-sort', { type: 'DEPOSIT' });
}

/**
 * @description 获取提币下拉列表币种
 */
export async function getWithDrawCoinList() {
  return pull('/account-front/query/currency-sort', { type: 'WITHDRAW' });
}

/**
 * 获取子账号列表
 *
 * @return  {[type]}  [return description]
 */
export async function getSubAccountList(pagination) {
  return pull('/ucenter/sub/user/list', pagination);
}

// 母账号操作子账号资金划转
export async function subInnerTrans({
  amount,
  currency,
  payAccountType,
  payTag = 'DEFAULT',
  recAccountType,
  recTag = 'DEFAULT',
  subUserId,
}) {
  return post('/account-front/sub-inner-transfer', {
    amount,
    currency,
    payAccountType,
    payTag,
    recAccountType,
    recTag,
    subUserId,
    bizType: 'TRANSFER',
    transferMode: 'MANUAL',
  });
}

// 获取币种
export async function getUserLevel() {
  return pull('/trade-front/level/getUserLevel');
}

export async function getStaking() {
  return pull('/promotion/staking/rate-of-returns');
}

// 查询用户币种余额
export async function pullAssetsAccountBalance(params) {
  return post('/account-front/balance/currencies', params);
}

// 切换默认账户
export async function updateAutoTransfer(params) {
  return post('/payment/auto-transfer/update', params);
}
