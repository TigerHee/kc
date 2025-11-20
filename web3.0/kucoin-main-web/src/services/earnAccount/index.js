/**
 * Owner: willen@kupotech.com
 */
import config from 'config';
import _ from 'lodash';
import { del, post, postJson, pull, put } from 'tools/request';

const { v2ApiHosts } = config;
const { POOLX } = v2ApiHosts;
/**
 * 关于资产明细、收益明细筛选项
 * filter_type：筛选类型 ASSET:资产明细、收益明细筛选项
 */
export async function getFilterList(params) {
  return pull(`${POOLX}/pool-staking/v3/filter-list`, params);
}

/**
 * poolx总资产明细列表 - app资金明细和收益明细，web资产明细同一个接口
 * page
 * pageSize
 * productCategory
 * startAt
 * endAt
 */
export async function getAssetsTable(params) {
  return pull(`${POOLX}/pool-account/v3/detail-assets`, params);
}

/**
 * 资产概览
 */
export async function getAssetsOverview(params) {
  return pull(`${POOLX}/pool-account/v4/assets-overview`, params);
}

/**
 * 持仓产品列表
 * @param {string} with_coupon_income 是否返回优惠劵信息 1 是 0 否
 */
export async function getStakingAssetsList(params) {
  return pull(`${POOLX}/pool-account/v3/hold-assets`, {
    with_coupon_income: '1',
    ...params,
  });
}

/**
 * 获取Pool-X币种列表
 */
export async function getCurrencies({ with_btc = 1, nft }) {
  return pull(`${POOLX}/pool-currency/currencies`, { with_btc, nft });
}

/**
 * 产品种类列表-对应账户首页的tabs
 * with_hold_count     是否需要持仓的数量:1是，0否
 * client     客户端 	Default value : WEB
 * currency  货币类型
 */
export async function getAssetCategory(params) {
  return pull(`${POOLX}/pool-account/v3/asset-category`, params);
}

/**
 * 解锁
 *
 * @param   {[type]}  {         [{ description]
 * @param   {[type]}  password  [password description]
 * @param   {[type]}  lock_id   [lock_id description]
 * @param   {[type]}  amount    [amount description]
 * @param   {[type]}  }         [ description]}
 *
 * @return  {[type]}            [return description]
 */
export function unlock({ password, lock_id, amount }) {
  return del(`${POOLX}/pool-staking/v3/locks`, {
    password,
    lock_id,
    amount: `${amount}`,
  });
}

/**
 * pool获取pol明细列表 - 获取用户pol资产列表
 * page
 * pageSize
 * productCategory
 * side
 * startAt
 * endAt
 * currency
 * bizType
 */
export async function getUserPolDetail(params) {
  return pull(`${POOLX}/pool-account/v3/user-pol-detail`, params);
}

/**
 * 获取用户pol资产
 */
export async function getUserPol(params) {
  return pull(`${POOLX}/pool-account/v3/user-pol`, params);
}

// /**
//  * pool获取获取订单历史列表
//  * page
//  * pageSize
//  * productCategory
//  * side
//  * startAt
//  * endAt
//  * currency
//  * bizType
//  */
// export async function getOrderHistory(params) {
//   return pull(`${POOLX}/pool-account/v3/hold-order-history`, params);
// }

/**
 * pool-x 获取赚币订单列表
 * page
 * pageSize
 * category
 * side
 * start_at
 * end_at
 * currency
 * bizType
 * order_status
 */
export async function getOrderHistory(params) {
  return pull(`${POOLX}/pool-account/v3/orders`, params);
}

/**
 * @description 检验需要验证的类型
 * @param bizType
 * @return {Promise<*>}
 */
export async function checkValidations(params) {
  return pull(`/ucenter/check-required-validations`, { ...params, seq: 1 });
}

/**
 * 校验
 * @param data
 * @returns {Promise<*>}
 */
export async function verify(data) {
  return post(`${POOLX}/ucenter/verify-validation-code`, data);
}

/**
 * 活期赚币七日年化数据，走势图.
 *
 * @export
 * @param { type='SAVING',days='7' }
 * @return []
 */
export async function pullAprsChartData({ id, params }) {
  return pull(`${POOLX}/pool-staking/v3/products/demands/${id}/hour-aprs`, { ...params });
}

/**
 * 年化走势图，按天.
 *
 * @export
 * @param { type='' }
 * @return []
 */
export function pullDayAprsChartData({ id, params }) {
  return pull(`${POOLX}/pool-staking/v2/products/demands/${id}/7d-aprs`, { ...params });
}

/**
 * 持仓产品详情
 */
