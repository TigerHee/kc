/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';

/**
 * 查询用户储蓄账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryMainAccount(baseAmount, baseCurrency) {
  return pull(`/account-front/query/main-account?baseAmount=${baseAmount || 0}&baseCurrency=${baseCurrency || 'BTC'}`);
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

export async function queryTotalAssets(baseAmount, baseCurrency) {
  return pull(`/account-front/query/total-account?baseAmount=${baseAmount || 0}&baseCurrency=${baseCurrency || 'BTC'}`);
}
export async function queryMarginAssets(baseAmount, baseCurrency) {
  return pull(`/account-front/query/margin-account?baseAmount=${baseAmount || 0}&baseCurrency=${baseCurrency || 'BTC'}`);
}
// 通过账户类型查询资产列表
export async function queryAssetsByType(params) {
  return post('/kucoin-web-front/v2/asset/accounts-by-type', params);
}
// 判断用户是否开启了某种交易类型
export async function getAccountOpenConfig(params) {
  return pull('/ucenter/is-open', params);
}

/**
 * 查询用户交易账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryTradeAccount(baseAmount, baseCurrency) {
  return pull(`/account-front/v2/query/trade-account?baseAmount=${baseAmount || 0}&baseCurrency=${baseCurrency || 'BTC'}`);
}

/**
 * 查询用户某个币种账户的冻结明细
 *
 * @param accountType // 账户类型
 * @param tag // 账户tag
 * @param currency // 币种
 * @returns {Object}
 */
export async function queryHoldDetail({ accountType, tag, currency }) {
  const query = { accountType, tag, currency };
  return post('/account-front/query/hold-detail', query);
}

/**
 * 查询储蓄账户明细
 *
 * @param bizType // 类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param page // 第几页
 * @param size // 每页条数
 * @returns {Object}
 */
export async function queryMainAccountDetail(
  { bizType, currency, direction, endAt, page = 1, size = 20, startAt }) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    page,
    size,
    startAt,
  };
  return post('/account-front/query/main-account-detail', query);
}

/**
 * 查询交易账户明细
 *
 * @param bizType // 类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param page // 第几页
 * @param size // 每页条数
 * @returns {Object}
 */
export async function queryTradeAccountDetail(
  { bizType, currency, direction, endAt, page = 1, size = 20, startAt }) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    page,
    size,
    startAt,
  };
  return post('/account-front/query/trade-account-detail', query);
}

/**
 * 导出储蓄账户明细
 *
 * @param bizType // 业务类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param page // 第几页
 * @param size // 每页条数
 * @returns {Object}
 */
export async function exportMainAccountDetail(
  { bizType, currency, direction, endAt, page = 1, size = 20, startAt }) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    page,
    size,
    startAt,
  };
  return post('/account-front/export/main-account-detail', query);
}

/**
 * 导出交易账户明细
 *
 * @param bizType // 业务类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param page // 第几页
 * @param size // 每页条数
 * @returns {Object}
 */
export async function exportTradeAccountDetail(
  { bizType, currency, direction, endAt, page = 1, size = 20, startAt }) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    page,
    size,
    startAt,
  };
  return post('/account-front/export/trade-account-detail', query);
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
 * 创建子账号
 *
 * @param   {[type]}  params  [params description]
 *
 * @return  {[type]}          [return description]
 */
export async function createSubAccount(params) {
  return post('/ucenter/sub/user/create', params);
}

/**
 * 获取子账号列表
 *
 * @return  {[type]}  [return description]
 */
export async function getSubAccountList(pagination) {
  return pull('/ucenter/sub/user/list', pagination);
}

export async function freezeSubAccount(subName = '') {
  return post('/ucenter/sub/user/freeze', { subName });
}

export async function unfreezeSubAccount(subName = '') {
  return post('/ucenter/sub/user/unfreeze', { subName });
}

export async function modifySubAccountRemark({ subName = '', remarks = '' }) {
  return post('/ucenter/sub/user/remarks/update', { subName, remarks });
}

// 获取用户的子用户的账户列表信息
export async function getSubAccountAmount({ baseAmount, baseCurrency }) {
  return pull('/account-front/query/sub-accounts', {
    baseAmount, baseCurrency,
  });
}

// 子母账号资金划转
export async function fundsTrans({ amount, currency,
  direction, subUserId, subAccountType, subTag }) {
  // console.log(amount, currency, direction, subUserId);
  return post('/account-front/sub-transfer', {
    accountType: 'MAIN',
    tag: 'DEFAULT',
    amount,
    currency,
    direction,
    subUserId,
    subAccountType,
    subTag,
  });
}

// 母账号操作子账号资金划转
export async function subInnerTrans({ amount, currency, payAccountType,
  payTag = 'DEFAULT', recAccountType, recTag = 'DEFAULT', subUserId }) {
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

// 用户手续费等级

// 获取币种提现数据
export async function getCurrencyWithdrawFee() {
  return pull('/currency/site/currencies');
}
// 获取币种
export async function getChainInfo() {
  return pull('/currency/site/currency/chain-info', { currency: 'USDT' });
}

// 获取用户手续费
export async function getCurrencyFee() {
  return pull('/trade-front/fee/tradeFee');
}

// 获取币种交易限制
export async function getSymbols() {
  return pull('/currency/site/symbols');
}
