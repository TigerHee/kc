/*
 * @owner: odan.ou@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch } from 'dva';
import { useTradeType } from '@/hooks/common/useTradeType';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';

const useOrderValidate = () => {
  const dispatch = useDispatch();
  const tradeType = useTradeType();
  const { isOCODisplay, showTSO } = TRADE_TYPES_CONFIG[tradeType] || {};
  // OCO
  useEffect(() => {
    if (!isOCODisplay) {
      dispatch({
        type: 'trade/update',
        payload: {
          ocoEnable: false,
        },
      });
    } else {
      dispatch({ type: 'trade/ocoValidation' });
    }
  }, [dispatch, isOCODisplay]);

  // 跟踪委托
  useEffect(() => {
    dispatch({
      type: 'trade/tsoValidation',
      payload: {
        show: typeof showTSO !== 'boolean' ? false : showTSO,
      },
    });
  }, [dispatch, showTSO]);
};

export default useOrderValidate;
