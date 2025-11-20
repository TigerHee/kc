/**
 * Owner: borden@kupotech.com
 */
import { pull, post } from 'utils/request';

const prefix = '/payment';
const ACCOUNT_FRONT = '/account-front';
const SNAPSHOT = '/snapshot';
const COOPERATION = '/cooperation';

/**
 *用户获取充值列表
 * @param arg
 * @return {Promise<*>}
 */
export async function getDepositList(arg) {
  return pull(`${prefix}/deposit/list`, arg);
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

// 获取资金概览数据
export async function getAssetDetail(query) {
  return pull('/kucoin-web-front/asset/overview', query);
}
// 获取资金概览数据
export async function getAssetDetail2(query) {
  return pull('/kucoin-web-front/v2/asset/overview', query);
}

/**
 * @description  获取用户提币记录
 * @param arg
 * @return {Promise<*>}
 */
export async function getWithDrawRecord(arg) {
  return pull(`${prefix}/withdraw/list`, arg);
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
  return post(`${ACCOUNT_FRONT}/self-transfer`, arg);
}

/**
 * @description 获取用户资产走势图
 * @param accountType
 * @param endDate
 * @param startDate
 * @param targetCurrency
 * @return {Promise<*>}
 */
export async function getUserDailyTrend({
  accountType,
  endDate,
  startDate,
  targetCurrency,
}) {
  return pull(`${SNAPSHOT}/get-user-balance`, {
    accountType,
    endDate,
    startDate,
    targetCurrency,
  });
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
export async function getUserSingleBlance({
  transFerAccountType,
  currency,
  tag = 'DEFAULT',
}) {
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
    `${ACCOUNT_FRONT}/query/main-account?baseAmount=${
      baseAmount || 0
    }&baseCurrency=${baseCurrency || 'BTC'}`,
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
    `${ACCOUNT_FRONT}/query/trade-account?baseAmount=${
      baseAmount || 0
    }&baseCurrency=${baseCurrency || 'BTC'}`,
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
  return post(`${ACCOUNT_FRONT}/query/hold-detail`, query);
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
  return post(`${ACCOUNT_FRONT}/query/main-account-detail`, query);
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
  return post(`${ACCOUNT_FRONT}/query/trade-account-detail`, query);
}

/**
 * 导出储蓄账户明细
 *
 * @param bizType // 业务类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @returns {Object}
 */
export async function exportMainAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  startAt,
}) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    startAt,
  };
  return post(`${ACCOUNT_FRONT}/export/main-account-detail`, query);
}

/**
 * 导出交易账户明细
 *
 * @param bizType // 业务类型
 * @param direction // 方向 （入账、出账）
 * @param currency // 币种
 * @param endAt // 结束日期
 * @param startAt // 开始日期
 * @returns {Object}
 */
export async function exportTradeAccountDetail({
  bizType,
  currency,
  direction,
  endAt,
  startAt,
}) {
  const query = {
    bizType,
    currency,
    direction,
    endAt,
    startAt,
  };
  return post(`${ACCOUNT_FRONT}/export/trade-account-detail`, query);
}

/**
 * 查询用户账户的总资产
 *
 * @param baseCurrency // 转换的目标币种
 * @returns {Object}
 */
export async function queryTotalBalance({ baseCurrency = 'BTC' }) {
  return pull(
    `${ACCOUNT_FRONT}/query/total-balance?baseCurrency=${baseCurrency}`,
  );
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
export async function qureyCurrencies({ source }) {
  return pull(`${COOPERATION}/simplex/currencies`, { source });
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

/** 获取小额资产配置 */
export const fetchSmallExchangeConfig = (params = {}) => {
  return pull(`${ACCOUNT_FRONT}/small-exchange/config`, params);
};
