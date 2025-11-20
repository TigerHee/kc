/*
 * owner: borden@kupotech.com
 */
import { useEventCallback } from '@kux/mui';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE } from '../../config';

export default function usePriceSymbol(params) {
  const { onChange } = params || {};
  const dispatch = useDispatch();
  const priceSymbol = useSelector((state) => state[NAMESPACE].priceSymbol);
  const [priceBaseCurrency, priceQuoteCurrency] = priceSymbol.split('-');

  const handleChange = useEventCallback(() => {
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        priceSymbol: [priceQuoteCurrency, priceBaseCurrency].join('-'),
      },
    });
    if (onChange) onChange({ base: priceQuoteCurrency, quote: priceBaseCurrency });
  });

  return {
    priceSymbol,
    priceBaseCurrency,
    priceQuoteCurrency,
    onChange: handleChange,
  };
}
