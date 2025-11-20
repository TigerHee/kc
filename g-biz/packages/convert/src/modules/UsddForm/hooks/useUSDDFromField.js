/*
 * owner: june.lee@kupotech.com
 */
import { isNil } from 'lodash';
import { useTranslation } from '@tools/i18n';
import React, { useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, useEventCallback, useResponsive, useLatest } from '@kux/mui';
import CurrencySelect from '../../../components/CurrencySelect';
import CoinCurrency from '../../../components/common/CoinCurrency';
import useContextSelector from '../../../hooks/common/useContextSelector';
import { fromCurrencySizeValidator } from '../utils/usddValidator';
import { validateEmpty, getMax } from '../../../utils/tools';
import { comparedTo, isFinite, formatNumberByStep } from '../../../utils/format';
import { NAMESPACE } from '../../../config';
import { useConvertSymbolsMap, useFromCurrency } from '../../../hooks/form/useStoreValue';

export default function useUSDDFromField({
  form,
  value,
  onChange,
  triggerValidate,
  estimateFieldName,
}) {
  const { sm } = useResponsive();
  const { t: _t } = useTranslation('convert');
  const isLogin = useContextSelector((state) => Boolean(state.user));
  const positions = useSelector((state) => state[NAMESPACE].positions);
  const accountType = useSelector((state) => state[NAMESPACE].accountType);
  const fromCurrency = useFromCurrency();
  const convertSymbolsMap = useConvertSymbolsMap();

  const balance = positions?.[accountType]?.[fromCurrency];
  const isEstimateField = estimateFieldName === 'fromCurrencySize';
  const { maxSize: maxQuoteSize, minSize: minQuoteSize, step: tickSize } =
    convertSymbolsMap[fromCurrency] ?? {};

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
          <CurrencySelect value={fromCurrency} tradeDirection="FROM" readOnly />
        </Box>
      ),
    },
  };
}
