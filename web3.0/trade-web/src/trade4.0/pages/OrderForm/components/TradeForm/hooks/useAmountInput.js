/*
 * @owner: borden@kupotech.com
 * @desc: 市价+市价止损 买入金额/卖出数量 当为买入金额时：币对的最小下单金额与0.1U的较大值作为缺省
 *         限价 市价 限价止损 市价止损  OCO 跟踪委托 模块买入数量/卖出数量
 */
import React, { useMemo } from 'react';
import { _t } from 'src/utils/lang';
import useAmountConfig from './useAmountConfig';
import amountValidator from '../utils/amountValidator';
import useOrderType from '../../../hooks/useOrderType';
import useSide from '../../../hooks/useSide';
import { validateEmpty, numberFormatter } from '../../../utils';
import Unit from '../components/Unit';

export default function useAmountInput({
  price,
  amount,
  maxVolume,
  name = 'amount',
}) {
  const { side } = useSide();
  const { isMarket } = useOrderType();
  const {
    amountMin,
    amountUnit,
    amountPrecision,
    amountIncrement,
  } = useAmountConfig();

  const isBuy = side === 'buy';
  const isMarketBuy = isMarket && isBuy;
  const hasNoVal = !amount || amount === '0';
  const step =
    hasNoVal && isMarketBuy
      ? maxVolume
      : hasNoVal && !isMarketBuy
      ? amountMin
      : amountIncrement;

  const rules = useMemo(() => {
    return [
      {
        validator: validateEmpty,
        validateTrigger: 'onSubmit',
      },
      {
        validator: (_, value) =>
          amountValidator({
            side,
            price,
            value,
          }),
      },
    ];
  }, [side, price]);

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
      placeholder: isMarketBuy ? _t('trd.form.volume') : _t('trd.form.amount'),
    },
  };
}
