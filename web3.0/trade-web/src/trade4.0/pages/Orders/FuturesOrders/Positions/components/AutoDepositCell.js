/**
 * Owner: charles.yang@kupotech.com
 */

import React, { memo, useCallback } from 'react';
import { _t } from 'utils/lang';
import { useDispatch } from 'react-redux';
import _ from 'lodash';
import { useGetSymbolInfo } from '@/hooks/common/useSymbol';
import { FUTURES } from '@/meta/const';
import { Switch } from '@kux/mui';
import { styled, fx } from '@/style/emotion';
import { futuresSensors } from 'src/trade4.0/meta/sensors';
import { useGetUserFuturesPermissions } from 'src/trade4.0/hooks/futures/useGetUserFuturesInfo';
import { AUTO_APPEND_MARGIN_KEY } from '@/pages/InfoBar/SettingsToolbar/TradeSetting/futuresConfig';

const AutoDepositCellWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.fontSize('12')}
  ${fx.lineHeight('16')}
  ${fx.fontWeight('400')}
`;

const AutoDepositCell = ({ symbol, autoDeposit, trialCode, isTrialFunds }) => {
  const contract = useGetSymbolInfo({ symbol, tradeType: FUTURES });
  const { status } = contract;
  const dispatch = useDispatch();
  const needTips = useGetUserFuturesPermissions({ type: AUTO_APPEND_MARGIN_KEY });
  const handleChange = useCallback(
    (checkStatus) => {
      futuresSensors.position.autoAddMarginCommit.click();
      const handle = () => {
        dispatch({
          type: 'futures_orders/updateMarginAutoAppend',
          payload: {
            symbol,
            status: checkStatus,
            trialCode,
            isTrialFunds,
          },
        });
      };
      if (needTips) {
        dispatch({
          type: 'futuresSetting/update',
          payload: {
            tipsVisible: true,
            autoMarginTipsStatus: autoDeposit,
            tipsCallback: () => {
              handle();
            },
          },
        });
      } else {
        handle();
      }
    },
    [autoDeposit, dispatch, isTrialFunds, needTips, symbol, trialCode],
  );

  return (
    <AutoDepositCellWrapper>
      <Switch disabled={status === 'Paused'} checked={autoDeposit} onChange={handleChange} />
    </AutoDepositCellWrapper>
  );
};

export default memo(AutoDepositCell);
