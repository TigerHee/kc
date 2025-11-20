/**
 * Owner: odan.ou@kupotech.com
 */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'dva';
import { TRADE_TYPES_CONFIG } from './useTradeTypes';


/**
 * 订单校验逻辑
 * @param {{
 *  tradeType?: string
 * }} conf
 */
const useOrderValidate = (conf) => {
  const { tradeType } = conf;
  const dispatch = useDispatch();
  const { isLogin } = useSelector(state => state.user);
  // 展示跟踪委托
  const showTSO = TRADE_TYPES_CONFIG[tradeType]?.showTSO;
  useEffect(() => {
    if (!isLogin) return;
    dispatch({
      type: 'trade/tsoValidation',
      payload: {
        show: typeof showTSO !== 'boolean' ? false : showTSO,
      },
    });
  }, [dispatch, showTSO, isLogin]);
};

export default useOrderValidate;
