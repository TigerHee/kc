/**
 * Owner: jesse.shao@kupotech.com
 */
import { debounce } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { openPage } from 'src/helper';
import { useSelector, useDispatch } from 'dva';
import { useIsMobile } from 'src/components/Responsive';
import { M_KUCOIN_HOST, TRADE_HOST } from 'utils/siteConfig';

const getPlatformUrlKey = (isInApp) => {
  if (isInApp) return 'appUrl';
  // if (isMobile) return 'h5Url';
  return 'pcUrl';
};

// 去现货交易页面的跳转添加
export const TRADE_URL = {
  appUrl: `/trade`,
  pcUrl: `${TRADE_HOST}/BTC-USDT`,
  h5Url: `${M_KUCOIN_HOST}/trade/BTC-USDT`,
};

const useGoTrade = () => {
  const isInApp = useSelector((state) => state.app.isInApp);
  const isMobile = useIsMobile();
  const platform = getPlatformUrlKey(isInApp, isMobile);

  // 3个端的链接，都是去现货交易页面
  const handleTradeNow = useCallback(
    debounce(
      (preFn) => {
        if (typeof preFn === 'function') {
          preFn();
        }

        const url = TRADE_URL[platform];
        if (url) {
          openPage(isInApp, url);
        }
      },
      500,
      {
        leading: true,
        trailing: false,
      },
    ),
    [],
  );

  return {
    handleTradeNow,
  };
};

export default useGoTrade;
