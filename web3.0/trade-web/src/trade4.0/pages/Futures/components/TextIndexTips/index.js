/**
 * Owner: clyne@kupotech.com
 */
import { _t, _tHTML } from 'utils/lang';
import { formatCurrency } from '@/utils/futures';

const QuantityToText = (contract) => {
  if (!contract) return '-';
  const { multiplier, baseCurrency, quoteCurrency, isInverse } = contract;
  if (isInverse) {
    return `(1 ${_t('global.unit')} = ${Math.abs(multiplier)}${quoteCurrency})`;
  }
  return `(1 ${_t('global.unit')} = ${multiplier}${formatCurrency(baseCurrency)})`;
};

const TextIndexTips = (props = {}) => {
  const { langKey, contract, langProps = {} } = props;

  const tips = QuantityToText(contract);

  return _tHTML(langKey, {
    ...langProps,
    tips,
  });
};

TextIndexTips.QuantityToText = QuantityToText;

export default TextIndexTips;