export async function getAssetDetail({ id, with_coupon_income = '1' }) {
  return pull(`${POOLX}/pool-account/v3/hold-asset-detail`, { id, with_coupon_income });
}

/**
 * 获取支持賺币币种
 */
export async function getEarnCurrencies() {
  return pull(`${POOLX}/pool-staking/v3/earn/currencies`);
}

/**
 * pool-x 获取双币赚币订单列表
 * page
 * pageSize
 * category
 * side
 * start_at
 * end_at
 * currency
 * bizType
 * order_status
 */
export async function getDualOrderHistory(params) {
  return pull(`${POOLX}/dual-investment/v1/orders/earn`, { ...params, category: 'DUAL' });
}

/**
 * poolx总资产明细列表--dual查询双币账户明细
 * page
 * pageSize
 * productCategory
 * startAt
 * endAt
 */
export async function getDualAssetsTable(params) {
  return pull(`${POOLX}/dual-investment/v1/detail-assets`, params);
}

/**
 * 获取双币赢订单详情 OrderId
 * @param {*} params
 */
export async function getDualDetail(params = {}) {
  return pull(`${POOLX}/dual-investment/v1/orders/detail`, params);
}

/**
 * /v1/incomes  收益列表
 * page
 * pageSize
 * product_category
 * type   收益类型：LOCK_INCOME 锁仓利息收益,POL_INCOME，POL收益，LOCKDROP 锁仓空投收益，DUAL_INCOME 双币收益，COUPON_INCOME 优惠券收益
 * startAt
 * endAt
 */
export async function getEarnIncomes(params) {
  return pull(`${POOLX}/pool-aggs/v1/incomes`, params);
}

/**
 * 聚合接口
 * /v1/common/select-options下拉框选项
 * account_bill 资金明细,income 收益明细,pol_income POL收益明细,order_tx 订单明细
 */
export async function getCommomSelectOptions(params) {
  return pull(`${POOLX}/pool-aggs/v1/common/select-options`, params);
}

/**
 *  聚合接口
 * /v1/order-txs 订单流水列表
 * page
 * pageSize
 * category
 * side
 * start_at
 * end_at
 * currency
 * bizType
 * order_status
 */
export async function getOrderTxs(params) {
  return pull(`${POOLX}/pool-aggs/v1/order-txs`, params);
}

/**
 * 持仓产品列表
 * /v1/hold-assets当前持有列表
 * @param {number} page
 * @param {number} pageSize
 * @param {string} product_category
 * @param {number} duration  -1定期 0活期
 * @param {string} currency
 */
export async function getHoldAssets({ page, pageSize, product_category, duration, currency }) {
  return pull(`${POOLX}/pool-aggs/v2/hold-assets`, {
    page,
    pageSize,
    product_category,
    duration,
    currency,
  });
}

/**
 * 账户资金流水列表
 * /v1/order-txs 订单流水列表
 * page
 * pageSize
 * product_category
 * start_at
 * end_at
 * currency
 * biz_type
 */
export async function getAccountBills(params) {
  return pull(`${POOLX}/pool-aggs/v1/account-bills`, params);
}
/**
 * 修改复投策略
 *
 * @export
 * @param {*} {reInvestPayload, orderId}
 * @return {*}
 */
export async function putReInvestInfo({ orderId, ...reInvestPayload }) {
  return put(
    `${POOLX}/struct-main/v1/orders/${orderId}/reinvestments`,
    reInvestPayload,
    false,
    true,
  );
}
/**
 * /v1/his-hold-assets历史持有列表
 * @param {number} page
 * @param {number} pageSize
 * @param {string} product_category
 * @param {string} currency
 * @param {number} duration  -1定期 0活期
 */
export async function getHisHoldAssets({ page, pageSize, product_category, duration, currency }) {
  return pull(`${POOLX}/pool-aggs/v1/his-hold-assets`, {
    page,
    pageSize,
    product_category,
    duration,
    invest_currency: currency,
  });
}

/**
 * 获取结构化产品订单详情 OrderId
 * @param {*} params
 */
export async function getStructDetail(params = {}) {
  return pull(`${POOLX}/struct-main/v1/orders/detail`, params);
}

/**
 * 获取指数价格
 * underlying BTC-USD-INDEX
 * precision default 8
 *
 * @export
 * @param {*} { underlying, precision }
 * @return {*}
 */
export async function pullIndexPrice({ underlying, precision, supplier }) {
  return pull(`${POOLX}/struct-main/v1/underlying/price`, { underlying, precision, supplier });
}

/**
 * 修改自动复投
 *
 * @param {*} { orderId, reinvestmentSwitch }
 * @return {*}
 */
