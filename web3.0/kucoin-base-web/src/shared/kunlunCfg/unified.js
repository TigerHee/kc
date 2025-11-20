/**
 * owner: clyne@kupotech.com
 */

const unifiedApi = '/_api_unified';
const UNIFIED_TRADE = `${unifiedApi}/ultra-trade`;
const UNIFIED_ORDER = `${unifiedApi}/ultra-order`;
const UNIFIED_POSITION = `${unifiedApi}/ultra-position`;
const UNIFIED_LOAN = `${unifiedApi}/ultra-loan`;
const UNIFIED_OPEN = `${unifiedApi}/ultra-open-service`;
const UNIFIED_ACCOUNT = `${unifiedApi}/ultra-account`;
export const unifiedKunlun = [
  // 保证金币种指数价格
  `${UNIFIED_ORDER}/unified/inner/query-margin-currency-indexprice`,
  // 保证金币种列表查询
  `${UNIFIED_ORDER}/unified/inner/config/margin-currency-config`,
  // 获取统一账户全局配置
  `${UNIFIED_TRADE}/unified/inner/config/common-conf`,
  // 合约占用
  `${UNIFIED_ORDER}/unified/inner/account/futures-order-statics`,
  // 现货占用
  `${UNIFIED_ORDER}/unified/inner/account/spot-order-statics`,
  // 资产列表
  `${UNIFIED_ACCOUNT}/unified/inner/account/account-list`,
  // 资产概览
  `${UNIFIED_ACCOUNT}/unified/inner/account/account-overview`,
  // 切换账户
  `${UNIFIED_OPEN}/unified/inner/open/switch`,
  // 获取题目
  `${UNIFIED_OPEN}/unified/inner/open/questions`,
  // 确认答题
  `${UNIFIED_OPEN}/unified/inner/open/confirm-answer`,
  // 最大杠杆查询【合约】
  `${UNIFIED_POSITION}/unified/inner/position/user-max-leverage`,
  // 杠杆列表查询【合约】
  `${UNIFIED_POSITION}/unified/inner/position/leverage-list`,
  // 设置杠杆【合约】
  `${UNIFIED_POSITION}/unified/inner/position/modify-leverage`,
  // 仓位查询【合约】
  `${UNIFIED_POSITION}/unified/inner/position/position-list`,
  // ADL查询【合约】
  `${UNIFIED_POSITION}/unified/inner/adl-rank`,
  // 单条撤单【合约｜现货】
  `${UNIFIED_TRADE}/unified/inner/orders/cancel`,
  // 批量撤单【合约】
  `${UNIFIED_TRADE}/unified/inner/advanced/cancel-batch`,
  // 下单【合约｜现货】
  `${UNIFIED_TRADE}/unified/inner/orders`,
  // 成交明细【合约｜现货】
  `${UNIFIED_ORDER}/unified/inner/orders/fills`,
  // 一健平仓【合约】
  `${UNIFIED_TRADE}/unified/inner/position/close-all-positions`,
  // 仓位历史详情【合约】
  `${UNIFIED_POSITION}/unified/inner/position/history-pnl-detail-list`,
  // 仓位历史【合约】
  `${UNIFIED_POSITION}/unified/inner/position/history-position-list`,
  // 历史委托【合约｜现货】
  `${UNIFIED_ORDER}/unified/inner/orders/query-history-orders`,
  // 活动委托，高级委托列表查询【合约｜现货】
  `${UNIFIED_ORDER}/unified/inner/orders/query-orders`,
  // 一键撤单活动委托【合约｜现货】
  `${UNIFIED_TRADE}/unified/inner/orders/cancel-all`,
  // 一键撤单高级委托【合约｜现货】
  `${UNIFIED_TRADE}/unified/inner/advanced/cancel-all`,
  // 活动委托｜高级委托total查询【现货】
  `${UNIFIED_ORDER}/unified/inner/orders/counts`,
  // 换币查询
  `${UNIFIED_LOAN}/unified/inner/loan/query-manual-repay-info`,
  // 预估还币
  `${UNIFIED_LOAN}/unified/inner/loan/repay-size-pre-calculate`,
  // 还币借口
  `${UNIFIED_LOAN}/unified/inner/loan/manual-repay`,
  // 预计风险率
  `${UNIFIED_ORDER}/unified/inner/orders/pre-calculate-riskratio`,
  // 流水枚举
  `${UNIFIED_ACCOUNT}/unified/inner/config/biz-types`,
  // 子账号资产概览
  `${UNIFIED_ACCOUNT}/unified/inner/account/sub-account-list`,

  '/_api_unified/ultra-loan/unified/inner/loan/borrow-record',
  '/_api_unified/ultra-loan/unified/inner/loan/repay-record',
  '/_api_unified/ultra-loan/unified/inner/loan/hourly-interest-record',
  '/_api_unified/ultra-loan/unified/inner/auto-exchange/record',
];