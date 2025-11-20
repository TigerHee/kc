/*
 * @Owner: Clyne@kupotech.com
 */

import React from 'react';
import ADL from './ADL';
import Lev from './Lev';
import MarginMode from './MarginMode';
import Side from './Side';
import { CellWrapper, MidCellWrapper, SymbolWrapper } from './style';

import SymbolText from '../SymbolText';
import Tips, { TrialFund } from '../SymbolText/TrialToolTips';

import SettleDateTip from '@/pages/Futures/components/SettleDateTip/SettleDateTip';

const SymbolCell = (props) => {
  const {
    comp = null,
    symbol,
    isTrialFunds,
    marginMode,
    side,
    adl,
    screen,
    wrap,
    isShowTrialFundsTips = false,
    onSymbolClick,
    onLevEdit,
    shareSlot,
    isMobile,
    lastSlot,
    showTrialFundIcon = false,
    isPos = false,
  } = props;
  const isShowMid = screen !== 'lg2' && screen !== 'lg3';
  const _isTrialFund = isTrialFunds;
  const trialFundCell =
    !isShowMid && _isTrialFund ? (
      showTrialFundIcon ? (
        <TrialFund isShow={isShowTrialFundsTips} />
      ) : (
        <Tips className="nowap marginL" isShow={isShowTrialFundsTips} />
      )
    ) : undefined;
  const Cell = (
    <CellWrapper>
      {!isShowMid && isPos ? (
        <SettleDateTip className="pad" symbol={symbol} showText={false} />
      ) : null}
      {trialFundCell}
    </CellWrapper>
  );

  const MidTrialFund =
    _isTrialFund && isShowMid ? (
      showTrialFundIcon ? (
        <TrialFund isShow={isShowTrialFundsTips} />
      ) : (
        <Tips className="nowap marginL" isShow={isShowTrialFundsTips} />
      )
    ) : null;

  const MidCell = (
    <MidCellWrapper className="marginL">
      {isShowMid && isPos ? (
        <SettleDateTip className="pad" symbol={symbol} showText={false} />
      ) : null}
      {MidTrialFund}
    </MidCellWrapper>
  );
  return (
    <SymbolWrapper screen={screen} wrap={wrap} className="symbol-cell">
      <SymbolText
        onSymbolClick={onSymbolClick}
        className="nowap symbol-content"
        symbol={symbol}
        isNewDisplay
        hasLink
        trialFundCell={Cell}
      />
      {isMobile ? null : shareSlot}
      <div className="symbol-other">
        {comp}
        <Side className="nowap marginL" side={side} />
        <MarginMode className="nowap marginL" marginMode={marginMode} />
        <Lev row={props} className="nowap marginL" onLevEdit={onLevEdit} />
        {MidCell}
        <ADL adl={adl} className="marginL6" />
        {isMobile ? shareSlot : null}
        {lastSlot}
      </div>
    </SymbolWrapper>
  );
};

export default React.memo(SymbolCell);
