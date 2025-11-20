/*
 * @owner: borden@kupotech.com
 */
import { useEffect, useCallback } from 'react';
import { useTradeType } from '@/hooks/common/useTradeType';
import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import useOrderType from '../../../hooks/useOrderType';
import useSide from '../../../hooks/useSide';

export default function useInitForm({ form, setErrors, setFocusField }) {
  const { side } = useSide();
  const tradeType = useTradeType();
  const currentSymbol = useGetCurrentSymbol();
  const { orderType, isMarket } = useOrderType();

  useEffect(() => {
    setErrors(null);
    setFocusField(null);
    form.resetFields();
    if (isMarket) {
      form.setFieldsValue({ price: 1 });
    }
  }, [tradeType, orderType, side, currentSymbol]);

  return useCallback(() => {
    let fields = Object.keys(form.getFieldsValue());
    if (isMarket) {
      fields = fields.filter(v => v !== 'price');
    }
    form.resetFields(fields);
  }, [isMarket]);
}
