/**
 * Owner: borden@kupotech.com
 */
/*
 * @Author: Borden.Lan
 * @Date: 2021-05-24 15:17:05
 * @Description: 获取最大可用(杠杆的包含了可用+可借)及可用
 */
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'dva';
import { checkIsMargin } from 'utils/hooks/useTradeTypes';
import useMarginModel from 'utils/hooks/useMarginModel';
import { BORROW_TYPE, isTriggerTrade } from 'pages/Trade3.0/components/TradeBox/TradeForm/const';
import { add, normalizeNumber } from 'helper';

export default (currency) => {
  const { isLogin } = useSelector(state => state.user);
  const { tradeMap } = useSelector(state => state.user_assets);
  const { tradeType } = useSelector(state => state.trade);
  const { type } = useSelector(state => state.tradeForm);
  const categories = useSelector(state => state.categories);
  const isMargin = checkIsMargin(tradeType);
  const { precision } = categories[currency] || {};
  const {
    borrowType,
    borrowSizeMap,
    position: marginPosition,
  } = useMarginModel(['borrowSizeMap', 'position', 'borrowType']);
  const position = isMargin ? marginPosition : tradeMap;

  const borrowSize = borrowSizeMap[currency] || 0;
  const { availableBalance = 0 } = position[currency] || {};

  const [maxAvailableBalance, setMaxAvailableBalance] = useState(0);

  const normalizeAvailableBalance = useMemo(
    () => normalizeNumber(availableBalance, precision),
    [availableBalance, precision],
  );
  useEffect(() => {
    if (!isLogin || !precision) {
      setMaxAvailableBalance(0);
    } else if (
      !isMargin ||
      !+borrowSize ||
      isTriggerTrade(type) ||
      borrowType === BORROW_TYPE.manual
    ) {
      setMaxAvailableBalance(normalizeAvailableBalance);
    } else if (+borrowSize) {
      const nextBalance = normalizeNumber(add(borrowSize, availableBalance), precision);
      setMaxAvailableBalance(nextBalance);
    }
  }, [isLogin, isMargin, type, borrowSize, borrowType, availableBalance, precision]);

  return [maxAvailableBalance, normalizeAvailableBalance];
};
