/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2024-02-27 13:34:18
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2024-10-15 20:18:38
 * @FilePath: /trade-web/src/trade4.0/hooks/useCustomerUrl.js
 * @Description:
 */
/**
 * Owner: Ray.Lee@kupotech.com
 */

import { useCallback } from 'react';
import { _t, addLangToPath } from 'utils/lang';
import { siteCfg } from 'config';
import { commonSensorsFunc } from '@/meta/sensors';
import { useTradeType } from './common/useTradeType';
import { FUTURES, ISOLATED, MARGIN, SPOT } from '../meta/const';

const { MAINSITE_HOST } = siteCfg;

const URL_ENUM = {
  // 杠杆
  [ISOLATED]: addLangToPath(`${MAINSITE_HOST}/support/categories/6023982352153`),
  [MARGIN]: addLangToPath(`${MAINSITE_HOST}/support/categories/6023982352153`),
  // 现货
  [SPOT]: addLangToPath(`${MAINSITE_HOST}/support/categories/6023873154969`),
  // 合约
  [FUTURES]: addLangToPath(`${MAINSITE_HOST}/support/categories/4403571259289`),
};

const URL_ENUM_TH = {
  // 杠杆
  [ISOLATED]: addLangToPath(`${MAINSITE_HOST}/support/categories/6023982352153`),
  [MARGIN]: addLangToPath(`${MAINSITE_HOST}/support/categories/6023982352153`),
  // 现货
  [SPOT]: addLangToPath(`${MAINSITE_HOST}/support/categories/10457940174607`),
  // 合约
  [FUTURES]: addLangToPath(`${MAINSITE_HOST}/support/categories/10395126387343`),
};

const useCustomerUrl = () => {
  const tradeType = useTradeType();
  const url = window._BRAND_SITE_ === 'TH' ? URL_ENUM_TH[tradeType] : URL_ENUM[tradeType];
  const openUrl = useCallback(() => {
    commonSensorsFunc(['tradeZoneFunctionArea', 'help', 'click']);
    window.open(url);
  }, [url]);

  return {
    url,
    openUrl,
  };
};

export default useCustomerUrl;
