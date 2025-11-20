import {getBaseCurrency} from 'site/tenant';

import {MarginModeType, PositionSideMap} from 'constants/future';

export const convertPositionInfo2SharePayload = (
  payload,
  {numberFormat, symbolPrecision},
) => {
  const {info, userDesc, showSymbolText, shareLaunchUserInfo} = payload;
  const {
    leverage,
    positionSide,
    avgEntryPrice,
    pnl,
    avgClosePrice,
    markPrice,
    pnlRatio,
  } = info || {};
  const {avatarUrl, nickName} = shareLaunchUserInfo || {};

  return {
    userAvatarUrl: avatarUrl || '' /** 用户头像 */,
    userName: nickName || '',
    tradeDisplaySymbol: showSymbolText /** 交易对展示 */,
    tradeIsLong: positionSide === 'Long' /** 是否是做多 */,
    tradeLeverage: leverage /** 杠杆倍数 */,
    tradePnlValue: pnlRatio /** pnl数值，非百分比 */,
    tradePnlAmountValue: pnl,
    tradeAveragePrice: numberFormat(avgEntryPrice, {
      options: {
        minimumFractionDigits: symbolPrecision,
        maximumFractionDigits: symbolPrecision,
      },
    }),
    /** 平均价格 */
    tradeExitPrice: numberFormat(avgClosePrice || markPrice, {
      options: {
        minimumFractionDigits: symbolPrecision,
        maximumFractionDigits: symbolPrecision,
      },
    }) /** 结算价格 平仓价格与标记价格 */,
    tradeSettleCurrency: getBaseCurrency() /** 结算单位 */,
    userDesc /** 标题下面的描述信息，跟单者为follow :xxx，带单者可以不设置 */,
  };
};

const PositionSide2TranKeyMap = {
  [PositionSideMap.Long]: 'f23e51747c5f4000a24e',
  [PositionSideMap.Short]: '3d0d8f5a226d4000a233',
};

const MarginMode2TranKeyType = {
  [MarginModeType.ISOLATED]: '134a1674e8174000ad55', // 逐仓
  [MarginModeType.CROSS]: 'ca95efebfa344000ad01', //全仓
};

export const generateShowMarginModeAndPositionSide = (
  _t,
  {positionSide, marginMode},
) => {
  return {
    showPositionSide: PositionSide2TranKeyMap[positionSide]
      ? _t(PositionSide2TranKeyMap[positionSide])
      : '',
    showMarginMode: MarginMode2TranKeyType[marginMode]
      ? _t(MarginMode2TranKeyType[marginMode])
      : '',
  };
};
