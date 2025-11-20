/**
 * Owner: garuda@kupotech.com
 */
import React, { useState, useEffect, useCallback } from 'react';

import { trackClick } from 'src/utils/ga';
import { _t } from 'utils/lang';

import SymbolText from '@/components/SymbolText';

import { useGetCurrentSymbol } from '@/hooks/common/useSymbol';
import { MARGIN_MODE_ISOLATED, MARGIN_MODE_CROSS } from '@/meta/futures';
import { RISK_LIMIT } from '@/meta/futuresSensors/trade';
import { useMarginMode, useSupportMarginMode } from '@/pages/Futures/components/MarginMode/hooks';
import { styled } from '@/style/emotion';

import CrossView from './CrossView';
import RiskLimit from './IsolatedRiskLimit/FuturesRiskLimit';

const ButtonGroup = styled.div`
  margin: 0 0 18px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.cover4};
`;

const ButtonItem = styled.div`
  display: flex;
  flex: 1;
  max-width: 50%;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  cursor: pointer;
  text-align: center;
  justify-content: center;
  background-color: ${(props) => (props.active ? props.theme.colors.layer : 'transparent')};
  color: ${(props) => (props.active ? props.theme.colors.text : props.theme.colors.text60)};
`;

const WrapperBox = styled.div`
  padding: 24px 32px 104px;
  width: 100%;
  ${(props) => props.theme.breakpoints.down('sm')} {
    padding: 16px 16px 104px;
  }
`;

const SymbolBox = styled.div`
  margin: 0 0 24px;
  display: flex;
  align-items: center;
  font-size: 14px;
  line-height: 1.3;
  color: ${(props) => props.theme.colors.text};

  .currentSymbol {
    color: ${(props) => props.theme.colors.text40};
    margin-right: 8px;
  }

  .currencyText {
    color: ${(props) => props.theme.colors.text};
  }
`;

const ContentMap = {
  [MARGIN_MODE_CROSS]: (props) => <CrossView {...props} />,
  [MARGIN_MODE_ISOLATED]: (props) => <RiskLimit {...props} />,
};

const FuturesConfigIndex = (props) => {
  const symbol = useGetCurrentSymbol();
  const { getMarginModeForSymbol } = useMarginMode();
  const currentMarginMode = getMarginModeForSymbol(symbol);
  const { getSupportMarginModeForSymbol } = useSupportMarginMode();
  const [marginMode, setMarginMode] = useState(MARGIN_MODE_ISOLATED);

  useEffect(() => {
    setMarginMode(currentMarginMode);
  }, [currentMarginMode]);

  const canSupport = getSupportMarginModeForSymbol(symbol);

  const handleChangeType = useCallback(
    (type) => {
      setMarginMode(type);
      // 埋点
      trackClick([RISK_LIMIT, marginMode === MARGIN_MODE_ISOLATED ? '3' : '4']);
    },
    [marginMode],
  );

  return (
    <WrapperBox>
      <SymbolBox>
        <div className="currentSymbol">{_t('trade.settingFutures.title')}</div>
        <SymbolText symbol={symbol} />
      </SymbolBox>

      {canSupport ? (
        <ButtonGroup>
          <ButtonItem
            onClick={() => handleChangeType(MARGIN_MODE_CROSS)}
            active={marginMode === MARGIN_MODE_CROSS}
          >
            {_t('futures.cross')}
          </ButtonItem>
          <ButtonItem
            onClick={() => handleChangeType(MARGIN_MODE_ISOLATED)}
            active={marginMode === MARGIN_MODE_ISOLATED}
          >
            {_t('futures.isolated')}
          </ButtonItem>
        </ButtonGroup>
      ) : null}
      {ContentMap[marginMode] && ContentMap[marginMode](props)}
    </WrapperBox>
  );
};

export default React.memo(FuturesConfigIndex);
