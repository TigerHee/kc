/**
 * Owner: borden@kupotech.com
 */
import { useMemo } from 'react';
import { useSelector } from 'dva';
import { checkIsMargin } from '@/meta/tradeTypes';
import { getTradeType } from '@/hooks/common/useTradeType';
import useMarginModel, { getMarginModel } from '@/hooks/useMarginModel';
import { getStateFromStore } from '@/utils/stateGetter';
import useMarginOrderModeType, {
  getMarginOrderModeType,
} from '@/hooks/useMarginOrderModeType';
import { add, normalizeNumber } from 'helper';
import { getCoinInfo, getCurrencyInfo } from './common/useCoin';
import useIsMargin from './useIsMargin';
import { MARGIN_ORDER_MODE_ENUM } from '@/pages/OrderForm/config';

const { AUTO_BORROW, AUTO_BORROW_AND_REPAY } = MARGIN_ORDER_MODE_ENUM;

/**
 * 计算可用
 * 当前下单模式为 自动借币 时 可借
 * 所有的 orderType 都可以借了
 */
export default function useAvailableBalance({ currency, tradeType }) {
  const isLogin = useSelector((state) => state.user.isLogin);
  const tradeMap = useSelector((state) => state.user_assets.tradeMap);
  const { currentMarginOrderMode } = useMarginOrderModeType();
  const {
    // borrowType,
    borrowSizeMap,
    position: marginPosition,
  } = useMarginModel(['borrowSizeMap', 'position', 'borrowType']);
  const isMargin = useIsMargin(tradeType);

  const { precision } = getCoinInfo({ coin: currency });

  const position = isMargin ? marginPosition : tradeMap;

  const borrowSize = borrowSizeMap[currency] || 0;
  const { availableBalance = 0 } = position[currency] || {};

  // 是否可借
  const isCanBorrow = Boolean(
    isMargin &&
      isLogin &&
      // !isTriggerTrade(orderType) &&
      // borrowType === BORROW_TYPE.auto &&
      [AUTO_BORROW, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode) &&
      +borrowSize,
  );

  const normalizeAvailableBalance = useMemo(
    () => normalizeNumber(availableBalance, precision),
    [availableBalance, precision],
  );
  // 加了可借的
  const maxAvailableBalance = useMemo(() => {
    if (!isCanBorrow) return normalizeAvailableBalance;
    return normalizeNumber(add(borrowSize, availableBalance), precision);
  }, [isCanBorrow, borrowSize, availableBalance, precision]);

  return {
    borrowSize,
    isCanBorrow,
    maxAvailableBalance,
    availableBalance: normalizeAvailableBalance,
  };
}

// 计算可用的getter，主要用在快捷下单
export function getAvailableBalance({
  currency,
  side, // 默认 sell
  symbol, // 默认当前交易对
  tradeType, // 默认当前tradeType
}) {
  tradeType = tradeType || getTradeType();
  const isLogin = getStateFromStore((state) => state.user.isLogin);
  const tradeMap = getStateFromStore((state) => state.user_assets.tradeMap);
  const { borrowSizeMap, position: marginPosition } = getMarginModel(
    ['borrowSizeMap', 'position', 'borrowType'],
    {
      symbol,
      tradeType,
    },
  );
  const isMargin = checkIsMargin(tradeType);
  const { precision = 8 } = getCurrencyInfo(currency);

  const position = isMargin ? marginPosition : tradeMap;

  const borrowSize = borrowSizeMap[currency] || 0;
  const { availableBalance = 0 } = position[currency] || {};

  const checkMarginOrderModel = () => {
    const { currentMarginOrderMode } = getMarginOrderModeType({
      side,
      tradeType,
    });
    return [AUTO_BORROW, AUTO_BORROW_AND_REPAY].includes(currentMarginOrderMode);
  };
  // 是否可借
  const isCanBorrow = Boolean(
    isLogin && isMargin && +borrowSize && checkMarginOrderModel(),
  );

  const normalizeAvailableBalance = normalizeNumber(
    availableBalance,
    precision,
  );
  // 加了可借的
  const maxAvailableBalance = !isCanBorrow
    ? normalizeAvailableBalance
    : normalizeNumber(add(borrowSize, availableBalance), precision);

  return {
    borrowSize,
    isCanBorrow,
    maxAvailableBalance,
    availableBalance: normalizeAvailableBalance,
  };
}
