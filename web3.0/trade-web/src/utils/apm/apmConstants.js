/**
 * Owner: Owen.guo@kupotech.com
 */
/*
 * @Author: Owen.guo
 * @Date: 2023-04-11 11:15:09
 * @Description: APMCONSTANTS 是神策eventName上报类型
 */
export const APMCONSTANTS = {
  SENSOR_TRACK_ANALYSE: 'sensor_track_analyse', // apm上报默认值
  TRADE_ORDER_ANALYSE: 'trade_order_analyse', // 交易订单上报
  TRADE_ORDER_CANCEL_ANALYSE: 'cancel_order_analyse', // 交易撤单上报
};

export const APMSWCONSTANTS = {
  TRADE_FLUSH_ANALYSE: 'trade_flush_analyse', // 数据刷新频率指标
  KLINE: 'trade.snapshot', // k线 轮训-推送
  L2_Limit50: 'level2', // 买卖盘topic
  TICK: 'tick', // 实时成交价格 买卖盘中间标记价格
  DEAL: 'trade.l3match', // 实时成交历史订单
  ACCOUNT_BALANCE_SNAPSHOT: 'account.snapshotBalance', // 个人资产topic
  HISTORY_ORDER_UPDATE: 'history.order', // 个人历史订单刷新（个人历史委托）http接口
  SCHEDULE_TIME: 240000, // 任务调度时间（trade页面平均停留时长）
};
