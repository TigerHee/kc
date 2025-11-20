/*
 * @owner: borden@kupotech.com
 */
import { isNil } from 'lodash';
import { _t } from 'src/utils/lang';
import { max, min } from 'src/utils/operation';
import { numberFixed } from 'src/helper';

/**
 *
 * @param {*} TrType
 * @returns 是否止损单
 */
export const isTriggerTrade = (TrType) => {
  return /triggerpri(s|c)e/i.test(TrType);
};
/**
 *
 * @param {*} TrType
 * @returns 是否市价单
 */
export const isMarketTrade = (TrType) => {
  return /market.*Pri(s|c)e/i.test(TrType);
};

/**
 * @param {*} jumpUrl
 */
export const openPage = (jumpUrl) => {
  const newWindow = window.open(jumpUrl);
  newWindow.opener = null;
};

export const list2map = (list, key = 'value') => {
  const result = {};
  list.forEach((item) => {
    result[item[key]] = item;
  });
  return result;
};

export const validateEmpty = (_, values) => {
  if (!values) {
    return Promise.reject(_t('trans.amount.num.err'));
  }
  return Promise.resolve();
};

export const numberFormatter = (val, precision) => {
  if (val) {
    const decimalFraction = val.split('.')[1];
    if (decimalFraction && decimalFraction.length > precision) {
      return numberFixed(+val, precision);
    }
  }
  return val;
};
/**
 * @desc 市价 ｜ 市价止损 买入时 带入 币对的最小下单金额与0.1U的较大值
 * @param {*} quoteMinSize 最小下单价值
 * @param {*} unitValue 0.1U 最小下单价值
 * @returns 币对的最小下单金额与0.1U的较大值
 */
export const calcMaxVolume = (quoteMinSize = 0, unitValue = 0) => {
  return Math.max(+quoteMinSize, +unitValue);
};

/**
 * @desc 获取用于计算数量的价格. OCO订单比较特殊，因为它相当于限价单&限价止损单的集合体，所以价格需要在两者取大
 *       以用以成交额的计算以及最大数量的计算
 */
export const getPriceForCalc = (orderType, side, price, limitPrice) => {
  if (['ocoPrise'].includes(orderType)) {
    const comparedFn = side === 'sell' ? min : max;
    return [price, limitPrice].some(isNil) ? undefined : comparedFn(price, limitPrice).toFixed();
  }
  return price;
};
