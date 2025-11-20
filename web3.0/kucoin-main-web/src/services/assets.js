/**
 * Owner: willen@kupotech.com
 */
import qs from 'query-string';
import { pull, post, postJson } from 'tools/request';

const prefix = '/payment';
const ACCOUNT_FRONT = '/account-front';
const SNAPSHOT = '/snapshot';
const COOPERATION = '/cooperation';
const PAYMIR = '/fiat';
const PROFIT = '/user-biz-front';
const ASSET_FRONT = '/asset-front';
const ASSET_ANALYSIS = '/asset-analysis';
const PAYMENT_INVOICE = '/payment-invoice';

/**
 * 查询用户资产提示信息
 * @param types //提示信息类型,总账户统一口径：TOTAL_ASSETS, TOTAL_ASSETS_INNER
 */

export async function getUserPromptInformations({ types }) {
  return pull(`${ASSET_FRONT}/asset-front/getUserPromptInformations`, { types });
}

const _prefix = '/account-biz-front';
// 资产归集
export const imputation = (params) => {
  return postJson(`${_prefix}/account/imputation`, params);
};

/**
 * 查询用户欠款账户信息
 * @param baseCurrency
 */
export async function getArrears({ baseCurrency }) {
  return pull(`${prefix}/deposit/rollback/arrears`, { baseCurrency });
}

/**
 * 查询用户锁定资产
 */
export async function getLockAmount() {
  return pull(`${prefix}/lock-amount`);
}

/**
 * 查询用户充值回滚列表
 * @param arrears
 */
export async function getRollBackList({ arrears } = {}) {
  return pull(`${prefix}/deposit/rollback/list`, { arrears });
}

/**
 *用户获取充值列表
 * @param arg
 * @return {Promise<*>}
 */
export async function getDepositList(arg) {
  return pull(`${prefix}/deposit/list`, { ...arg, version: 3 }); // 添加ROLLBACKING、ROLLBACK状态支持 //添加PRE_SUCCESS
}

/**
 * @description 用户获取最近充值资产列表
 * @return {Promise<*>}
 */
export async function getRecentDepositList() {
  return pull(`${prefix}/deposit/recent-currency-list`);
}

/**
 * @description 获取充值地址
 * @param arg
 * @return {Promise<*>}
 */
export async function getAddress(arg) {
  return pull(`${prefix}/deposit-address/get`, arg);
}

/**
 * @description 获取充值地址列表
 * @param arg
 * @return {Promise<*>}
 */

export async function getAddressList(arg) {
  return pull(`${prefix}/deposit-address/list`, arg);
}

/**
 * @description 查询用户支持的账户列表
 * @param arg
 * @return {Promise<*>}
 */

export async function getAccountList(arg) {
  return pull(`${prefix}/ordinary-sub-user/list`, arg);
}

/**
 * @description 查询用户子账户支持的账户列表
 * @param arg
 * @return {Promise<*>}
 */

export async function getSubAccountList(arg) {
  return pull(`${prefix}/user-account/list`, arg);
}

/**
 * @description  获取用户提币记录
 * @param arg
 * @return {Promise<*>}
 */
export async function getWithDrawRecord(arg) {
  return pull(`${prefix}/withdraw/list/v2`, arg);
}

/**
 *@description 充值手续费
 * @param arg
 * @return {Promise<*>}
 */
export async function getDepositFee(arg) {
  return pull(`${prefix}/fee/rule`, arg);
}

/**
 *@description 更新充值地址
 * @param arg
 * @return {Promise<*>}
 */
export async function updateAddress(arg) {
  return post(`${prefix}/deposit-address/update`, arg);
}

/**
 *@description 更新默认充值地址
 * @param arg
 * @return {Promise<*>}
 */

export async function updateDefaultAddress(arg) {
  return post(`${prefix}/v2/deposit-address/update`, arg);
}

/**
 * @description 添加充值地址
 * @param arg
 * @return {Promise<*>}
 */
export async function addAddress(arg) {
  return post(`${prefix}/deposit-address/add`, arg);
}

/**
 * @description 查询资金划转记录
 * @param arg
 * @return {Promise<*>}
 */
