/**
 * Owner: garuda@kupotech.com
 * 计算方法以及校验方法
 */
import { max, equals, abs, lessThan, greaterThan, lessThanOrEqualTo } from 'utils/operation';

import { trackClick } from 'src/utils/ga';
import { ADJUST_MARGIN, SK_REDUCER_KEY, SK_ADD_KEY } from '@/meta/futuresSensors/withdraw';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { getAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { getUserMaxLeverage } from '@/hooks/futures/useGetUserFuturesInfo';
import { FUTURES } from '@/meta/const';
import { formatNumber } from '@/utils/futures';

import { APPEND_TABS, REDUCER_TABS } from './config';
import {
  AdjustMargin,
  orderValue,
  AdjustLiquidationPrice,
  AdjustOpenPositionPrice,
  AdjustLeverage,
  expectWithdrawMargin,
} from './formula';
import { floadToPercent } from '../../import';

export const marks = {
  0: floadToPercent(0, { isPositive: false }),
  0.25: floadToPercent(0.25, { isPositive: false }),
  0.5: floadToPercent(0.5, { isPositive: false }),
  0.75: floadToPercent(0.75, { isPositive: false }),
  1: floadToPercent(1, { isPositive: false }),
};

// 校验追加保证金
export const validateAppendMargin = ({
  _t,
  inputPrecision,
  value,
  minMargin,
  maxMargin,
  settleCurrency,
}) => {
  const valid = new RegExp(`^(0|[1-9][0-9]*)(\\.[0-9]{1,${inputPrecision}})?$`).test(value);

  if (!valid) {
    return Promise.reject(_t('input.tips.margin', { precision: String(inputPrecision) }));
  }

  if (!+value) {
    return Promise.reject(_t('append.margin.input.required'));
  }

  if (lessThan(value)(minMargin)) {
    // 埋点
    trackClick([ADJUST_MARGIN, '7'], { MarginDirection: SK_ADD_KEY });
    return Promise.reject(
      `${_t('append.margin.input.min', { amount: minMargin })} ${settleCurrency}`,
    );
  }

  if (greaterThan(value)(maxMargin)) {
    // 埋点
    trackClick([ADJUST_MARGIN, '7'], { MarginDirection: SK_ADD_KEY });
    return Promise.reject(_t('append.margin.input.max'));
  }

  return Promise.resolve();
};

// 校验追加保证金
export const validateReducerMargin = ({
  _t,
  inputPrecision,
  value,
  minMargin,
  maxMargin,
  settleCurrency,
}) => {
  const valid = new RegExp(`^(0|[1-9][0-9]*)(\\.[0-9]{1,${inputPrecision}})?$`).test(value);

  if (!valid) {
    return Promise.reject(_t('input.tips.margin', { precision: String(inputPrecision) }));
  }

  // eslint-disable-next-line eqeqeq
  if (value == 0) {
    return Promise.reject(_t('reducer.margin.greatThan.zero'));
  }

  if (!+value) {
    return Promise.reject(_t('reducer.margin.input.required'));
  }

  if (lessThan(value)(minMargin)) {
    // 埋点
    trackClick([ADJUST_MARGIN, '7'], { MarginDirection: SK_REDUCER_KEY });
    return Promise.reject(
      _t('reducer.margin.input.min', { amount: `${minMargin}`, currency: settleCurrency }),
    );
  }

  if (greaterThan(value)(maxMargin)) {
    // 埋点
    trackClick([ADJUST_MARGIN, '7'], { MarginDirection: SK_REDUCER_KEY });
    return Promise.reject(
      _t('reducer.margin.input.max', { amount: `${maxMargin}`, currency: settleCurrency }),
    );
  }

  return Promise.resolve();
};

// 校验输入杠杆值
export const validateLeverage = ({ _t, value, minLeverage, maxLeverage }) => {
  // eslint-disable-next-line eqeqeq
  if (value == 0) {
    return Promise.reject(_t('leverage.greaterThan.zero'));
  }

  if (!+value) {
    return Promise.reject(_t('reducer.margin.input.required'));
  }

  if (lessThan(value)(minLeverage)) {
    return Promise.reject(_t('leverage.lessThan.min', { leverage: minLeverage }));
  }

  if (greaterThan(value)(maxLeverage)) {
    return Promise.reject(_t('leverage.greaterThan.max', { leverage: maxLeverage }));
  }

  return Promise.resolve();
};

// 杠杆转预计金额
export const makeLeverageToExpectMargin = ({
  leverage,
  currentLeverage,
  totalMargin,
  markPrice,
}) => {
  // 获取当前仓位的数据
  const { size, symbol, posComm, markValue } = getAppendMarginDetail();
  // 获取 contract
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
  if (
    !+leverage ||
    !+currentLeverage ||
    equals(leverage)(formatNumber(currentLeverage, { fixed: 2, pointed: false }))
  ) {
    return false;
  }
  // 计算当前的标记价值
  const calcMakValue = markPrice ? orderValue({ contract, size, price: markPrice }) : markValue;
  return expectWithdrawMargin({ totalMargin, markValue: calcMakValue, posComm, leverage });
};

// 根据金额确定提取还是追加
export const makeInputMarginToType = ({ inputMargin }) => {
  if (lessThanOrEqualTo(inputMargin || 0)(0)) {
    return APPEND_TABS;
  }
  return REDUCER_TABS;
};

// 计算调整后的保证金
export const makeAfterMargin = ({ inputMargin, totalMargin, type, isError }) => {
  if (!+inputMargin || isError) return '';
  return max(AdjustMargin({ totalMargin, margin: abs(inputMargin), type }), 0);
};

// 计算调整后的强平价格
export const makeAfterLiquidationPrice = ({ inputMargin, isError, type }) => {
  // 获取当前仓位的数据
  const { size, symbol, posCost, posMargin, posMaint } = getAppendMarginDetail();

  if (size == null || !+inputMargin || isError) return '';

  // 获取 contract
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
  return AdjustLiquidationPrice({
    contract,
    posCost,
    posMargin,
    posMaint,
    margin: abs(inputMargin),
    size,
    type,
  });
};

// 计算调整后的开仓价格
export const makeAfterEntryPrice = ({ inputMargin, isError, markPrice, type }) => {
  if (!+inputMargin || isError) return '';
  const maxLeverage = getUserMaxLeverage();
  // 获取当前仓位的数据
  const { posMargin, posCost, posComm, avgEntryPrice } = getAppendMarginDetail();
  // 如果是追加保证金的情况，开仓价格不需要计算
  if (type === APPEND_TABS) {
    return avgEntryPrice;
  }
  const isChange = AdjustOpenPositionPrice({
    posMargin,
    posComm,
    margin: abs(inputMargin),
    posCost,
    maxLeverage,
  });
  return isChange ? avgEntryPrice : markPrice;
};

// 计算调整后的杠杆
export const makeAfterLeverage = ({ afterMargin, isError, markPrice }) => {
  // 获取当前仓位的数据
  const { size, markValue, symbol, posComm } = getAppendMarginDetail();
  if (size == null || afterMargin === '' || isError) return '';
  // 获取 contract
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
  // 计算当前的标记价值
  const calcMakValue = markPrice ? orderValue({ contract, size, price: markPrice }) : markValue;
  return max(AdjustLeverage({ markValue: calcMakValue, totalMargin: afterMargin, posComm }), 0);
};
