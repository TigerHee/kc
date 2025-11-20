/**
 * Owner: solar@kupotech.com
 */
import { useMemo } from 'react';
import { useTransferSelector } from '../utils/redux';
import { useFormField } from './fields';

export function useCoinCodeToName() {
  const currencies = useTransferSelector((state) => state.currencies);
  const currencyCode = useFormField('currency');
  return useMemo(() => {
    return (
      currencies.find((currency) => currency.currency === currencyCode)?.currencyName ||
      currencyCode
    );
  }, [currencyCode, currencies]);
}
