/*
 * @owner: borden@kupotech.com
 */
import React, { useCallback } from 'react';
import { useSelector } from 'dva';
import { includes, isNil } from 'lodash';
import { _t } from 'src/utils/lang';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import usePair from '@/hooks/common/usePair';
import { isMinStep } from '@/utils/format';
import useOrderType from '../../../hooks/useOrderType';
import { validateEmpty, numberFormatter } from '../../../utils';
import Unit from '../components/Unit';

export default function usePriceInput({
  name,
  required = true,
  validator,
  extraRules,
  price,
  lastPriceVal, // 最新成交价
}) {
  // 限价 买入价/卖出价
  // 限价止损 买入价/卖出价 ｜ 买入触发价/卖出触发价
  // OCO 买入价/卖出价 ｜ 限价买入价/限价卖出价 ｜ 买入触发价/卖出触发价
  // 跟踪委托 买入价/卖出价
  // 市价止损 买入触发价/卖出触发价
  const { quoteInfo } = usePair();
  const currentSymbolInfo = useGetCurrentSymbolInfo();
  const isLogin = useSelector((state) => state.user.isLogin);
  const { orderTypeConfig } = useOrderType();

  const { currencyName: quoteName } = quoteInfo;
  const { priceIncrement, pricePrecision } = currentSymbolInfo;

  const priceValidator = useCallback(
    (_, value) => {
      const { priceValidatePassNames } = orderTypeConfig;
      if (isNil(value) || !isLogin || includes(priceValidatePassNames, name)) {
        return Promise.resolve();
      }
      // 不能为0
      if (value < priceIncrement) {
        return Promise.reject(
          _t('trd.form.step.price.zero.err', {
            coin: quoteName,
            amount: priceIncrement,
          }),
        );
      }
      // 满足价格精度
      if (!isMinStep(value, priceIncrement)) {
        return Promise.reject(
          _t('trd.form.step.price.min.err', {
            amount: priceIncrement,
          }),
        );
      }
      return Promise.resolve();
    },
    [orderTypeConfig, isLogin, priceIncrement, quoteName, name],
  );
  return {
    formItemProps: {
      name,
      rules: [
        {
          validator: required ? validateEmpty : undefined,
          validateTrigger: 'onSubmit',
        },
        {
          validator: validator || priceValidator,
        },
        ...(Array.isArray(extraRules) ? extraRules : []),
      ],
    },
    inputProps: {
      step:
        !price || price === '0'
          ? lastPriceVal || priceIncrement
          : priceIncrement, // （无数据或者数据为0）买入或者卖出方向步长为最新成交价
      autoFixPrecision: false,
      precision: pricePrecision,
      formatter: numberFormatter,
      unit: <Unit coinName={quoteName} />,
    },
  };
}
