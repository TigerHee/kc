/**
 * Owner: clyne@kupotech.com
 */
import { useCallback } from 'react';
import voice from '@/utils/voice';
// hooks
import useI18n from '@/hooks/futures/useI18n';
import useAuthObject from '@/hooks/futures/useAuthObject';
import useAvailableBalance, {
  makeReturnAvailableBalance,
  getAvailableBalance,
} from '@/hooks/futures/useAvailableBalance';
// eslint-disable-next-line max-len
import useContractSizeToFixed from '@/pages/Orders/FuturesOrders/hooks/common/useContractSizeToFixed';
import useBTCUnitObject from '@/pages/Orders/FuturesOrders/hooks/positions/useBTCUnitObject';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import useActiveOrder, {
  useActiveOrderListData,
  useInitActiveOrder,
  ACTIVE_ORDER_ENUM,
  conditionMap,
  getActiveOrders,
  useGetActiveOrders,
} from '@/hooks/futures/useActiveOrder';
import useOrderStop from 'src/trade4.0/hooks/futures/useOrderStop';
// 组件
import AdaptiveDrawer from '@/components/AdaptiveDrawer';
import SymbolText from '@/components/SymbolText';
// import NumberTextField2 from '@/components/NumberInput';
import NumberInput from '@/components/NumberInput';
import PrettyCurrency from '@/components/PrettyCurrency';
import PrettySize from '@/pages/Orders/FuturesOrders/components/PrettySize';
import CoinCurrency from '@/components/CoinCurrency';
import PrettyValue from '@/components/PrettyValue';
import AdaptiveModal from '@/components/AdaptiveModal';
import PreferencesCheckbox from '@/pages/Futures/components/PreferencesCheckbox';
import TextIndexTips from '@/pages/Futures/components/TextIndexTips';

import Maintenance from '../Orders/FuturesOrders/components/Maintenance';

import ButtonGroup, {
  Button as FormButton,
} from '@/pages/OrderForm/FuturesFormNew/components/ButtonGroup';

import DeepIntoRivalContent from '@/pages/Futures/components/DeepIntoRival';
import { useDispatch } from 'dva';
import useInitTradePassword from '../Orders/FuturesOrders/hooks/common/useInitTradePassword';

// meta
export {
  FILLS_MAX_COUNT,
  CLOSE_ADL_LONG,
  CLOSE_ADL_SHORT,
  CLOSE_LIQ_LONG,
  CLOSE_LIQ_SHORT,
  QUANTITY_UNIT,
  orderVars,
  AUTH_INDEX_PRICE,
  priceTypeToLocaleKey,
  CONFIRM_CONFIG,
  MISOPERATION_KEY,
} from '@/meta/futures';

export { FUTURES } from '@/meta/const';

export { stopReferences } from '@/pages/Orders/FuturesOrders/config';

// 全局函数
export { _t, _tHTML } from 'utils/lang';
export { addLangToPath } from 'utils/lang';
export { formatCurrency, quantityPlaceholder, formatNumber } from '@/utils/futures';
export { thousandPointed, floadToPercent } from '@/utils/format';
export { intlFormatNumber, intlFormatDate } from '@/hooks/common/useIntlFormat';
export {
  evtEmitter as eventEmmiter,
  roundDownByStep,
  roundUpByStep,
  getDigit,
  Decimal,
  toPercent,
  moment2Intl,
  formatDateTime,
} from 'helper';

export { getStore } from 'utils/createApp';
export { styled, fx, withMedia } from '@/style/emotion';
export { validatorDeep } from '@/pages/Futures/components/DeepIntoRival/utils';
// hooks
export { useShowWithdrawMargin, useOperatorMarginVisible } from '@/hooks/futures/useOperatorMargin';
export { useUserFee, getUserFee } from '@/hooks/futures/useGetUserFuturesInfo';
export { useGetSymbolInfo, getSymbolInfo } from '@/hooks/common/useSymbol';
export {
  useGetBuySell1,
  useMarkPrice,
  useGetBestTicker,
  usePullBestTicker,
  getBestTicker,
  useMarketInfoForSymbol,
  getMarketInfoForSymbol,
  getLastPrice,
  getMarkPrice,
  getIndexPrice,
  useLastPrice,
  useIndexPrice,
} from '@/hooks/futures/useMarket';
export {
  useGetPositionCalcData,
  useGetRiskRate,
  getPositionCalcData,
} from '@/hooks/futures/useCalcData';
export { useSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';
export { useUnit, useSymbolUnit, useTransformAmount } from '@/hooks/futures/useUnit';
export { useIsBattlePosition, getPosition } from '@/hooks/futures/usePosition';
export { getCurrenciesPrecision } from '@/hooks/futures/useGetCurrenciesPrecision';
export { getLeverage } from '@/hooks/futures/useLeverage';
export {
  voice,
  // 组件
  SymbolText,
  PrettyValue,
  CoinCurrency,
  Maintenance,
  NumberInput,
  TextIndexTips,
  AdaptiveModal,
  PrettySize,
  PrettyCurrency,
  PreferencesCheckbox,
  DeepIntoRivalContent,
  ButtonGroup,
  FormButton,
  AdaptiveDrawer,
  // hooks
  // 条件委托
  useOrderStop,
  // 活动委托
  useActiveOrder,
  useActiveOrderListData,
  useInitActiveOrder,
  ACTIVE_ORDER_ENUM,
  conditionMap,
  getActiveOrders,
  useGetActiveOrders,
  useI18n,
  useAuthObject,
  useLoginDrawer,
  useBTCUnitObject,
  useContractSizeToFixed,
  useAvailableBalance,
  getAvailableBalance,
  makeReturnAvailableBalance,
};

export const useVerify = () => {
  const dispatch = useDispatch();
  const { getPasswordStatus } = useInitTradePassword();

  const checkVerify = useCallback(
    async (callback) => {
      const hasCheckPassword = await getPasswordStatus();
      if (!hasCheckPassword) {
        dispatch({
          type: 'futures_orders/update',
          payload: {
            checkPasswordVisible: true,
            checkPasswordFinishCallback: () => {
              callback && callback();
            },
          },
        });
      } else {
        callback && callback();
      }
    },
    [dispatch, getPasswordStatus],
  );

  return { checkVerify };
};