export async function pullTransferHistory({ startAt, endAt, ...restParams }) {
  const params = { ...restParams };
  if (startAt) {
    params.startAt = startAt;
  }
  if (endAt) {
    params.endAt = endAt;
  }
  return post(`${ACCOUNT_FRONT}/query/transfer-record`, params);
}

/**
 * 用户间转账
 *
 * @param arg {
 *  amount // 交易金额
 *  bizType // 业务类型
 *  currency // 币种
 *  payAccountType // 付款账户类型
 *  payTag // 付款子账号类型
 *  recAccountType // 收款账户类型
 *  recTag // 收款子账号类型
 *  subBizType // 子业务类型
 *  transferMode // 转账方式
 *  }
 * @returns {Promise<*>}
 */
export async function selfTransfer(arg) {
  return post('/account-biz-front/self-transfer', arg);
}

/**
 * 向外部转账，目前用于kumex
 *
 * @param arg {
 *  amount // 交易金额
 *  bizType // 业务类型
 *  currency // 币种
 *  payAccountType // 付款账户类型
 *  payTag // 付款子账号类型
 *  recAccountType // 收款账户类型
 *  recTag // 收款子账号类型
 *  subBizType // 子业务类型
 *  transferMode // 转账方式
 *  }
 * @returns {Promise<*>}
 */
export async function outTransfer(arg) {
  return post(`${ACCOUNT_FRONT}/out-transfer`, arg);
}

/**
 * @description 获取用户资产走势图
 * @param accountType
 * @param endDate
 * @param startDate
 * @param targetCurrency
 * @return {Promise<*>}
 */
export async function getUserDailyTrend({ accountType, endDate, startDate, targetCurrency }) {
  return pull(`${SNAPSHOT}/get-user-balance`, { accountType, endDate, startDate, targetCurrency });
}

/**
 *@description 查询用户账户的资产排名
 * @param baseCurrency
 * @param size
 * @return {Promise<*>}
 */
export async function getUserBlanceRank({ baseCurrency, size }) {
  return pull(`${ACCOUNT_FRONT}/query/scale-balance`, { baseCurrency, size });
}

/**
 * @description 查询用户账户的总资产
 * @param baseCurrency
 * @return {Promise<*>}
 */
export async function getUserTotalBlance({ baseCurrency }) {
  return pull(`${ACCOUNT_FRONT}/query/total-balance`, { baseCurrency });
}

/**
 * @description 查询用户单个currency指定accountType、tag的账户信息
 * @param transFerAccountType
 * @param currency
 * @param tag
 * @return {Promise<*>}
 */
export async function getUserSingleBlance({ transFerAccountType, currency, tag = 'DEFAULT' }) {
  return post(`${ACCOUNT_FRONT}/query/currency-balance`, {
    accountType: transFerAccountType,
    currency,
    tag,
  });
}
/**
 * 查询用户储蓄账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryMainAccount(baseAmount, baseCurrency) {
  return pull(
    `${ACCOUNT_FRONT}/query/main-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
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
    `${ACCOUNT_FRONT}/v2/query/trade-account?baseAmount=${baseAmount || 0}&baseCurrency=${
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
    `${ACCOUNT_FRONT}/query/high-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}

/**
 * 查询用户杠杆账户所有币种的余额
 *
 * @param baseAmount // (隐藏小额资产) 隐藏数量
 * @param baseCurrency // (隐藏小额资产) 隐藏币种
 * @returns {Object}
 */
export async function queryMarginAccount(baseAmount, baseCurrency) {
  return pull(
    `${ACCOUNT_FRONT}/query/margin-account?baseAmount=${baseAmount || 0}&baseCurrency=${
      baseCurrency || 'BTC'
    }`,
  );
}

// 根据账户类型查询账户明细
export async function queryAccountDetail(params) {
  return post(`${ACCOUNT_FRONT}/query/account-detail-by-type`, params);
}

/**
 * 导出账户明细
 *
 * @param bizType // 业务类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @returns {Object}
 */
export async function exportAccountDetail(params) {
  return post(`${ACCOUNT_FRONT}/export/account-detail-by-type`, params);
}

/**
 * 查询用户账户的总资产
 *
 * @param baseCurrency // 转换的目标币种
 * @returns {Object}
 */
