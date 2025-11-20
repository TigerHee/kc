/*
 * owner: june.lee@kupotech.com
 */
import { useEventCallback } from '@kux/mui';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StakingCurrencySelect from '../StakingCurrencySelect';
import CoinCurrency from '../../../components/common/CoinCurrency';
import { getSymbolConfig, validateEmpty } from '../../../utils/tools';
import { toCurrencySizeValidator } from '../utils/StakingValidator';
import { comparedTo } from '../../../utils/format';
import { NAMESPACE, ORDER_TYPE_MAP } from '../../../config';
import {
  useConvertSymbolsMap,
  useFromCurrency,
  useToCurrency,
} from '../../../hooks/form/useStoreValue';

export default function useStakingToField({
  value,
  onChange,
  inputNumberProps,
  estimateFieldName,
}) {
  const dispatch = useDispatch();
  const { t: _t } = useTranslation('convert');
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = 'TRADE'; // 固定显示币币余额
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
      return currency !== fromCurrency && !getNextSymbol({ fromCurrency, toCurrency: currency });
    },
    [orderType, fromCurrency],
  );

  const handleChangeCurrency = useEventCallback((v) => {
    // 无变化，不触发change逻辑
    if (v === toCurrency) return;
    dispatch({
      type: `${NAMESPACE}/pullStakingPosition`,
      payload: {
        currencies: [v],
      },
    });
    dispatch({
      type: `${NAMESPACE}/updateStakingCurrency`,
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
        <StakingCurrencySelect
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
