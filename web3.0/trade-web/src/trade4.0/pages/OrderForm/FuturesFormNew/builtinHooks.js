/**
 * Owner: garuda@kupotech.com
 * 使用到公共 hooks 的，都从这里引入
 */
import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import useAvailableBalance from '@/hooks/futures/useAvailableBalance';
import useOpenFuturesDialog from '@/hooks/futures/useOpenFuturesDialog';
import useLoginDrawer from '@/hooks/useLoginDrawer';

import { formatCurrency } from './builtinCommon';

export { isSpotTypeSymbol } from '@/hooks/common/useIsSpotSymbol';

export { useSetTooltip } from '@/components/FormComponent/config';
export { useCrossTotalMargin, getCrossTotalMargin } from '@/hooks/futures/useCrossTotalMargin';
export {
  useGetCurrenciesPrecision,
  getCurrenciesPrecision,
} from '@/hooks/futures/useGetCurrenciesPrecision';
export { getActiveOrders } from '@/hooks/futures/useActiveOrder';
export {
  useGetPositionCalcData,
  getPositionCalcData,
  getIMR,
  getMMR,
} from '@/hooks/futures/useCalcData';
export {
  useCurrentCoupon,
  useCouponRuleDialog,
  useCouponRuleInfo,
} from '@/hooks/futures/useFuturesCoupon';
export {
  useTrialFundDialog,
  useSwitchTrialFund,
  useTrialFundDetail,
  useWatchHidden,
  useSymbolSupportTrialFund,
  useTrialFundActivateDialog,
  useTrialFundInsufficientDialog,
  useTrialRuleDialog,
  useTrialRuleInfo,
} from '@/hooks/futures/useFuturesTrialFund';
export {
  useGetUserOpenFutures,
  useRiskLimit,
  useOperatorRiskLimit,
  useGetRiskLimit,
  getRiskLimit,
  getUserFee,
  useUserFee,
  useGetLocalSetting,
} from '@/hooks/futures/useGetUserFuturesInfo';
export { useLeverageDialog, useGetMaxLeverage, useGetLeverage } from '@/hooks/futures/useLeverage';
export { getPosition, useGetPosition } from '@/hooks/futures/usePosition';
export {
  useGetCurrentSymbol,
  useGetSymbolInfo,
  useFuturesCrossConfigForSymbol,
  getFuturesCrossConfigForSymbol,
} from '@/hooks/common/useSymbol';
export {
  baseCurrencyToQty,
  getUnit,
  useUnit,
  useSetUnit,
  toMakeTradingUnitQty,
  qtyToBaseCurrency,
} from '@/hooks/futures/useUnit';

export { useIsRTL } from '@/hooks/common/useLang';
export { useMarginMode, getMarginMode } from '@/pages/Futures/components/MarginMode/hooks';
export {
  useGetBestTicker,
  useMarketInfoForSymbol,
  usePullBestTicker,
  useGetBuySell1,
  useMarkPrice,
  useIndexPrice,
  useLastPrice,
  useGetBestTickerForSymbol,
} from '@/hooks/futures/useMarket';
export { useCrossGrayScale } from '@/hooks/futures/useCrossGrayScale';
export { useShowAbnormal } from '@/components/AbnormalBack/hooks';

export { isOpenFuturesCross } from '@/meta/const';

export {
  useFuturesGetTaxFee,
  useFuturesTakerFee,
  getFuturesTaxFee,
  getFuturesTakerFee,
} from '@/hooks/futures/useFuturesTakerFee';

export { useDisplayRule, useCompliantShow } from '@/components/CompliantRule/hook';

// TIPS: 合约这边没有 Y轴缩进，写一个假的方法
export { useYScreen } from '@/pages/OrderForm/config';

// TIPS: 合约这边的 useVerify 方法不一致，需要手动改造
export { useVerify } from './config';

// TIPS: 合约这边的 划转操作不一致，需要手动改造
export const useTransfer = () => {
  const dispatch = useDispatch();
  const openTransfer = useCallback(
    (settleCurrency = 'USDT') => {
      dispatch({
        type: 'transfer/updateTransferConfig',
        payload: {
          visible: true,
          initCurrency: formatCurrency(settleCurrency),
        },
      });
    },
    [dispatch],
  );

  return openTransfer;
};

// 简单封装一个提示操作
export const useNoticeFeed = () => {
  const dispatch = useDispatch();

  const noticeFeed = useCallback(
    ({ type = 'message.success', message = '' }) => {
      dispatch({
        type: 'notice/feed',
        payload: {
          type,
          message,
        },
      });
    },
    [dispatch],
  );

  return noticeFeed;
};

export { useAvailableBalance, useLoginDrawer, useOpenFuturesDialog };