export async function queryTotalBalance({ baseCurrency = 'USDT' }) {
  return pull(`${ACCOUNT_FRONT}/query/total-balance?baseCurrency=${baseCurrency}`);
}

/**
 * 查询业务类型
 *
 * @param type // 业务类型集编码: MAIN-储蓄账户业务类型，TRADE-交易账户业务类型，WELFARE-福利业务类型
 * @returns {Object}
 */
export async function queryBizType({ type = 'MAIN' }) {
  return pull(`${ACCOUNT_FRONT}/query/biz-type?type=${type}`);
}

/**
 * 检查用户IP是否显示信用卡买币入口
 * @returns {Object}
 */
export async function checkIp() {
  return pull(`${COOPERATION}/simplex/ip`);
}

/**
 * 查询数字货币列表
 * @returns {Object}
 */
export async function qureyCurrencies(query) {
  return pull(`${COOPERATION}/simplex/currencies`, query);
}

/**
 * 查询simplex信息
 * @param amount            // 请求的货币（法币或者数字货币）的数量
 * @param requestedCurrency // 请求的货币（法币或者数字货币）
 * @param digitalCurrency   // 购买的数字货币
 * @param fiatCurrency      // 支付的法币
 * @returns {Object}
 */
export async function qureySimplexQuote(query) {
  return pull(`${COOPERATION}/simplex/quote`, query);
}

/**
 * 信用卡买币
 * @param digitalAmount     // 数字货币数量
 * @param digitalCurrency   // 数字货币种类
 * @param fiatCurrency      // 法币种类
 * @param fiatTotalAmount   // 购买digitalAmount个数字货币所需要的总金额(包括手续费)
 * @param quoteId           // 报价id
 * @param fiatTotalAmount   // 随机生成的用户id
 * @returns {Object}
 */
export async function simplexOrder(query) {
  return post(`${COOPERATION}/simplex/order`, query);
}

/**
 * 导出充值记录
 *
 * @param version // 导出版本(1 - v1的充提记录，2 - v2的充提记录)
 * @param status // 状态 （PROCESSING, SUCCESS, FAILURE）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param currentPage // 第几页
 * @param pageSize // 每页条数
 * @returns {Object}
 */
export async function exportCoinInRecord(query) {
  return post(`${prefix}/deposit/export-apply`, query);
}

/**
 * 导出提现记录
 *
 * @param version // 导出版本(1 - v1的充提记录，2 - v2的充提记录)
 * @param status // 状态 （PROCESSING, SUCCESS, FAILURE）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @param currentPage // 第几页
 * @param pageSize // 每页条数
 * @returns {Object}
 */
export async function exportCoinOutRecord(query) {
  return post(`${prefix}/withdraw/export-apply`, query);
}
// 获取资金概览数据
export async function getAssetDetail(query) {
  return pull('/kucoin-web-front/asset/overview', query);
}
// 获取资金概览数据
export async function getAssetDetail2(query) {
  return pull('/kucoin-web-front/v3/asset/overview', query);
}
// 更新子账号资产显示开关
export async function updateSwitchSubAssets(query) {
  return post('/ucenter/sub/show-sub-account-balance/save', query);
}
// 查询用户主账户资产
export async function getMainAccountAssets(query) {
  return pull('/kucoin-web-front/v2/asset/main-account-assets', query);
}

// 查询用户全仓杠杆账户资产
export async function getMarginAccountAssets(query) {
  return pull('/margin-position/position/detail', query);
}
// 查询用户逐仓杠杆账户资产
export async function getIsolatedAccountAssets(query) {
  return pull('/margin-isolated-position/assets/positions', query);
}

/**
 * 检测用户是否已经确认过锁仓提示
 *
 * @return  {[type]}  [return description]
 */
export async function checkIsLockConfirmed() {
  return pull('/payment/lock/is-confirm');
}

/**
 * 用户确认锁仓选择
 *
 * @param   {[type]}  isContinue  [isContinue description]
 *
 * @return  {[type]}              [return description]
 */
export async function confirmWalletLock(isContinue) {
  return post('/payment/lock/confirm', {
    status: isContinue,
  });
}

