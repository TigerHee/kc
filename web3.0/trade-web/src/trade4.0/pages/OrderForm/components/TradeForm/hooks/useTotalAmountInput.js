/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-16 18:49:24
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-14 17:03:07
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/useTotalAmountInput.js
 * @Description:  时间加权委托，委托总量
 */

import React, { useMemo } from 'react';
import { _t } from 'src/utils/lang';
import useAmountConfig, { getAmountConfig } from './useAmountConfig';
import useSide from '../../../hooks/useSide';
import { validateEmpty, numberFormatter } from '../../../utils';
import Unit from '../components/Unit';
import { getPair } from '@/hooks/common/usePair';
import { getSymbolConfig } from '@/hooks/common/useSymbol';
import { getTradeType } from '@/hooks/common/useTradeType';
import { isMinStep, formatNumber } from '@/utils/format';
import { getStateFromStore } from '@/utils/stateGetter';
import { isNil, min } from 'lodash';
import getMaxAmount from '../utils/getMaxAmount';
import { multiplyAndFixed } from 'helper';

// 提示分类
const tipsMap = {
  amountMin: 'trd.form.amount.min',
  amountMax: 'trd.form.amount.max',
  amountMaxLimit: 'trd.form.amount.max.limit',
  quoteMin: 'trd.form.quote.min',
  quoteMax: 'trd.form.quote.max',
  quoteMaxLimit: 'trd.form.quote.max.limit',
};

export const totalAmountValidator = ({
  side,
  price,
  value,
  symbol, // 默认当前交易对
  orderType, // 默认当前orderType
  tradeType, // 默认当前tradeType
  currency, // 默认根据side、orderType获取下单币种
  timeWeightedOrderConfig,
  pricesUSD,
}) => {
  const {
    orderSizeMinUSD = 500, // 委托总量折算美元最低值,
  } = timeWeightedOrderConfig;
  const isLogin = getStateFromStore((state) => state.user.isLogin);
  const unitDict = getStateFromStore((state) => state.symbols.unitDict);

  if (isNil(value) || !isLogin) {
    return Promise.resolve();
  }
  if (!side) {
    return Promise.resolve();
  }
  const isBuy = side === 'buy';
  tradeType = tradeType || getTradeType();
  value = +value;
  const { baseInfo, quoteInfo } = getPair(symbol);
  const { quoteMinSize } = getSymbolConfig(symbol);
  const { amountMin, amountMax, amountIncrement } = getAmountConfig({
    side,
    symbol,
    orderType,
  });
  const { currency: base, currencyName: baseName } = baseInfo;
  const rate = pricesUSD[base]; // 法币USD 汇率
  const currencyPrice = +multiplyAndFixed(rate, value);
  let tipKey = 'trd.form.step.amount.mode.err';
  // 精度校验
  if (!isMinStep(value, amountIncrement || 1)) {
    return Promise.reject(
      _t(tipKey, {
        amount: amountIncrement,
      }),
    );
  }
  const coinName = baseName;
  // 最小值校验
  if (currencyPrice < orderSizeMinUSD) {
    // 买
    tipKey = 'amountMin';

    return Promise.reject(
      _t(tipsMap[tipKey], {
        amount: formatNumber(orderSizeMinUSD),
        coin: 'USD',
      }),
    );
  }

  // 最大值校验
  let realMaxAmount = 0;
  if (!isBuy) {
    realMaxAmount = +getMaxAmount({
      side,
      price,
      symbol,
      currency,
      orderType,
      tradeType,
    });
  }

  const _max = isBuy ? amountMax : min([realMaxAmount, amountMax]);
  if (isBuy && value > _max) {
    tipKey = 'amountMax';
    return Promise.reject(
      _t(tipsMap[tipKey], {
        amount: formatNumber(`${_max}`),
        coin: coinName,
      }),
    );
  } else if (!isBuy && value > _max) {
    tipKey = 'amountMax';
    return Promise.reject(
      _t(tipsMap[tipKey], {
        amount: formatNumber(`${_max}`),
        coin: coinName,
      }),
    );
  }
  return Promise.resolve();
};

export default function useTotalAmountInput({
  price,
  totalAmount,
  timeWeightedOrderConfig,
  pricesUSD,
  name = 'totalAmount',
}) {
  const { side } = useSide();
  const { amountMin, amountUnit, amountPrecision, amountIncrement } = useAmountConfig();
  const hasNoVal = !totalAmount || totalAmount === '0';
  const step = hasNoVal ? amountMin || amountIncrement : amountIncrement;

  const rules = useMemo(() => {
    return [
      {
        validator: validateEmpty,
        validateTrigger: 'onSubmit',
      },
      {
        validator: (_, value) =>
          totalAmountValidator({
            side,
            price,
            value,
            timeWeightedOrderConfig,
            pricesUSD,
          }),
      },
    ];
  }, [side, price, timeWeightedOrderConfig, pricesUSD]);

  return {
    formItemProps: {
      name,
      rules,
    },
    inputProps: {
      step,
      autoFixPrecision: false,
      precision: amountPrecision,
      formatter: numberFormatter,
      unit: <Unit coin={amountUnit} />,
    },
  };
}
