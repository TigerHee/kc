/**
 * Owner: garuda@kupotech.com
 * 获取最大最小杠杆
 */
import {
  useMemo,
  // useCallback
} from 'react';

import { FUTURES } from '@/meta/const';
import { min, max, greaterThanOrEqualTo } from 'utils/operation';
import { formatNumber } from '@/utils/futures';
import { trackClick } from 'src/utils/ga';
import { ADJUST_LEVERAGE } from '@/meta/futuresSensors/withdraw';

import { useGetAppendMarginDetail } from '@/hooks/futures/useGetFuturesPositionsInfo';
import { useMaxWithdrawMargin } from '@/hooks/futures/useOperatorMargin';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
import { useUserMaxLeverage } from '@/hooks/futures/useGetUserFuturesInfo';
import useAvailableBalance from '@/hooks/futures/useAvailableBalance';
import { getSymbolInfo } from '@/hooks/common/useSymbol';
import { useMarkPrice } from '@/hooks/futures/useMarket';

import { maxAdjustableLeverage, minAdjustableLeverage, orderValue } from '../formula';
// import { OUT_MAX } from '../config';

const useLeverageProps = () => {
  // const dispatch = useDispatch();
  const {
    symbol,
    size,
    markValue,
    margin,
    settleCurrency,
    posComm,
    leverage: pLeverage,
  } = useGetAppendMarginDetail();
  const userMaxLeverage = useUserMaxLeverage();
  // 获取当前标记价格
  const markPrice = useMarkPrice(symbol);

  // 获取 contract
  const contract = getSymbolInfo({ symbol, tradeType: FUTURES });
  // 获取余额
  const availableBalance = useAvailableBalance(settleCurrency);

  // 获取计算后的值
  const calcData = useGetPositionCalcData(symbol);
  // 获取最大可提取保证金
  const maxMargin = useMaxWithdrawMargin(symbol);
  // 当前的总保证金
  const totalMargin = calcData?.totalMargin || margin;
  // 当前的真实杠杆
  const realLeverage = calcData?.realLeverage || pLeverage;
  // 计算当前的标记价值
  const calcMakValue = markPrice ? orderValue({ contract, size, price: markPrice }) : markValue;

  // 获取最小杠杆
  const minLeverage = useMemo(() => {
    return minAdjustableLeverage({
      markValue: calcMakValue,
      totalMargin,
      posComm,
      availableBalance,
    });
  }, [availableBalance, calcMakValue, posComm, totalMargin]);

  // 获取最大杠杆
  const maxLeverage = useMemo(() => {
    // 先跟现在的杠杆取个大值，防止算出来小一点
    const realLeverageMax = max(
      realLeverage,
      maxAdjustableLeverage({
        markValue: calcMakValue,
        totalMargin,
        posComm,
        maxWithdrawMargin: maxMargin,
      }),
    );
    const checkMaxLeverage = min(realLeverageMax, userMaxLeverage);
    return formatNumber(checkMaxLeverage, { fixed: 2, pointed: false, dropZ: false });
  }, [calcMakValue, maxMargin, posComm, realLeverage, totalMargin, userMaxLeverage]);

  // 判断是否需要 disabled
  const disabled = useMemo(() => {
    if (!availableBalance && !maxMargin) {
      // 埋点
      trackClick([ADJUST_LEVERAGE, '9']);
      return true;
    }
    if (greaterThanOrEqualTo(minLeverage)(maxLeverage)) {
      // 埋点
      trackClick([ADJUST_LEVERAGE, '9']);
      return true;
    }
    return false;
  }, [availableBalance, maxLeverage, maxMargin, minLeverage]);

  // const onOutRangeMessage = useCallback(
  //   ({ type, leverage }) => {
  //     dispatch({
  //       type: 'notice/feed',
  //       payload: {
  //         type: 'message.error',
  //         message:
  //           type === OUT_MAX
  //             ? _t('leverage.greaterThan.max', { leverage })
  //             : _t('leverage.lessThan.min', { leverage }),
  //       },
  //     });
  //   },
  //   [_t, dispatch],
  // );

  return {
    disabled,
    realLeverage,
    minLeverage,
    maxLeverage,
    // onOutRangeMessage,
  };
};

export default useLeverageProps;