/**
 * 信用卡买币 获取初始页面数据（币种列表、法币列表）
 *
 * @param  client string    banxa ...
 *
 * @return  {[type]}              [return description]
 */
export async function queryCreditCardCurrencies({ client, domainId }) {
  return pull(`${COOPERATION}/fiat-crypto/currencies?client=${client}&domainId=${domainId}`);
}

/**
 * 信用卡买币 获取支付渠道
 *
 * @param client     string    banxa ...
 * @param crypto     string    数字货币
 * @param fiat       string    法币
 * @param orderSide  string    交易方向
 *
 * @return  {[type]}              [return description]
 */
export async function queryCreditCardPayChannel(query) {
  return pull(`${COOPERATION}/fiat-crypto/payChannel`, {
    ...query,
  });
}

/**
 * 信用卡买币 获取币种报价
 *
 * @param client          string    banxa ...
 * @param crypto          string    数字货币
 * @param cryptoAmount    number    数字货币数量
 * @param fiat            string    法币
 * @param fiatAmount      number    法币数量
 * @param orderSide       string    交易方向
 * @param payChannelCode  string    支付渠道Code
 * @param payChannelId    string    支付渠道Id
 *
 * @return  {[type]}              [return description]
 */
export async function queryCreditCardPrice(query) {
  return pull(`${COOPERATION}/fiat-crypto/price`, {
    ...query,
  });
}

/**
 * 信用卡买币 获取用户订单列表
 *
 * @param client          string    banxa ...
 * @param page            number    current page
 * @param pageSize        number    page size,max:500,min:1
 *
 * @return  {[type]}              [return description]
 */
export async function queryCreditCardOrderList(query) {
  return pull(`${COOPERATION}/fiat-crypto/order/list`, {
    ...query,
  });
}

/**
 * 信用卡买币 创建订单
 * @param client          string    banxa ...
 * @param crypto          string    数字货币
 * @param cryptoAmount    number    数字货币数量
 * @param fiat            string    法币
 * @param fiatAmount      number    法币数量
 * @param orderSide       string    交易方向
 * @param payChannelId    string    支付渠道Id
 * @returns {Object}
 */
export async function creditCardOrder(query) {
  return post(`${COOPERATION}/fiat-crypto/order`, query);
}

/**
 * 信用卡买币 是否展示页面
 * @param client          string    banxa ...
 * @returns {Object}
 */
export async function qureyDisplayStatus({ client }) {
  return pull(`${COOPERATION}/fiat-crypto/display`, { client });
}

/**
 * 查询Simplex数字货币限制列表
 * @returns {Object}
 */
export async function qureyCurrenciesSupported(query) {
  return pull(`${COOPERATION}/fiat/currencies/supported`, query);
}

/**
 * paymir查询数字货币列表
 * @returns {Object}
 */
export async function qureyCurrenciesPaymir(query) {
  return pull(`${PAYMIR}/currencies`, query);
}

/**
 * 查询Paymir数字货币限制列表
 * @returns {Object}
 */
export async function qureyCurrenciesSupportedPaymir(query) {
  return pull(`${PAYMIR}/currencies/supported`, query);
}

/**
 * 查询paymir信息
 * @param amount            // 请求的货币（法币或者数字货币）的数量
 * @param requestedCurrency // 请求的货币（法币或者数字货币）
 * @param digitalCurrency   // 购买的数字货币
 * @param fiatCurrency      // 支付的法币
 * @returns {Object}
 */
export async function qureyPaymirQuote(query) {
  return pull(`${PAYMIR}/quote`, query);
}

/**
 * paymir买币
 * @param digitalAmount     // 数字货币数量
 * @param digitalCurrency   // 数字货币种类
 * @param fiatCurrency      // 法币种类
 * @param fiatTotalAmount   // 购买digitalAmount个数字货币所需要的总金额(包括手续费)
 * @param quoteId           // 报价id
 * @param fiatTotalAmount   // 随机生成的用户id
 * @param source paymir
 * @returns {Object}
 */
export async function createOrderPaymir(query) {
  return post(`${PAYMIR}/create/order`, query);
}

