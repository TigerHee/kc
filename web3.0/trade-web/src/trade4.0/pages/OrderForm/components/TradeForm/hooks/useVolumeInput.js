/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-12-12 15:19:33
 * @LastEditors: gannicus Gannicus.Zhou@kupotech.com
 * @LastEditTime: 2023-12-13 15:02:58
 * @FilePath: /trade-web/src/trade4.0/pages/OrderForm/components/TradeForm/hooks/useVolumeInput.js
 * @Description:
 */
/*
 * @owner: borden@kupotech.com
 */
import React from 'react';
import { useSelector } from 'dva';
import { isNil, min } from 'lodash';
import { _t } from 'src/utils/lang';
import { dropZero, separateNumber } from 'src/helper';
import usePair from '@/hooks/common/usePair';
import useAmountConfig from './useAmountConfig';
import useSide from '../../../hooks/useSide';
import { validateEmpty, numberFormatter, calcMaxVolume } from '../../../utils';
import { useGetCurrentSymbolInfo } from '@/hooks/common/useSymbol';
import { track } from 'src/utils/ga';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import { useTradeType } from '@/hooks/common/useTradeType';

export default function useVolumeInput({
  name = 'volume',
  unitValue,
}) {
  const { side } = useSide();
  const { symbol: currentSymbol, baseInfo, quoteInfo } = usePair();
  const isLogin = useSelector((state) => state.user.isLogin);
  const tradeType = useTradeType();
  const { getTradeResult } = TRADE_TYPES_CONFIG[tradeType] || {};
  const { currency: base, currencyName: baseName } = baseInfo;
  const { currencyName: quoteName } = quoteInfo;
  const tradeResultForSensors = {
    trade_pair: currentSymbol,
    trade_currency: base,
    trade_type: side,
  };
  const volumeValidator = (_, value) => {
    if (isNil(value) || !isLogin) {
      return Promise.resolve();
    }
    value = +value;
    const coinName = quoteName;
    // 最小值校验 https://k-devdoc.atlassian.net/wiki/spaces/XHPT/pages/213483815/Improve+conversion+rate
    if (value < +unitValue) {
      if (getTradeResult) {
        track(
          'spot_trade_Minimum_amount_limit',
          getTradeResult(tradeResultForSensors),
        );
      }
      return Promise.reject(
        _t('trd.form.quote.min', {
          amount: separateNumber(dropZero(unitValue)),
          coin: coinName,
        }),
      );
    }
    return Promise.resolve();
  };
  return {
    formItemProps: {
      name,
      rules: [
        {
          validator: validateEmpty,
          validateTrigger: 'onSubmit',
        },
        {
          validator: volumeValidator,
        },
      ],
    },
  };
}
