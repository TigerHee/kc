/**
 * Owner: Ray.Lee@kupotech.com
 */
import { useSelector } from 'dva';
import useSide from '@/pages/OrderForm/hooks/useSide';
import { useTradeType, getTradeType } from './common/useTradeType';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';

const getCurrent = ({
  side,
  tradeType,
  marginOrderModeBuy,
  marginOrderModeSell,
  isolatedOrderModeBuy,
  isolatedOrderModeSell,
}) => {
  const isBuy = side === 'buy';

  let currentMarginOrderMode = '';
  let currentMarginOrderModeKey = '';
  if (tradeType === TRADE_TYPES_CONFIG.MARGIN_TRADE.key) {
    currentMarginOrderMode = isBuy ? marginOrderModeBuy : marginOrderModeSell;
    currentMarginOrderModeKey = isBuy
      ? 'marginOrderModeBuy'
      : 'marginOrderModeSell';
  }

  if (tradeType === TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key) {
    currentMarginOrderMode = isBuy
      ? isolatedOrderModeBuy
      : isolatedOrderModeSell;
    currentMarginOrderModeKey = isBuy
      ? 'isolatedOrderModeBuy'
      : 'isolatedOrderModeSell';
  }
  return {
    currentMarginOrderMode,
    currentMarginOrderModeKey,
  };
};

/**
 * 杠杆/逐仓下单模式 买卖 对应的 值 normal ｜ borrow | repay
 * 之前是逐仓每个 交易对都会有各自的 自动还币，现在是和全仓一样不去分交易对了
 * 分为四种
 * 全仓对应的买卖单
 * 逐仓对应的买卖单
 */
const useMarginOrderModeType = () => {
  const { side } = useSide();
  const tradeType = useTradeType();
  const marginOrderModeBuy = useSelector(
    (state) => state.tradeForm.marginOrderModeBuy,
  );
  const marginOrderModeSell = useSelector(
    (state) => state.tradeForm.marginOrderModeSell,
  );
  const isolatedOrderModeBuy = useSelector(
    (state) => state.tradeForm.isolatedOrderModeBuy,
  );
  const isolatedOrderModeSell = useSelector(
    (state) => state.tradeForm.isolatedOrderModeSell,
  );

  const result = {
    marginOrderModeBuy,
    marginOrderModeSell,
    isolatedOrderModeBuy,
    isolatedOrderModeSell,
  };
  return {
    ...result,
    ...getCurrent({ side, tradeType, ...result }),
  };
};
// params.side不传默认sell
export const getMarginOrderModeType = (params) => {
  const tradeType = params?.tradeType || getTradeType();
  const marginOrderModeBuy = getStateFromStore(
    (state) => state.tradeForm.marginOrderModeBuy,
  );
  const marginOrderModeSell = getStateFromStore(
    (state) => state.tradeForm.marginOrderModeSell,
  );
  const isolatedOrderModeBuy = getStateFromStore(
    (state) => state.tradeForm.isolatedOrderModeBuy,
  );
  const isolatedOrderModeSell = getStateFromStore(
    (state) => state.tradeForm.isolatedOrderModeSell,
  );

  const result = {
    marginOrderModeBuy,
    marginOrderModeSell,
    isolatedOrderModeBuy,
    isolatedOrderModeSell,
  };
  return {
    ...result,
    ...getCurrent({ tradeType, ...result, ...params }),
  };
};

export default useMarginOrderModeType;