/**
 * 信用卡买币 Paymir 获取用户订单列表
 *
 * @param client          string    banxa ...
 * @param page            number    current page
 * @param pageSize        number    page size,max:500,min:1
 *
 * @return  {[type]}              [return description]
 */
export async function queryCreditCardOrderListPaymir(query) {
  return pull(`${PAYMIR}/order/list`, {
    ...query,
  });
}

/** 获取可兑换的渣渣币列表 */
export async function fetchRedeemableList() {
  return pull(`${ACCOUNT_FRONT}/one-click-exchange/redeemable-list`);
}

/** 一键兑换渣渣币 */
export async function handleConvertCKS(params) {
  return post(`${ACCOUNT_FRONT}/one-click-exchange/exchange`, params);
}

/** 获取渣渣币历史兑换记录 */
export async function fetchHistoryList(params) {
  return pull(`${ACCOUNT_FRONT}/one-click-exchange/exchange-history`, params);
}

/** 获取渣渣币兑换明细 */
export async function fetchConvertDetail(params) {
  return pull(`${ACCOUNT_FRONT}/one-click-exchange/exchange-details`, params);
}
/** 获取小额资产兑换KCS配置 */
export const fetchSmallExchangeConfig = (params = {}) => {
  return pull(`${ACCOUNT_FRONT}/small-exchange/config`, params);
};
/** 获取盈亏分析- 资产分布 */
export async function getProfitAssetsLayout(params = {}) {
  return pull(`${PROFIT}/break-even/assets-layout`, params);
}
/** 获取盈亏分析- 收益相关 */
export async function getProfitEarnings(params = {}) {
  return pull(`${PROFIT}/break-even/earnings`, params);
}
/** 获取盈亏分析- 最小查询日期 */
export async function getProfitMinDay(params = {}) {
  return pull(`${PROFIT}/break-even/min-day`, params);
}
/** 获取盈亏分析- 盈亏总览 */
export async function getProfitOverview(params = {}) {
  return pull(`${PROFIT}/break-even/overview`, params);
}

// 获取资金概览数据
export async function getAssetDetailV2(query) {
  return pull('/kucoin-web-front/v2/asset/overview', query);
}

/**
 * 查询充值最高的6条搜索币种
 * @param {*} params
 * @returns
 */
export async function getDepositHotCurrency(params) {
  return pull(`${ASSET_FRONT}/deposit/top/currency`, params);
}

/**
 * 添加搜索币种
 * @param {*} params
 * @returns
 */
export async function addSearchRecord(params) {
  return post(`${ASSET_FRONT}/user/search/record/add`, params, false, true);
}

/**
 * 删除搜索币种
 * @param {*} params
 * @returns
 */
export async function delSearchRecord(params) {
  return post(`${ASSET_FRONT}/user/search/record/delete`, params, false, true);
}

/**
 * 查询搜索币种记录
 * @param {*} params
 * @returns
 */
export async function getSearchRecord(params) {
  return pull(`${ASSET_FRONT}/user/search/record/get`, params);
}

/**
 * 查询支持可订阅的币种/币链
 */
export async function getSubScriptionList(params) {
  return pull(`${ASSET_FRONT}/payment-subscription/service-available/supported-list`, params);
}

/**
 * 用户在充提业务选择币种、币链过程中，如果对应币种、币链处于关闭充提且打开订阅时，用户可以点击订阅按钮对充提业务开启进行订阅
 * @param {*} params
 * @returns
 */
export async function subscribeNotice(params) {
  const strParams = qs.stringify(params);
  return post(`${ASSET_FRONT}/payment-subscription/service-available/subscribe?${strParams}`);
}

/**
 * 用户在充提业务选择币种、币链过程中，如果用户已经订阅了充提业务开启消息通知，可以点击按钮取消订阅。
 * @param {*} params
 * @returns
 */
export async function unsubscribeNotice(params) {
  const strParams = qs.stringify(params);
  return post(`${ASSET_FRONT}/payment-subscription/service-available/unsubscribe?${strParams}`);
}

/**
 * /gray-released 查询当前用户指定应用灰度结果
 * @param {*} params
 */
export async function assetGrayReleased(params) {
  return pull(`${ASSET_FRONT}/asset-front/gray-released`, params);
}

