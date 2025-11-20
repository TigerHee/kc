/**
 * Owner: clyne@kupotech.com
 */
import { _t, _tHTML } from 'utils/lang';
import { quantityToText } from '@/pages/Orders/FuturesOrders/util';

const TextIndexTips = (props = {}) => {
  const { langKey, contract, langProps = {} } = props;

  const tips = quantityToText(contract);

  return _tHTML(langKey, {
    ...langProps,
    tips,
  });
};

TextIndexTips.QuantityToText = quantityToText;

export default TextIndexTips;
