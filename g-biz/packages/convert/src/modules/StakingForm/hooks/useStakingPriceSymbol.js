/*
 * owner: june.lee@kupotech.com
 */
import { useEventCallback } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE } from '../../../config';

export default function useStakingPriceSymbol(params) {
  const { onChange } = params || {};
  const dispatch = useDispatch();
  const priceSymbolStaking = useSelector((state) => state[NAMESPACE].priceSymbolStaking);
  const [priceBaseCurrency, priceQuoteCurrency] = priceSymbolStaking.split('-');

  const handleChange = useEventCallback(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        priceSymbolStaking: [priceQuoteCurrency, priceBaseCurrency].join('-'),
      },
    });
    if (onChange) onChange({ base: priceQuoteCurrency, quote: priceBaseCurrency });
  });

  return {
    priceSymbol: priceSymbolStaking,
    priceBaseCurrency,
    priceQuoteCurrency,
    onChange: handleChange,
  };
}
