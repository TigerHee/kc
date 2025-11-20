/*
 * owner: june.lee@kupotech.com
 */
import { useEventCallback } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE } from '../../../config';

export default function useUSDDPriceSymbol(params) {
  const { onChange } = params || {};
  const dispatch = useDispatch();
  const priceSymbolUSDD = useSelector((state) => state[NAMESPACE].priceSymbolUSDD);
  const [priceBaseCurrency, priceQuoteCurrency] = priceSymbolUSDD.split('-');

  const handleChange = useEventCallback(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        priceSymbolUSDD: [priceQuoteCurrency, priceBaseCurrency].join('-'),
      },
    });
    if (onChange) onChange({ base: priceQuoteCurrency, quote: priceBaseCurrency });
  });

  return {
    priceSymbol: priceSymbolUSDD,
    priceBaseCurrency,
    priceQuoteCurrency,
    onChange: handleChange,
  };
}
