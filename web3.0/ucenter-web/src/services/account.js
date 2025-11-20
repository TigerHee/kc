/**
 * Owner: willen@kupotech.com
 */
import { createSubUserUsingPost1, queryUserSubAccessUsingGet } from 'api/ucenter';
import { post, postJson, pull as originPull } from 'tools/request';
import { pullWrapper } from 'utils/pullCache';

const KUMEX_GATE_WAY = '/_api_kumex';
const ACCOUNT_FRONT = '/account-front';

const pull = pullWrapper(originPull);

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
export async function queryUserHasHighAccount() {
  return pull('/account-front/query/hf-account-exists?baseAmount');
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
  return post('/kucoin-web-front/asset/accounts-by-type', params);
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
    `/account-front/query/trade-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
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

 * @param bizType // 类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param page // 第几页
 * @param size // 每页条数
 * @returns {Object}
 */
export async function queryMainAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  page = 1,
  size = 20,
  startAt,
}) {
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
export async function queryTradeAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  page = 1,
  size = 20,
  startAt,
}) {
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
export async function exportMainAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  page = 1,
  size = 20,
  startAt,
}) {
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
export async function exportTradeAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  page = 1,
  size = 20,
  startAt,
}) {
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
 * 重置子账号登录密码
 * @param {*} params {}
 */
export async function resetPwdSubAccount(params) {
  return post('/ucenter/sub/user/reset-password', params);
}

/**
 * 重置子账号交易密码
 * @param {*} params {}
 */
export async function resetTradingPwdSubAccount(params) {
  return post('/ucenter/sub/user/reset-trading-password', params);
}

/**
 * 重置子账号两步验证
 * @param {*} params {}
 */
export async function reset2faSubAccount(params) {
  return post('/ucenter/sub/user/reset-2fa', params);
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

// 交易团队修改备注
export async function tradeTeamsModifySubAccountRemark(params) {
  return post('/ucenter/sub/user/remarks/trade-update', params);
}

// 获取用户的子用户的账户列表信息
export async function getSubAccountAmount({ baseAmount, baseCurrency = window._BASE_CURRENCY_ }) {
  return pull('/account-front/query/sub-accounts', {
    baseAmount,
    baseCurrency,
  });
}

// 子母账号资金划转
export async function fundsTrans({
  amount,
  currency,
  direction,
  subUserId,
  subAccountType,
  subTag,
}) {
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

// 用户手续费等级

// 获取用户手续费
export async function getCurrencyFee() {
  return pull('/trade-front/fee/tradeFee');
}

// 获取币种
export async function getUserLevel() {
  return pull('/trade-front/level/getUserLevel');
}

/**
 * 获取用户VIP等级
 */
export async function getUserVipInfo() {
  return pull('/ucenter/user-vip-info');
}

// 获取币种交易限制
export async function getSymbols() {
  return pull('/currency/symbols');
}

export async function getStaking() {
  return pull('/promotion/staking/rate-of-returns');
}

// 判断用户是否开启了某种交易类型
export async function getAccountOpenConfig(params) {
  return pull('/ucenter/is-open', params);
}

// 查询用户币种余额
export async function pullAssetsAccountBalance(params) {
  return post('/account-front/balance/currencies', params);
}

// 切换默认账户
export async function updateAutoTransfer(params) {
  return post('/payment/auto-transfer/update', params);
}

// 获取kumex是否能领取体验金
export async function getKumexIsBonus(params) {
  return pull(`${KUMEX_GATE_WAY}/kumex-promotion/trialFunds/check-open-contract-rewards`, params);
}

// 基于分类获取新闻列表
export async function queryNewsByCategories(params) {
  return pull('/cms/articles', params);
}

// 获取改版用户账号概览基本信息
export async function queryUserOverviewInfo() {
  return pull('/kucoin-web-front/p-center/info');
}

// 获取hot行情
export async function queryHotMarket() {
  return pull('/kucoin-web-front/p-center/hot-market');
}

// 获取hot行情 新版
export async function queryNewHotMarket() {
  // return pull('/discover-front/spl?algorithm=HOT_SEARCH&type=LIST');
  return pull('/discover-front/spl/search-item-detail?subCategory=hot_search');
}

// 获取favorites行情
export async function queryFvoriteMarket(data) {
  return pull('/kucoin-web-front/p-center/fav-market', data);
}

// 获取合约交易对历史行情
export async function queryKumexCandles(data) {
  return pull(`${KUMEX_GATE_WAY}/kumex-kline/history`, data);
}

// 获取资产概览
export async function queryAssetOverview(data) {
  return pull('/mobile-api-asset/v3/asset/overview', data);
}

export async function getSubAccountListWithAssets(params) {
  return pull('/user-biz-front/asset/sub/page', params);
}

/**
 *  查询子账户的账户资产单独接口
 */
export async function getSubAccountsAsset(params) {
  return pull('/mobile-api-asset/asset/sub/overview', params);
}

// 获取子账户数量
export async function getSubAccountTypeAmount(params) {
  return pull('/ucenter/sub/user/count', params);
}

export async function queryUserSubAccess() {
  return queryUserSubAccessUsingGet({ baseUrl: '/ucenter' });
}

// 新建子账户 - 普通子账号
export async function createSubAccountGeneral(params) {
  return createSubUserUsingPost1(params, { baseUrl: '/ucenter', meta: { isJson: true } });
  // return postJson('/ucenter/v2/sub/user/create', params);
}

// 新建子账户 - 托管子账号
export async function createSubAccountHosted(params) {
  return postJson('/ucenter/v2/kyc/sub/user/create', params);
}

// 修改子账户权限
export async function updateSubAccountPermission(params) {
  return postJson('/user-biz-front/sub/user/update/access', params);
}

// 获取子账户仓位信息
export async function getSubAccountPosition(params) {
  return pull('/user-biz-front/sub/position/info', params);
}

// 获取资金托管子账号 资金托管机构列表
export async function getOESCustodyList() {
  return pull('/oes-core/custody/list');
}

// 查询三方资金托管子账号 token 状态
export async function getOESStatus(param) {
  return pull('/oes-core/custody/user', param);
}

/**
 * 查询用户资产提示信息
 * @param types //提示信息类型,总账户统一口径：TOTAL_ASSETS, TOTAL_ASSETS_INNER
 */
export async function getUserPromptInformations({ types }) {
  return pull(`/asset-front/asset-front/getUserPromptInformations`, { types });
}

// 查询交易团队信息
export async function getTradeTeamInfoEmail(params) {
  return pull('/ucenter/sub/user/getUserAccountByUid', params);
}

// 查询交易团队信息 - 申请数量及是否被绑定后
export async function getTradeTeamBindInfo(params) {
  return pull('/ucenter/sub/hosted/count', params);
}

// 投资人申请绑定
export async function bindHostedSubAccount(params) {
  return post('/user-biz-front/sub/hosted/hosted-apply', params);
}

// 投资人撤销申请
export async function cancelBindHostedSubAccount(params) {
  return post('/ucenter/sub/user/hosted-apply-cancel', params);
}

// 投资人撤销申请
export async function unBindHostedSubAccount(params) {
  return post('/ucenter/sub/user/hosted-unBind', params);
}

// 查询交易团队 - 申请列表
export async function getHostedApplyList(params) {
  return pull('/user-biz-front/sub/hosted/user/apply/page', params);
}

// 查询交易团队 - 同意申请
export async function agreeBindToTradeTem(params) {
  return post('/ucenter/sub/user/hosted-bind', params);
}

// 查询交易团队 - 同意全部申请
export async function agreeAllBindToTradeTem(params) {
  return post('/user-biz-front/sub/user/hosted-bind/all', params);
}

// 查询交易团队 - 不同意申请
export async function disagreeBindToTradeTem(params) {
  return post('/ucenter/sub/user/hosted-apply-reject', params);
}

// 查询交易团队 - 托管子账号总资产
export async function getHostedSubAssets(params) {
  return pull('/user-biz-front/sub/hosted/user/asset/sum', params);
}

// 托管子账号开通交易
export async function openSubTrade(params) {
  return post('/user-biz-front/sub/hosted/openTrade', params);
}

/**
 * @params subUserId
 * @returns
 */
export async function queryUserHasSubHighAccount(params) {
  return pull('/user-biz-front/query/trade-hf-open/transfer-chk', params);
}

// 获取子账户登录记录
export async function getSubAccountLoginHistory(params) {
  return postJson('/ucenter/user-overview/sub/ip-records', params);
}

// 获取子账户列表，无分页
export async function getSubAccountListWithoutPage(params) {
  return pull('/ucenter/sub/users', params);
}

// 获取子账户划转记录
export async function getSubAccountTransferHistory(params) {
  return postJson('/user-biz-front/query/transfer-order/page', params);
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
    `${ACCOUNT_FRONT}/query/high-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}

// 查询子账号信息
export async function getSubUserInfo(params) {
  return pull('/ucenter/sub/user/info', params);
}

// 查询kyc状态文案
export async function getKycStatusDisplayInfo(params) {
  return pull('/user-dismiss/dismiss/kyc/status', params);
  // return pull('http://10.40.0.133:10001/mock/85/kyc/getKycDisplayInfo', params);
}

export function pullUserOverviewInfo() {
  return pull('/user-biz-front/user-overview/user-info');
}

export async function getEscrowAssets() {
  return pull('/user-dismiss-front/escrow-asset', {});
}
