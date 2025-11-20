/**
 * Owner: garuda@kupotech.com
 */
import React, { useCallback } from 'react';

import Switch from '@mui/Switch';
import Tooltip from '@mui/Tooltip';

import { MARGIN_MODE_CROSS, _t, styled } from '../../builtinCommon';
import {
  useSwitchTrialFund,
  useTrialFundActivateDialog,
  useWatchHidden,
  useSymbolSupportTrialFund,
  useGetUserOpenFutures,
  useMarginMode,
} from '../../builtinHooks';

import { useGetSymbolInfo } from '../../hooks/useGetData';
import { tradeTrialFundSwitchSensors } from '../../utils';
import { SpanUnderline } from '../commonStyle';

const TrialFundBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  .tips {
    font-size: 12px;
    font-weight: 500;
    line-height: 1.3;
    color: ${(props) => props.theme.colors.text40};
  }
`;

const TextTip = styled.div`
  font-size: 14px;
  line-height: 1.5;
  font-weight: 500;
`;

const SwitchComp = styled(Switch)`
  transform: rotate(0) !important;
`;

const TrialFundSwitch = ({ className = '' }) => {
  const {
    isHasTrialFund,
    isAvailableTrialFund,
    switchTrialFund,
    onSwitchTrialFund,
  } = useSwitchTrialFund();
  const { onTrialFundActivateDialog } = useTrialFundActivateDialog();
  const watchHidden = useWatchHidden();

  const { symbol } = useGetSymbolInfo();
  const isSupportCurrentSymbol = useSymbolSupportTrialFund(symbol);
  const isOpen = useGetUserOpenFutures();
  const { getMarginModeForSymbol } = useMarginMode();
  const marginMode = getMarginModeForSymbol(symbol);

  const handleChange = useCallback(
    (v) => {
      if (!isAvailableTrialFund && v) {
        onTrialFundActivateDialog(true);
        return;
      }
      onSwitchTrialFund(v);
      // 体验金切换埋点
      tradeTrialFundSwitchSensors({ status: v });
    },
    [isAvailableTrialFund, onSwitchTrialFund, onTrialFundActivateDialog],
  );

  if (
    !isHasTrialFund ||
    watchHidden ||
    !isSupportCurrentSymbol ||
    !isOpen ||
    marginMode === MARGIN_MODE_CROSS
  ) {
    return null;
  }

  return (
    <TrialFundBox className={className}>
      <Tooltip placement="top" title={<TextTip>{_t('trialFund.switch.tips')}</TextTip>}>
        <SpanUnderline className="tips">{_t('trialFund.switch')}</SpanUnderline>
      </Tooltip>
      <SwitchComp size="small" checked={switchTrialFund} onChange={handleChange} />
    </TrialFundBox>
  );
};

export default React.memo(TrialFundSwitch);
