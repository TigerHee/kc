/**
 * Owner: garuda@kupotech.com
 */
import React, { useEffect } from 'react';

import { moment2Intl } from 'helper';

import { _t, _tHTML } from 'utils/lang';

import storage from 'utils/storage';

import { getSymbolInfo, useGetCurrentSymbol } from '@/hooks/common/useSymbol';

import { symbolToText } from '@/hooks/futures/useGetSymbolText';
import { FUTURES } from '@/meta/const';
import { SUSTAIN_CONTRACT } from '@/meta/futures';
import { useOperatorResultPrompt } from '@/pages/Futures/components/ResultPromptDialog/hooks';

import { useContractSettlement } from '@/pages/Futures/hooks/useContractSettlement';

import CheckboxTip from './CheckboxTip';
import { LOCAL_SETTLE_WARNING_KEY } from './config';

const SettleWarningCheck = () => {
  const { onOpenDialog } = useOperatorResultPrompt();
  const symbol = useGetCurrentSymbol();
  const isSettle = useContractSettlement(symbol);

  const localWarningMap = storage.getItem(LOCAL_SETTLE_WARNING_KEY);

  useEffect(() => {
    if (localWarningMap && localWarningMap[symbol]) return;

    const symbolInfo = getSymbolInfo({ symbol, tradeType: FUTURES });

    const isSustain = symbolInfo?.type === SUSTAIN_CONTRACT;
    // 如果是即将下线，并且为永续合约
    if (isSettle && isSustain) {
      onOpenDialog({
        type: 'warning',
        title: _t('open.riskTips'),
        content: _tHTML('futures.settleToolTip', {
          symbol: symbolToText(symbolInfo),
          settleDate: moment2Intl({
            date: symbolInfo.settleDate,
            format: 'YYYY/MM/DD HH:mm:ss',
            timeZone: '8',
          }),
        }),
        slot: <CheckboxTip symbol={symbol} />,
      });
    }
  }, [isSettle, localWarningMap, onOpenDialog, symbol]);

  return null;
};

export default React.memo(SettleWarningCheck);
