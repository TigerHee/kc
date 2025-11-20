/*
 * owner: borden@kupotech.com
 */
import { filter } from 'lodash';
import { useEventCallback } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CurrencySelect from '../../components/CurrencySelect';
import CoinCurrency from '../../components/common/CoinCurrency';
import { validateEmpty, getSymbolConfig } from '../../utils/tools';
import { toCurrencySizeValidator } from '../../utils/validator';
import { comparedTo } from '../../utils/format';
import { NAMESPACE, ORDER_TYPE_MAP } from '../../config';
import { useConvertSymbolsMap, useFromCurrency, useToCurrency } from './useStoreValue';

export default function useToField({ value, onChange, inputNumberProps, estimateFieldName }) {
  const dispatch = useDispatch();
  const { t: _t } = useTranslation('convert');
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
const convertSymbolsMap = useConvertSymbolsMap();

  const balance = positions?.[accountType]?.[toCurrency];
  const isEstimateField = estimateFieldName === 'toCurrencySize';
  const { minBaseSize, maxBaseSize } = getSymbolConfig(toCurrency, fromCurrency, convertSymbolsMap);

  const rules = useMemo(
    () => [
      {
        validator: validateEmpty,
        validateTrigger: 'onSubmit',
      },
      {
        validator: (_, v) => toCurrencySizeValidator(v, isEstimateField),
      },
    ],
    [isEstimateField],
  );

  const checkItem = useCallback(
    (item) => {
      const { getNextSymbol } = ORDER_TYPE_MAP[orderType];
      const currency = item?.currency || item;
      return (
        currency !== fromCurrency &&
        !getNextSymbol({ fromCurrency, toCurrency: currency })
      );
    },
    [orderType, fromCurrency],
  );

  const handleChangeCurrency = useEventCallback((v) => {
    // 无变化，不触发change逻辑
    if (v === toCurrency) return;
    dispatch({
      type: `${NAMESPACE}/pullPosition`,
      payload: {
        currencies: [v],
      },
    });
    dispatch({
      type: `${NAMESPACE}/updateCurrency`,
      payload: {
        toCurrency: v,
      },
    });
  });

  return {
    wrapperProps: {
      balance,
      title: isEstimateField ? _t('pdZPoviDKMpV6Hr6M5TcHr') : _t('1izXduRcCW4CqMQTDi3Nry'),
      currency: toCurrency,
      // style: { marginTop: 4 },
    },
    formItemProps: {
      rules,
      name: 'toCurrencySize',
      help: comparedTo(value, 0) > 0 && <CoinCurrency coin={toCurrency} value={value} />,
    },
    inputNumberProps: {
      onChange,
      max: maxBaseSize,
      min: minBaseSize,
      unit: (
        <CurrencySelect
          value={toCurrency}
          tradeDirection="TO"
          checkItem={checkItem}
          onChange={handleChangeCurrency}
        />
      ),
      ...inputNumberProps,
    },
  };
}
