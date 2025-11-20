/*
 * owner: june.lee@kupotech.com
 */
import { isNil } from 'lodash';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, useEventCallback, useResponsive, useLatest } from '@kux/mui';
import StakingCurrencySelect from '../StakingCurrencySelect';
import CoinCurrency from '../../../components/common/CoinCurrency';
import useContextSelector from '../../../hooks/common/useContextSelector';
import { fromCurrencySizeValidator } from '../utils/StakingValidator';
import { validateEmpty, getMax, getSymbolConfig } from '../../../utils/tools';
import { comparedTo, isFinite, formatNumberByStep } from '../../../utils/format';
import { NAMESPACE, STAKING_ACCOUNT_TYPE } from '../../../config';
import {
  useConvertSymbolsMap,
  useFromCurrency,
  useToCurrency,
} from '../../../hooks/form/useStoreValue';

export default function useStakingFromField({
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
  const toCurrency = useToCurrency();
  const fromCurrency = useFromCurrency();
  const convertSymbolsMap = useConvertSymbolsMap();

  const balance = positions?.[STAKING_ACCOUNT_TYPE]?.[fromCurrency];
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
    // 无变化，不触发change逻辑
    if (v === fromCurrency) return;
    const newToCurrency = toCurrency;
    if (v !== toCurrency) {
      dispatch({
        type: `${NAMESPACE}/pullStakingPosition`,
        payload: {
          currencies: [v, newToCurrency].filter(Boolean),
        },
      });
    }
    dispatch({
      type: `${NAMESPACE}/updateStakingCurrency`,
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
          <StakingCurrencySelect
            value={fromCurrency}
            tradeDirection="FROM"
            onChange={handleChangeCurrency}
          />
        </Box>
      ),
    },
  };
}
