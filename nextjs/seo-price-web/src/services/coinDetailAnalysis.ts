/**
 * Owner: hanx.wei@kupotech.com
 */
import { pull } from 'gbiz-next/request';

/**
 * 获取币种详情数据分析 M 值
 * @param params.coin coin symbol
 * @param params.timeDimension 时间维度, ONE_HOUR / TWELVE_HOUR / TWENTY_FOUR_HOUR
 * @returns mType 分好了类型
 */
export async function getAnalysisMValue(params) {
  return pull(`/quicksilver/currency-detail/symbols/dataAnalysis/mValue/${params.coin}`, params);
}

/**
 * 获取币种详情数据分析图表数据
 * @param params.coin coin symbol
 * @param params.dataAnalysisTimeDimensionEnum 时间维度, ONE_HOUR / TWELVE_HOUR / TWENTY_FOUR_HOUR
 * @param params.dataAnalysisTypeEnum 图表类型
 * IN_OUT_USER_PERCENT 兑入/兑出人数占比
 * IN_OUT_MONEY_PERCENT 兑入/兑出金额占比
 * SPOT_TRADE_USER_PERCENT 现货-大盘成交用户占比
 * FUTURES_TRADE_USER_PERCENT 合约-大盘成交用户占比
 * SPOT_TRADE_AMT_PERCENT 现货-大盘成交金额占比
 * FUTURES_TRADE_AMT_PERCENT 合约-大盘成交金额占比
 * SPOT_BUY_USER_DIVIDE_SPOT_SELL_USER 现货-挂单买入/卖出人数占比
 * FUTURES_BUY_USER_DIVIDE_FUTURES_SELL_USER 合约-挂单买入/卖出人数占比
 * SPOT_BUY_AMT_DIVIDE_SPOT_SELL_AMT 挂单买入/卖出金额占比-现货
 * FUTURES_BUY_AMT_DIVIDE_FUTURES_SELL_AMT 挂单买入/卖出金额占比-合约
 * @returns string[]
 */
export async function getAnalysisChartData(params) {
  return pull(`/quicksilver/currency-detail/symbols/dataAnalysis/${params.coin}`, params);
}
