/**
 * Owner: garuda@kupotech.com
 * 杠杆调整
 */
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { trackClick } from 'utils/ga';
import { lessThan } from 'utils/operation';

import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { getSwitchTrialFund } from '@/hooks/futures/useFuturesTrialFund';
import { useGetKycInfo } from '@/hooks/futures/useGetUserFuturesInfo';
import { useGetMaxLeverage } from '@/hooks/futures/useLeverage';
import useLoginDrawer from '@/hooks/useLoginDrawer';
import { FUTURES } from '@/meta/const';
import { SENSORS_MARGIN_TYPE, tradeLev } from '@/meta/futuresSensors/trade';

import { getMarginMode } from '@/pages/Futures/components/MarginMode/hooks';
import { eventEmmiter } from '@/pages/Futures/import';

const event = eventEmmiter.getEvt();
// 获取弹框值
export const useLeverageProps = () => {
  const { open, isLogin } = useLoginDrawer();

  const [leverageProps, setLeverageProps] = useState({
    visible: false,
    marginMode: null,
    symbol: '',
  });

  const handleOpen = useCallback(({ symbol, marginMode }) => {
    if (!isLogin) {
      open();
      return;
    }
    const currentMarginMode = marginMode || getMarginMode(symbol);
    setLeverageProps({ visible: true, marginMode: currentMarginMode, symbol });
    // 埋点
    trackClick([tradeLev, '2'], { marginType: SENSORS_MARGIN_TYPE[currentMarginMode] });
  }, [isLogin, open]);

  const handleClose = useCallback(() => {
    setLeverageProps({ visible: false, marginMode: null, symbol: '' });
  }, []);

  useEffect(() => {
    event.on('event/futures@leverage_dialog_open', handleOpen);
    event.on('event/futures@leverage_dialog_close', handleClose);
    return () => {
      event.off('event/futures@leverage_dialog_open', handleOpen);
      event.off('event/futures@leverage_dialog_close', handleClose);
    };
  });

  return {
    visible: leverageProps.visible,
    marginMode: leverageProps.marginMode,
    symbol: leverageProps.symbol,
    onClose: handleClose,
  };
};

// 获取是否展示 kyc 提示
export const useShowKycTip = ({ symbol, marginMode }) => {
  const isLogin = useSelector((state) => state.user.isLogin);
  const userMaxLeverage = useGetMaxLeverage({ symbol, marginMode, isUser: true });
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const kycInfo = useGetKycInfo();
  // 是否展示最大杠杆 kyc 认证提示，登陆用户 && 当前杠杆小于风险限额杠杆 or 小于合约可用杠杆
  const getShowMaxInfo = useCallback(() => {
    if (!symbol || !isLogin || !symbolInfo || !kycInfo) return false;
    const { switchTrialFund } = getSwitchTrialFund();
    // 开启体验金，不校验风险限额与 kyc 提示
    if (!userMaxLeverage || switchTrialFund) {
      return false;
    }
    return lessThan(userMaxLeverage)(symbolInfo?.maxLeverage) && kycInfo?.kycLevel < 2;
  }, [isLogin, symbol, userMaxLeverage, symbolInfo, kycInfo]);

  return getShowMaxInfo;
};
