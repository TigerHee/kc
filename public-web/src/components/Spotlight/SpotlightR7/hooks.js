/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { useCallback, useEffect, useRef, useState } from 'react';
import { shallowEqual } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import siteCfg from 'src/utils/siteConfig';
import { addLangToPath } from 'tools/i18n';

const { KUCOIN_HOST } = siteCfg;

let intr = null;


// kyc逻辑
export const useKyc = () => {
  const isInApp = JsBridge.isApp();

  // kyc
  const handleKyc = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/user/kyc',
        },
      });
      return;
    }
    window.location.href = addLangToPath(`${KUCOIN_HOST}/account/kyc`);
  }, [isInApp]);
  return { handleKyc };
};

// 去充币
export const useDeposit = () => {
  const isInApp = JsBridge.isApp();
  // 充币
  const handleDeposit = useCallback(() => {
    if (isInApp) {
      JsBridge.open({
        type: 'jump',
        params: {
          url: '/account/deposit',
          // coin: 'USDT',
        },
      });
      return;
    }
    window.location.href = addLangToPath(`${KUCOIN_HOST}/assets/coin`);
  }, [isInApp]);
  return { handleDeposit };
};
