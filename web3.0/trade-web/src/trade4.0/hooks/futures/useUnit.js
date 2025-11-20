/**
 * Owner: garuda@kupotech.com
 * 该 hooks 返回所有合约交易对信息
 */
import { useMemo, useCallback } from 'react';

import Decimal from 'decimal.js';
import { useDispatch, useSelector } from 'dva';

import { getStore } from 'utils/createApp';
import { _t } from 'utils/lang';
import { dividedBy, multiply, toNearest } from 'utils/operation';

import { FUTURES } from '@/meta/const';
import { CURRENCY_UNIT, QUANTITY_UNIT } from '@/meta/futures';
import { formatCurrency } from '@/utils/futures';

import { useGetSymbolInfo } from '../common/useSymbol';

export const useUnit = () => {
  // 张
  return useSelector((state) => state.futuresCommon.tradingUnit);
};

export const getUnit = () => {
  return getStore().getState().futuresCommon.tradingUnit;
};

// 获取交易单位
export const useSymbolUnit = ({ symbol }) => {
  const tradingUnit = useUnit();
  const { baseCurrency, isInverse } = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  const unit = useMemo(() => {
    return !isInverse && tradingUnit === CURRENCY_UNIT
      ? formatCurrency(baseCurrency)
      : _t('global.unit');
  }, [isInverse, tradingUnit, baseCurrency]);

  return { tradingUnit, unit };
};

/**
 * 转换张， baseCurrency
 */
export const useTransformAmount = ({ tradeType, symbol }) => {
  const futuresUnit = useUnit();
  const isFutures = tradeType === FUTURES;
  const { baseIncrement, isInverse } = useGetSymbolInfo({ tradeType, symbol });
  // 显示张，反向合约，正向合约逻辑
  const isQuantity = futuresUnit === 'Quantity' || isInverse;
  // 张 -> baseCurrency
  const quantityToBaseCurrency = useCallback(
    (amount) => {
      return qtyToBaseCurrency({ amount, baseIncrement, isFutures, isQuantity });
    },
    [baseIncrement, isFutures, isQuantity],
  );
  return { quantityToBaseCurrency };
};

export const qtyToBaseCurrency = ({ baseIncrement, amount, isFutures, isQuantity }) => {
  if (isFutures && !isQuantity) {
    return multiply(baseIncrement)(amount).toString();
  } else {
    return amount;
  }
};

export const baseCurrencyToQty = ({ baseIncrement, amount, isQuantity }) => {
  if (!isQuantity) {
    return dividedBy(amount)(baseIncrement).toString();
  } else {
    return amount;
  }
};

/**
 * 转换全仓计算值
 * 全仓 反向 计算出来是张，正向计算出来是 baseCurrency，根据交易单位返回对应的值
 */
export const transFuturesCrossCalcQty = ({ amount, symbolInfo, tradingUnit }) => {
  // 反向合约不需要转换 or 交易单位为 baseCurrency 时
  if (symbolInfo?.isInverse || tradingUnit === CURRENCY_UNIT) {
    return amount;
  }
  return dividedBy(amount)(symbolInfo?.multiplier).toString();
};

// 设置交易单位
export const useSetUnit = () => {
  const dispatch = useDispatch();

  const onSetUnit = useCallback(
    (tradingUnit) => {
      dispatch({
        type: 'futuresCommon/update',
        payload: {
          tradingUnit,
        },
      });
    },
    [dispatch],
  );

  return onSetUnit;
};

// 返回对应交易单位格式化的精度
export const toMakeTradingUnitQty = ({ tradingUnit, symbolInfo, size }) => {
  const { isInverse, multiplier, lotSize } = symbolInfo || {};
  const isQuantity = isInverse || tradingUnit === QUANTITY_UNIT;
  const fixed = isQuantity ? lotSize : multiplier;
  return toNearest(size)(fixed, Decimal.ROUND_DOWN).toString();
};
