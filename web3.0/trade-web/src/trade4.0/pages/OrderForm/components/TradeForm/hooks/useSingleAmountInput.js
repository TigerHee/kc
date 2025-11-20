/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-04-16 18:49:24
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-05-14 17:02:06
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/useSingleAmountInput.js
 * @Description:  时间加权委托，单笔下单数量
 */

import React, { useMemo } from 'react';
import { _t } from 'src/utils/lang';
import useAmountConfig, { getAmountConfig } from './useAmountConfig';
import useSide from '../../../hooks/useSide';
import { validateEmpty, numberFormatter } from '../../../utils';
import Unit from '../components/Unit';
import { getPair } from '@/hooks/common/usePair';
import { getTradeType } from '@/hooks/common/useTradeType';
import { isMinStep, formatNumber, floadToPercent } from '@/utils/format';
import { getStateFromStore } from '@/utils/stateGetter';
import { isNil, min } from 'lodash';
import { multiply, multiplyAndFixed } from 'helper';
import { equals, greaterThan, lessThan } from 'src/utils/operation';

export const singleAmountValidator = ({
  side,
  price,
  value,
  symbol, // 默认当前交易对
  orderType, // 默认当前orderType
  tradeType, // 默认当前tradeType
  currency, // 默认根据side、orderType获取下单币种
  totalAmount,
  amountPrecision,
  timeWeightedOrderConfig,
}) => {
  const {
    singleOrderMaxPercent = 0.25, // 单笔下单量最大比例（相比于订单总委托量）
  } = timeWeightedOrderConfig || {};
  const { isLogin } = getStateFromStore((state) => state.user);
  const { unitDict } = getStateFromStore((state) => state.symbols);
  if (isNil(value) || !isLogin) {
    return Promise.resolve();
  }
  if (!side) {
    return Promise.resolve();
  }
  tradeType = tradeType || getTradeType();
  value = +value;
  const { baseInfo } = getPair(symbol);
  const { amountMin, amountIncrement } = getAmountConfig({
    side,
    symbol,
    orderType,
  });
  const { currencyName: baseName } = baseInfo;
  const tipKey = 'trd.form.step.amount.mode.err';
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
  if (lessThan(value)(amountMin)) {
    // 买
    return Promise.reject(
      _t('trd.form.amount.min', {
        amount: formatNumber(amountMin),
        coin: coinName,
      }),
    );
  }
  // 最大值校验
  if (totalAmount) {
    const _max = multiplyAndFixed(totalAmount, singleOrderMaxPercent, amountPrecision);
    if (greaterThan(value)(_max)) {
      return Promise.reject(
        _t('1yMJRhiqXpBTH7c7vb4veK', {
          percent: floadToPercent(singleOrderMaxPercent, { isPositive: false }),
        }),
      );
    }
    return Promise.resolve();
  } else {
    return Promise.reject(_t('as3zot2a6WB8dZ4myxgizz'));
  }
};

export default function useSingleAmountInput({
  price,
  singleAmount,
  maxVolume,
  totalAmount,
  timeWeightedOrderConfig,
  name = 'singleAmount',
}) {
  const { side } = useSide();
  const { amountMin, amountUnit, amountPrecision, amountIncrement } = useAmountConfig();
  const hasNoVal = !singleAmount || singleAmount === '0';
  const step = hasNoVal ? amountMin || amountIncrement : amountIncrement;
  const rules = useMemo(() => {
    return [
      {
        validator: validateEmpty,
        validateTrigger: 'onSubmit',
      },
      {
        validator: (_, value) =>
          singleAmountValidator({
            side,
            price,
            value,
            totalAmount,
            timeWeightedOrderConfig,
            amountPrecision,
          }),
      },
    ];
  }, [side, price, totalAmount, timeWeightedOrderConfig]);

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
