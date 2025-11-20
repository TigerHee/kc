/**
 * Owner: garuda@kupotech.com
 * 显示 Kyc 认证提示，认证高级 Kyc 升级最大可开杠杆
 */

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { siteCfg } from 'config';

import Alert from '@mui/Alert';

import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { _tHTML, addLangToPath, FUTURES } from '@/pages/Futures/import';


import { KuxAlertWrapper } from './commonStyle';
import { useShowKycTip } from './hooks';

const KycTip = ({ symbol, userMaxLeverage }) => {
  const symbolInfo = useGetSymbolInfo({ symbol, tradeType: FUTURES });

  return (
    <>
      {_tHTML('trade.lev.kyecMax.tips', {
        href: addLangToPath(
          `${siteCfg.MAINSITE_HOST}/account/kyc?backUrl=${encodeURIComponent(
            window.location.href,
          )}`,
        ),
        lev: userMaxLeverage,
        iLev: symbolInfo?.maxLeverage,
      })}
    </>
  );
};

const KycAlertInfo = ({ open, symbol, userMaxLeverage, marginMode }) => {
  const [showMaxInfo, setShowMaxInfo] = useState(false);
  const getShowMaxInfo = useShowKycTip({ symbol, marginMode });
  const isLogin = useSelector((state) => state.user.isLogin);

  // 组件渲染, 并且打开以及登陆 判断一次
  useEffect(() => {
    if (open && isLogin) {
      const show = getShowMaxInfo();
      setShowMaxInfo(show);
    }
  }, [getShowMaxInfo, isLogin, marginMode, open, symbol]);

  if (!showMaxInfo) return null;

  return (
    <KuxAlertWrapper>
      <Alert
        showIcon
        type="info"
        title={<KycTip symbol={symbol} userMaxLeverage={userMaxLeverage} />}
      />
    </KuxAlertWrapper>
  );
};

export default React.memo(KycAlertInfo);