/**
 * 币链列表 在currency服务chain-info的接口基础上新增depositLabel、withdrawLabel字段
 * @param currency string 数字货币币种
 */

export async function getAssetsChainInfo(params) {
  // 充值和提现都支持了闪电网络，在接口调用处统一收口
  return pull(`${ASSET_FRONT}/currency/chain-info`, params);
}

/**
 * 获取热币榜单
 */

export const getHotCoins = (params) => {
  return pull(`${ASSET_FRONT}/hot-currency/list`, params);
};

/**
 * 资产分析 获取昨日总资产
 */
export const getPreOverview = (params) => {
  return pull(`${ASSET_ANALYSIS}/asset/overview`, params);
};

/**
 * 资产分析 获取资产走势接口
 */
export const getAssetsTrend = (params) => {
  return postJson(`${ASSET_ANALYSIS}/asset/trend`, params);
};

/**
 * 查询最新充提记录
 */

export const getRecentHistory = (params) => {
  return pull(`${ASSET_FRONT}/recently/withdraw-deposit/list`, params);
};

/**
 * 资产概览页运营位展示币种列表
 * @param number topSize 1 查询最受欢迎币种数量 默认1
 * @param number increaseSize 1 查询24小时涨幅最大币种数量 默认1
 */

export const getOperationTrends = (params) => {
  return pull(`${ASSET_FRONT}/deposit-trends`, params);
};

/**
 * 资产卡片-现货
 * @param  string currency 数币 BTC KCS USDT
 */

export const getSpotAssets = (params) => {
  return pull(`${ASSET_FRONT}/assets/spots`, params);
};

/**
 * 资产卡片-保证金
 * @param  string currency 数币 BTC KCS USDT
 */

export const getMarginAssets = (params) => {
  return pull(`${ASSET_FRONT}/assets/margin`, params);
};

/**
 * 资产卡片-金融资产
 * @param  string currency 数币 BTC KCS USDT
 */

export const getIncomeAssets = (params) => {
  return pull(`${ASSET_FRONT}/assets/financial`, params);
};

/**
 * 资产卡片-卡片下的广告位信息聚合接口
 * @param string currency 数币 BTC KCS USDT
 */

export const getAssetsInfo = (params) => {
  return pull(`${ASSET_FRONT}/assets/card/advertising-space`, params);
};

/**
 * 可用资产列表
 * @returns
 */
export const getAssetsList = (params) => {
  return pull(`${ASSET_FRONT}/assets/detail-in-currency`, params);
};

/**
 * kucard 入口判断
 */

export async function getKucardEntrance() {
  return pull('/kucard-proxy/crdapi/v1/kucard/ifHasEntrance');
}

/**
 * 查看用户清退状态
 * @param string userId
 * 返回值true表示该用户为非正常用户（清退用户、IP处于限制国家、KYC0限制），false表示正常用户
 */

export async function getRestrictedStatus(params) {
  return pull(`${prefix}/asset/user/is-restricted`, params);
}

/**
 * 划转记录列表
 */

export async function getTransferList(params) {
  return postJson(`${ACCOUNT_FRONT}/query/transfer-order/page`, params);
}

/**
 * 获取用户清退文案
 * @returns promise
 */
export async function getRestrictedInfo() {
  return pull(`${prefix}/asset/user/restricted/info`);
}

/**
 * 查询资产冻结原因
 */
export async function getFreezeReason(params) {
  return pull(`${_prefix}/account/freeze-reason/get`, params);
}

/**
 * 生成闪电网络的发票
 * @param {string} currency
 * @param {number} chainId
 * @param {number} amount
 */
export async function addLightningInvoice(params) {
  return postJson(`${PAYMENT_INVOICE}/deposit/invoice/add`, params);
}

/**
 * 验证闪电网络的发票
 * @param {string} currency
 * @param {number} chainId
 * @param {string} invoice
 */
export async function validInvoice(params) {
  return postJson(`${PAYMENT_INVOICE}/withdraw/invoice/validate`, params);
}
/**
 *@description 查询 充值免费额度
 * @param arg
 * @return {Promise<*>}
 */
export async function getDepositFreeFee(arg) {
  return pull(`${prefix}/deposit/free/fee`, arg);
}
