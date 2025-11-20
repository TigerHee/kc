/**
 * Owner: garuda@kupotech.com
 */

import React, { useCallback } from 'react';

import { ICTransfer2Outlined } from '@kux/icons';

import { _t, withYScreen, styled, formatCurrency, MARGIN_MODE_CROSS } from '../../builtinCommon';
import { PrettyCurrency, NewGuide } from '../../builtinComponents';
import {
  useSwitchTrialFund,
  useLoginDrawer,
  useTransfer,
  useShowAbnormal,
  getMarginMode,
} from '../../builtinHooks';
import { useGetAvailableBalance, useGetSymbolInfo } from '../../hooks/useGetData';
import { tradeTransferSensors } from '../../utils';

const AssetsBarWrapper = withYScreen(styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 16px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text40};
`);

const AvailableBox = styled.div`
  display: flex;
  align-items: center;
  font-weight: 500;
  font-size: 12px;
  color: ${(props) => props.theme.colors.text};
  cursor: pointer;
  > svg {
    margin-left: 4px;
  }
`;

const TransferIcon = styled(ICTransfer2Outlined)`
  font-size: 14px;
  color: ${(props) => props.theme.colors.primary};
`;

const AssetsBar = ({ className }) => {
  const availableBalance = useGetAvailableBalance();
  const { symbolInfo } = useGetSymbolInfo();
  const { open, isLogin } = useLoginDrawer();
  const { switchTrialFund } = useSwitchTrialFund();
  const openTransfer = useTransfer();
  const showAbnormal = useShowAbnormal();

  const marginMode = getMarginMode(symbolInfo?.symbol);
  const abnormalResult = marginMode === MARGIN_MODE_CROSS ? showAbnormal() : false;

  const handleTransfer = useCallback(() => {
    if (!isLogin) {
      open();
      return;
    }
    openTransfer(formatCurrency(symbolInfo?.settleCurrency));
    // 埋点
    tradeTransferSensors('4');
  }, [isLogin, open, openTransfer, symbolInfo.settleCurrency]);

  return (
    <NewGuide defaultOpen={isLogin} path="/trade" type="asset" pos={0} placement="left">
      <AssetsBarWrapper className={className}>
        <span>{_t('head.assets')}</span>
        <AvailableBox>
          <PrettyCurrency
            value={abnormalResult || availableBalance}
            currency={symbolInfo?.settleCurrency}
            isShort
            placeholder="--"
          />
          {!switchTrialFund ? <TransferIcon onClick={handleTransfer} /> : null}
        </AvailableBox>
      </AssetsBarWrapper>
    </NewGuide>
  );
};

export default React.memo(AssetsBar);
