/**
 * owner: clyne@kupotech.com
 */

export const futuresKunlun = [
  // =============================== 合约 start ===============================
  // P0
  '/_api_kumex/currency/site/currencies', // 合约币服
  '/_api_kumex/kumex-trade/orders', // 下单
  '/_api_kumex/kumex-trade/orders/cancel', // 撤单
  '/_api_kumex/web-front/positions', // 仓位查询
  '/_api_kumex/web-front/orders', // 活动委托，历史委托查询
  '/_api_kumex/web-front/stopOrders', // 高级委托查询
  '/_api_kumex/kumex-snapshot/query-realised-pnls', // 平仓盈亏
  '/_api_kumex/web-front/fills', // 成交历史
  '/_api_kumex/futures-trade-proxy/activeOrderStatistics', // 全仓对冲数量查询
  '/_api_kumex/futures-trade-proxy/user-tax-fee', // 税费
  '/_api_kumex/kumex-trade/configs/getUserMaxLeverage', // 逐仓最大杠杆查询
  '/_api_kumex/futures-trade-proxy/configs/getCrossUserLeverage', // 全仓杠杆列表查询
  '/_api_kumex/futures-trade-proxy/configs/getCrossUserMaxLeverage', // 全仓最大杠杆
  '/_api_kumex/kumex-contract/contracts/active', // 活跃的合约交易对列表
  '/_api_kumex/kumex-contract/contracts', // 合约全部交易对列表
  '/_api_kumex/web-front/account/total-equity-l3-new', // 合约资产查询
  '/_api_kumex/kumex-trade/updateStopOrdersFromShortcut', // 仓位止盈止损设置
  '/_api_kumex/futures-trade-proxy/orders/closeAllPosition', // 一键平仓
  '/_api_kumex/futures-busi-proxy/account/config/update', // 设置合约偏好设置
  '/_api_kumex/futures-busi-proxy/contract/open', // 开通合约
  '/_api_kumex/futures-busi-proxy/account/info', // 合约userInfo
  '/_api_kumex/kumex-contract/feature/enable', // 拉取开关功能
  '/_api_kumex/futures-busi-proxy/feature/available', // 拉取用户开关
  // P1
  '/_api_kumex/futures-busi-proxy/contract/collect', // 合约收藏
  '/_api_kumex/futures-busi-proxy/contract/collections', // 合约查询收藏
  '/_api_kumex/futures-busi-proxy/sub-account/total-equity', // 子账号资产概览查询
  '/_api_kumex/kumex-kline/history', // 专业版kline
  '/_api_kumex/kumex-market/v1/level2/snapshot', // 专业版买卖盘
  '/_api_kumex/kumex-market/v1/trade/history', // 专业版最近成交
  '/_api_kumex/web-front/account/funds-tx-type', // 合约资产明细枚举
  '/_api_kumex/web-front/account/funds-tx', // 合约资产明细查询
  '/_api_kumex/futures-market-proxy/v3/level2/snapshot', // 交易大厅买卖盘
  '/_api_kumex/futures-market-proxy/v1/trade/txRecordHis', //交易大厅最近成交
  '/_api_kumex/kumex-kline/v3/kline/history', // 交易大厅kline查询
  '/_api_kumex/futures-trade-proxy/orders/bs/data', // 合约bs点位查询
  '/_api_kumex/kumex-trade/orders/price-limit', // 查询最高最低价
  '/_api_kumex/kumex-snapshot/close-realised-pnl-detail', // PNL detail
  '/_api_kumex/futures-position-proxy/position/queryMarginModeV2', // 查询保证金模式
  '/_api_kumex/futures-busi-proxy/position/queryPositionModeIncludeTrial', // 查询双向持仓模式
  '/_api_kumex/futures-trade-proxy/queryMarginHedgeRate', // 查询双向持仓锁仓比例
  '/_api_kumex/futures-busi-proxy/position/position/maxCloseSize', // 查询双向持仓最大可平量

  // 体验金3.0
  '/_api_kumex/futures-trial-proxy/trial/contract/cross/gray', // 体验金灰度
  '/_api_kumex/futures-trial-proxy/trial/getUserTradeTrialCouponList', // 体验金交易页面查询
  '/_api_kumex/futures-trial-proxy/orders/cancelById', // 撤单
  '/_api_kumex/futures-trial-proxy/position/margin/deposit-margin', // 追加保证金
  '/_api_kumex/futures-trial-proxy/orders', // 下单
  '/_api_kumex/futures-trial-proxy/updateStopOrdersFromShortcut', // 仓位止盈止损
  '/_api_kumex/futures-trial-proxy/margin/changeAutoDepositStatus', // 体验金自动追加保证金
  '/_api_kumex/futures-trial-proxy/trial/getUserTrialCouponList', // 体验金列表
  '/_api_kumex/futures-trial-proxy/trial/getMaxLeverage', // 最大杠杆
  '/_api_kumex/futures-trial-proxy/trial/getUserTrialCouponById', // 体验金详情
  '/_api_kumex/futures-trial-proxy/position/queryMarginMode', // 查询保证金模式
  '/_api_kumex/futures-trial-proxy/position/changeMarginMode', // 修改保证金模式
  '/_api_kumex/futures-trial-proxy/position/getSwitchableContracts', // 获取体验金批量切换全仓保证金列表
  '/_api_kumex/futures-trial-proxy/configs/getCrossUserMaxLeverage', // 获取新的最大可用杠杆
  '/_api_kumex/futures-trial-proxy/configs/changeCrossUserLeverage', // 调整全仓用户杠杆
  '/_api_kumex/futures-trial-proxy/configs/getUserRiskLimit', // 获取用户风险限额
  '/_api_kumex/futures-trial-proxy/margin/maxWithdrawMargin', // 查询体验金用户最大可提
  '/_api_kumex/futures-trial-proxy/margin/appendMargin', // 追加体验金保证金
  '/_api_kumex/futures-trial-proxy/margin/withdrawMargin', // 提取体验金保证金
  '/_api_kumex/futures-trial-proxy/trial/active', // 激活
  '/_api_kumex/futures-trial-proxy/activeOrderStatistics', // 对冲数量
  '/_api_kumex/futures-trial-proxy/position/position/maxCloseSize', // 查询双向持仓最大可平量

  // =============================== 合约 end ===============================
];
