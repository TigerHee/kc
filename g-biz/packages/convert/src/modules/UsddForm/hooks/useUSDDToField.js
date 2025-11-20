/*
 * owner: june.lee@kupotech.com
 */
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import CurrencySelect from '../../../components/CurrencySelect';
import CoinCurrency from '../../../components/common/CoinCurrency';
import { validateEmpty } from '../../../utils/tools';
import { toCurrencySizeValidator } from '../utils/usddValidator';
import { comparedTo } from '../../../utils/format';
import { NAMESPACE, ORDER_TYPE_MAP } from '../../../config';
import {
  useConvertSymbolsMap,
  useFromCurrency,
  useToCurrency,
} from '../../../hooks/form/useStoreValue';

export default function useUSDDToField({ value, onChange, inputNumberProps, estimateFieldName }) {
  const { t: _t } = useTranslation('convert');
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const convertSymbolsMap = useConvertSymbolsMap();

  const balance = positions?.[accountType]?.[toCurrency];
  const isEstimateField = estimateFieldName === 'toCurrencySize';
  const { maxSize: maxBaseSize, minSize: minBaseSize } = convertSymbolsMap[toCurrency] ?? {};

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
      return currency !== fromCurrency && !getNextSymbol({ fromCurrency, toCurrency: currency });
    },
    [orderType, fromCurrency],
  );

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
        <CurrencySelect value={toCurrency} tradeDirection="TO" checkItem={checkItem} readOnly />
      ),
      ...inputNumberProps,
    },
  };
}
