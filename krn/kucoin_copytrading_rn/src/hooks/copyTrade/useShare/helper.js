import {getBaseCurrency} from 'site/tenant';

import {genComparisonOperatorAndValue} from 'components/Common/NumberFormat/helper';
import {numberFixed} from 'utils/helper';

/** 收益盈亏方向 1:盈利 0:持平 -1:亏损 */
const makeTradePnlSide = pnlValue => {
  if (pnlValue > 0) {
    return 1;
  } else if (Number(pnlValue) === 0) {
    return 0;
  } else {
    return -1;
  }
};

/** 收益率值需截断 4 位小数 原因：ios 负数向上取整 与页面展示不一致 因此前端截断 4 位透传 端上再格式化  */
const formatPnlRatio = pnlRatio => String(numberFixed(pnlRatio, 4) || 0);

export const formatShareLeadUserInfoEntity = (info, {profitNumberFormat}) => {
  const {
    userAvatarUrl,
    userName,
    lead30DayPnl,
    lead30DayValue,
    tradeSettleCurrency,
    lead30DayData,
  } = info || {};
  return {
    userAvatarUrl: userAvatarUrl || '',
    userName: userName || '',
    lead30DayPnl: formatPnlRatio(lead30DayPnl),
    lead30DayValue: String(profitNumberFormat(lead30DayValue)),
    lead30DayData: lead30DayData || [],
    tradeSettleCurrency: tradeSettleCurrency || getBaseCurrency(),
    tradePnlSide: makeTradePnlSide(lead30DayValue),
  };
};

export const formatShareCopyTradingPositionEntity = (
  info,
  {profitNumberFormat, numberFormat},
) => {
  const {
    tradeIsLong,
    userAvatarUrl,
    tradeDisplaySymbol,
    userName,
    tradeLeverage,
    tradePnlValue,
    tradeAveragePrice,
    tradeSettleCurrency,
    tradeExitPrice,
    userDesc,
    tradePnlAmountValue,
  } = info || {};

  return {
    userAvatarUrl: userAvatarUrl || '' /** 用户头像 */,
    userName: userName || '',
    tradeDisplaySymbol: tradeDisplaySymbol || '' /** 交易对展示 */,
    tradeIsLong: Boolean(tradeIsLong) /** 是否是做多 */,
    // 杠杠需要截断 2 位小数 与跟单仓位展示一致
    tradeLeverage: String(
      numberFormat(numberFixed(tradeLeverage, 2) || 0, {
        options: {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        },
      }),
    ) /** 杠杆倍数 */,
    tradePnlValue: formatPnlRatio(tradePnlValue) /** pnl数值，非百分比 */,
    tradeAveragePrice: tradeAveragePrice || '-',
    /**由业务侧调用传入格式化后 tradeExitPrice: 结算价格 如果仓位还在用标记价格，如果仓位不在使用平仓价格 小数位数根据合约交易对symbolPrecision控制*/
    tradeExitPrice: tradeExitPrice || '-',
    tradePnlAmountValue: String(
      profitNumberFormat(tradePnlAmountValue, {
        appendUnit: true,
      }),
    ),
    tradePnlSide: makeTradePnlSide(tradePnlAmountValue),
    tradeSettleCurrency:
      tradeSettleCurrency || getBaseCurrency() /** 结算单位 */,
    userDesc,
  };
};

export const formatShareCopyTraderFollowOneTraderPnlEntity = (
  traderInfo,
  {profitNumberFormat},
) => {
  const {
    copyTraderName,
    copyTraderAvatarUrl,
    pnlPercent,
    pnlValue,
    leadTraderName,
    tradeSettleCurrency,
  } = traderInfo || {};
  return {
    copyTraderName: copyTraderName || '' /** 跟单用户名称 */,
    copyTraderAvatarUrl:
      copyTraderAvatarUrl ||
      '' /** 跟单者用户头像地址，分享记得需要下载完成之后再渲染 */,
    pnlPercent:
      pnlPercent !== ''
        ? formatPnlRatio(pnlPercent)
        : '' /** 盈亏百分比 ，此处需要特点兼容逻辑 历史交易员无收益率上层字符串继续透传空，有值需截断 4 位小数 */,
    pnlValue: String(
      profitNumberFormat(pnlValue, {
        appendUnit: true,
      }),
    ) /** 盈亏数额 */,
    tradePnlSide: makeTradePnlSide(pnlValue),
    leadTraderName: leadTraderName || '' /** 带单者的名字 */,
    tradeSettleCurrency:
      tradeSettleCurrency || getBaseCurrency() /** 结算单位 */,
  };
};

export const formatShareLeadTraderTotalPnlEntity = (
  pnlInfo,
  {profitNumberFormat},
) => {
  const {
    userName,
    userAvatarUrl,
    leadTotalPnlData,
    leadTotalPnlValue,
    tradeSettleCurrency,
  } = pnlInfo || {};
  return {
    userName: userName || '' /** 用户名称 */,
    userAvatarUrl:
      userAvatarUrl || '' /** 用户头像地址，分享记得需要下载完成之后再渲染 */,
    leadTotalPnlData: leadTotalPnlData || [] /** 总盈亏数据，用来绘制曲线 */,
    leadTotalPnlValue: String(
      profitNumberFormat(leadTotalPnlValue),
    ) /** 总盈亏数额 */,
    tradePnlSide: makeTradePnlSide(leadTotalPnlValue),
    tradeSettleCurrency:
      tradeSettleCurrency || getBaseCurrency() /** 结算单位,默认USDT */,
  };
};

export const formatShareCopyTraderTotalPnlEntity = (
  pnlInfo,
  {profitNumberFormat},
) => {
  const {
    userName,
    userAvatarUrl,
    leadTradersNameData,
    totalPnlData,
    totalPnlValue,
    tradeSettleCurrency,
  } = pnlInfo || {};
  return {
    leadTradersNameData: leadTradersNameData || [],
    userName: userName || '' /** 用户名称 */,
    userAvatarUrl:
      userAvatarUrl || '' /** 用户头像地址，分享记得需要下载完成之后再渲染 */,
    totalPnlData: totalPnlData || [] /** 总盈亏数据，用来绘制曲线 */,
    totalPnlValue: String(profitNumberFormat(totalPnlValue)) /** 总盈亏数额 */,
    tradePnlSide: makeTradePnlSide(totalPnlValue),
    tradeSettleCurrency:
      tradeSettleCurrency || getBaseCurrency() /** 结算单位,默认USDT */,
  };
};

export const formatPnlNumber2ValueAndOperator = (
  pnlNumber,
  {displayPrecision},
) => {
  // 产品需求： 跟单收益金额存在部分账户剩余尾巴数（整数为 0，小数都为 0 精度超出八位后不为 0 的小数 eg： 0.000000000123)
  // 尾巴忽略,展示为: 0 也不展示大于 小于符号
  const ignoredPrecisionNumber = numberFixed(pnlNumber, 8);

  //向下取整
  try {
    const {value, operator} = genComparisonOperatorAndValue(
      ignoredPrecisionNumber,
      {
        maximumFractionDigits: displayPrecision,
      },
    );

    const floorDecimalValue = numberFixed(value, 2);

    return {
      value: floorDecimalValue,
      operator,
    };
  } catch (err) {
    console.error('formatPnlNumber2ValueAndOperator catch:', err);

    return {
      value: pnlNumber,
      operator: '',
    };
  }
};