export const toggleReinvestmentSwitch = ({ orderId, reinvestmentSwitch }) => {
  return put(
    `${POOLX}/struct-main/v1/orders/${orderId}/reinvestments`,
    {
      reinvestmentSwitch,
    },
    false,
    true,
  );
};

/**
 * 查询雪球|双币｜鲨鱼鳍订单自动复投是否开启
 */
/**
 * 查询双向盈｜合约宝 订单自动复投是否开启
 */
export async function getStructStatus(orderIdList) {
  return pull(`${POOLX}/struct-main/v1/orders/switch/batch?orderIdList=${orderIdList.join(',')}`);
}

/**
 * 提前赎回概览
 */
export async function getEarlyRedeemOverview(orderId) {
  return pull(`${POOLX}/struct-main/v1/order/${orderId}/early-redemption/overview`);
}

/**
 * 提前赎回确认
 */
export async function earlyRedeem(orderId, pricingID) {
  return post(
    `${POOLX}/struct-main/v1/order/early-redemption`,
    {
      orderId,
      pricingID,
    },
    false,
    true,
  );
}
/**
 * 
赚币分析
 */
export function getAnalysis(params) {
  return pull(`${POOLX}/pool-aggs/v1/assets-analysis`, params);
}

/*
 *  eth2 staking overview
 *
 * */
export function getOverview(params) {
  return pull(`${POOLX}/pool-staking/currency-exchanges/overview`, params);
}

/*
 *  根据币种聚合的产品
 *
 * */
export function getProdByCurrency(params) {
  return pull(`${POOLX}/pool-aggs/v1/hold-currencies/assets`, params);
}

/*
 *  获取当前资产统计
 *
 * */
export function getCategoryCount(params) {
  return pull(`${POOLX}/pool-aggs/v1/hold-categories/count`, params);
}

/**
 *
 * 以下3个自动赚币
 */
export function getAutoEarnProducts(params) {
  return pull(`${POOLX}/pool-staking/v4/low-risk/products`, params);
}

export function changeAutoEarnStatus(params) {
  return postJson(`${POOLX}/pool-staking/v4/products/auto-lock`, params);
}

export function getAutoEarnYearIncome(params) {
  return pull(`${POOLX}/pool-staking/v4/products/auto-earn/year-income`, params);
}

export function getAutoEarnStatus(params) {
  return pull(`${POOLX}/pool-staking/v4/user-auto-lock`, params);
}

/**
 * 获取 借贷，历史持有（已结算订单）
 *
 * @export
 * @return {*}
 */
export function getLoanSettleList({ page, start_at, end_at, product_category, ...params }) {
  return pull('/loan-b2c/outer/settle/purchase-order', {
    currentPage: page,
    startTime: start_at,
    endTime: end_at,
    ...params,
  });
}
/**
 * 资金流水接口
 *
 * @export
 * @param {*} { page, ...params }
 * @return {*}
 */
export function getLoanTradeFlowList({
  page,
  biz_type,
  startAt,
  endAt,
  product_category,
  ...params
}) {
  return pull('/loan-b2c/outer/trade-flow', {
    ...params,
    currentPage: page,
    bizType: biz_type,
    // fromTime: startAt,
    // toTime: endAt,
  });
}
export function getLendingDetail(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return pull('/loan-b2c/outer/purchase-order', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}
export function getLendCurrentApr(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return pull('/loan-b2c/outer/interest-trend', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}
export function editLend(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return postJson('/loan-b2c/outer/change-rate', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}

export function getLendMaxRedeem(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return pull('/loan-b2c/outer/remain-redeem-amount', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}
export function getLend24Redeem(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return pull('/loan-b2c/outer/redeem/left24HRedeemAmount', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}

export function handleLendRedeem(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return postJson('/loan-b2c/outer/redeem', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}

export function getLendEditMaxAndMin(params) {
  const { userId } = params;
  const _params = _.omit(params, ['userId']);
  return pull('/loan-b2c/outer/condition-currencies', _params, {
    options: {
      headers: {
        'X-USER-ID': userId,
      },
    },
  });
}

/**
 * 获取可交易的法币
 *
 * @export
 * @param {*} { platform = 'KUCOIN', version = 'v2' }
 * @return {*}
 */
export function pullPaymentCoins({ platform = 'KUCOIN', version = 'v2' }) {
  return pull(`/_api/payment-api/pmtapi/v1/symbols`, { platform, version });
}

export function getEth2Config(params = {}) {
  return pull(`${POOLX}/pool-staking/currency-exchanges`, params);
}
