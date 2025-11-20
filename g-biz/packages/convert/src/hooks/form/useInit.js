/*
 * @owner: borden@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NAMESPACE, ORDER_TYPE_ENUM, ORDER_TYPE_MAP } from '../../config';

export default function useInit({ defaultOrderType, defaultToCurrency, defaultFromCurrency }) {
  const dispatch = useDispatch();
  const currentOrderType = useSelector((state) => state[NAMESPACE].orderType);

  // 初始化orderType
  useEffect(() => {
    const initOrderType = ORDER_TYPE_MAP[defaultOrderType]
      ? defaultOrderType
      : ORDER_TYPE_ENUM.MARKET;
    dispatch({
      type: `${NAMESPACE}/update`,
      payload: {
        orderType: initOrderType,
      },
    });
  }, [dispatch, defaultOrderType]);
  // 初始化币种
  useEffect(() => {
    if (defaultFromCurrency && defaultToCurrency) {
      const updateCurrencyEffectName = ORDER_TYPE_MAP[defaultOrderType]?.updateCurrencyEffectName;
      // USDD不支持初始化币种
      if (!updateCurrencyEffectName || defaultOrderType === ORDER_TYPE_ENUM.USDD) return;
      dispatch({
        type: `${NAMESPACE}/${updateCurrencyEffectName}`,
        payload: {
          toCurrency: defaultToCurrency,
          fromCurrency: defaultFromCurrency,
        },
      });
    }
  }, [dispatch, defaultFromCurrency, defaultToCurrency, defaultOrderType]);

  useEffect(() => {
    const getConvertSymbolsEffectName =
      ORDER_TYPE_MAP[currentOrderType]?.getConvertSymbolsEffectName;
    if (!getConvertSymbolsEffectName) return;
    dispatch({
      type: `${NAMESPACE}/${getConvertSymbolsEffectName}`,
      payload: {
        orderType: currentOrderType,
      },
    });
  }, [currentOrderType, dispatch]);
}
