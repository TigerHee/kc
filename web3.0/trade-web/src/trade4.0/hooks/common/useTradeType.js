/**
 * Owner: borden@kupotech.com
 */
import { useSelector } from 'dva';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { getStateFromStore } from '@/utils/stateGetter';

export const useTradeType = () => {
  return useSelector((state) => state.trade.tradeType);
};

export const setTradeType = async (dispatch, value) => {
  await dispatch({
    type: 'trade/update_trade_type',
    payload: {
      tradeType: value,
    },
  });
};

export const getTradeType = () => {
  return getStateFromStore((state) => state.trade.tradeType);
};
// 获取币对是否支持某个交易类型
export const useSymbolIsSupportTradeType = ({ symbol, tradeType }) => {
  const currentTradeType = useTradeType();
  const marginSymbolsMap = useSelector(
    (state) => state.symbols.marginSymbolsMap,
  );

  if (!tradeType) {
    tradeType = currentTradeType;
  }

  if (!symbol) {
    return false;
  }
  const { checkIsSupportBySymbol } = TRADE_TYPES_CONFIG[tradeType] || {};
  if (typeof checkIsSupportBySymbol !== 'function') {
    return true;
  }
  return Boolean(checkIsSupportBySymbol({ ...marginSymbolsMap[symbol] }));
};

export const getSymbolIsSupportTradeType = ({ symbol, tradeType, marginSymbolsMap = {} }) => {
  if (!symbol || !TRADE_TYPES_CONFIG[tradeType]) {
    return false;
  }
  const { checkIsSupportBySymbol } = TRADE_TYPES_CONFIG[tradeType];
  if (typeof checkIsSupportBySymbol !== 'function') {
    return true;
  }
  return Boolean(checkIsSupportBySymbol({ ...marginSymbolsMap[symbol] }));
};
