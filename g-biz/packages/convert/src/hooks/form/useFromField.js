/*
 * owner: borden@kupotech.com
 */
import { isNil } from 'lodash';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, useEventCallback, useResponsive, useLatest } from '@kux/mui';
import CurrencySelect from '../../components/CurrencySelect';
import CoinCurrency from '../../components/common/CoinCurrency';
import useContextSelector from '../common/useContextSelector';
import { fromCurrencySizeValidator } from '../../utils/validator';
import { validateEmpty, getMax, getSymbolConfig } from '../../utils/tools';
import { comparedTo, isFinite, formatNumberByStep } from '../../utils/format';
import { NAMESPACE, ORDER_TYPE_MAP, BASE_CURRENCY } from '../../config';
import {
  useConvertSymbolsMap,
  useCurrenciesMap,
  useFromCurrency,
  useToCurrency,
} from './useStoreValue';

export default function useFromField({
  form,
  value,
  onChange,
  triggerValidate,
  estimateFieldName,
}) {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const { t: _t } = useTranslation('convert');
  const isLogin = useContextSelector((state) => Boolean(state.user));
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const orderType = useSelector((state) => state[NAMESPACE].orderType);
  const currenciesMap = useCurrenciesMap();
  const convertSymbolsMap = useConvertSymbolsMap();

  const balance = positions?.[accountType]?.[fromCurrency];
  const isEstimateField = estimateFieldName === 'fromCurrencySize';
  const { maxQuoteSize, minQuoteSize, tickSize } = getSymbolConfig(
    toCurrency,
    fromCurrency,
    convertSymbolsMap,
  );

  const latestIsEstimateField = useLatest(isEstimateField);

  const rules = useMemo(
    () => [
      {
        validator: validateEmpty,
        validateTrigger: 'onSubmit',
      },
      {
        validator: (_, v) => fromCurrencySizeValidator(v, isEstimateField),
      },
    ],
    [isEstimateField],
  );

  const max = useMemo(() => {
    return formatNumberByStep(getMax({ balance, max: maxQuoteSize }), tickSize);
  }, [balance, maxQuoteSize, tickSize]);

  useEffect(() => {
    const currentValue = form.getFieldValue('fromCurrencySize');
    if (!isNil(currentValue)) {
      triggerValidate(
        'fromCurrencySize',
        currentValue,
        currentValue,
        false,
        latestIsEstimateField.current,
      );
    }
  }, [max, triggerValidate]);

  const handleChangeCurrency = useEventCallback((v) => {
    const { getNextSymbol } = ORDER_TYPE_MAP[orderType];
    // 无变化，不触发change逻辑
    if (v === fromCurrency) return;
    let newToCurrency = toCurrency;
    if (v === toCurrency) {
      const { tradeDirection } = currenciesMap?.[fromCurrency] || {};
      if (!tradeDirection || ['ALL', 'TO'].includes(tradeDirection)) {
        newToCurrency = fromCurrency;
      } else {
        const legalCurrency = [BASE_CURRENCY, 'BTC', 'ETH', 'SOL'].find((item) => {
          const { tradeDirection: itemTradeDirection } = currenciesMap?.[item] || {};
          return v !== item && (!itemTradeDirection || ['ALL', 'TO'].includes(itemTradeDirection));
        });
        newToCurrency = legalCurrency || fromCurrency;
      }
    } else if (getNextSymbol({ fromCurrency: v, toCurrency })) {
      newToCurrency = 'USDT';
    }
    if (v !== toCurrency) {
      dispatch({
        type: `${NAMESPACE}/pullPosition`,
        payload: {
          currencies: [v, newToCurrency].filter(Boolean),
        },
      });
    }
    dispatch({
      type: `${NAMESPACE}/updateCurrency`,
      payload: {
        fromCurrency: v,
        toCurrency: newToCurrency,
      },
    });
  });

  const faskClick = useEventCallback(() => {
    if (isFinite(max)) {
      let nextSize = max;
      if (comparedTo(minQuoteSize, max) > 0) {
        nextSize = 0;
      }
      onChange(nextSize);
      form.setFieldsValue({
        fromCurrencySize: nextSize,
      });
    }
  });

  return {
    wrapperProps: {
      balance,
      showAddButton: true,
      currency: fromCurrency,
      title: isEstimateField ? _t('x7QuzmqtLtJyvw6oGZt8TE') : _t('f1fUs5np2HnVWsgQPhB9LC'),
    },
    formItemProps: {
      rules,
      name: 'fromCurrencySize',
      help: comparedTo(value, 0) > 0 && <CoinCurrency coin={fromCurrency} value={value} />,
    },
    inputNumberProps: {
      onChange,
      max: maxQuoteSize,
      min: minQuoteSize,
      unit: (
        <Box display="flex" alignItems="center">
          {Boolean(isLogin && comparedTo(max, 0) > 0) && (
            <Box
              as="a"
              marginRight={8}
              fontWeight={500}
              lineHeight="100%"
              onClick={faskClick}
              fontSize={sm ? 16 : 14}
            >
              {_t('convert.form.input.max.button')}
            </Box>
          )}
          <CurrencySelect
            value={fromCurrency}
            tradeDirection="FROM"
            onChange={handleChangeCurrency}
          />
        </Box>
      ),
    },
  };
}
