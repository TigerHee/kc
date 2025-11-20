/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import { ICArrowRightOutlined } from '@kux/icons';
import { useSymbolCellNeedInfo } from '@/hooks/futures/useGetSymbolText';
import { useGetPositionCalcData } from '@/hooks/futures/useCalcData';
// import Decimal from 'decimal.js';
import { Link } from 'components/Router';
import { formatNumber } from '@/utils/futures';
import AdlTips from './AdlTips';
import { useLink } from '../../hooks/common/useLink';
import TrialToolTips from '../../components/TrialToolTips';
import RealLeverage from './RealLeverage';

const Wrapper = styled.div`
  display: flex;
`;

const SymbolCellWrapper = styled.div`
  ${(props) => fx.display(props.noFold ? 'flex' : 'block')}
  ${fx.alignItems('center')}
  ${fx.flexFlow('wrap')}
`;
const SymbolInfoContent = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${(props) => fx.color(props, 'text60')}
`;

const SymbolName = styled.span`
  ${(props) => fx.color(props, 'text')}
  ${fx.marginRight('4')}
`;
const SymbolType = styled.span`
  ${(props) => fx.color(props, 'text60')}
`;

const SymbolOtherContent = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('baseline')}
  ${fx.marginTop('2')}
  flex-wrap: wrap;
  .trial-fund {
    margin: 0 4px 2px 0;
  }
`;

const SideContent = styled.div`
  white-space: nowrap;
  ${fx.paddingLeft('4')}
  ${fx.paddingRight('4')}
  ${fx.lineHeight('16')}
  ${fx.marginRight('4')}
  ${(props) => (props.isLong ? fx.color(props, 'primary') : fx.color(props, 'secondary'))}
  ${(props) => {
    return props.isLong
      ? fx.backgroundColor(props, 'primary12')
      : fx.backgroundColor(props, 'secondary12');
  }}
  ${fx.borderRadius('4px')}
`;

const MultipleContent = styled.div`
  white-space: nowrap;
  ${fx.paddingLeft('4')}
  ${fx.paddingRight('4')}
  ${fx.lineHeight('16')}
  ${(props) => fx.color(props, 'text60')}
  ${(props) => fx.backgroundColor(props, 'cover8')}
  ${fx.borderRadius('4px')}
  ${fx.marginRight('6')}
`;

const SymbolWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
`;

const SymbolCell = ({ row = {}, noFold }) => {
  const { currentQty, delevPercentage, symbol, isTrialFunds } = row;
  const { symbolTextInfo } = useSymbolCellNeedInfo(symbol);
  const { name, type } = symbolTextInfo;
  const isLong = currentQty > 0; // 判断做空还是做多，正数做多，负数做空
  const { onClick } = useLink({ symbol });

  return (
    <Wrapper>
      <SymbolCellWrapper noFold={noFold}>
        <Link href={`/trade/futures/${symbol}`} onClick={onClick}>
          <SymbolInfoContent>
            <SymbolWrapper dir="ltr">
              <SymbolName>{name}</SymbolName>
              <SymbolType>{type}</SymbolType>
            </SymbolWrapper>
            <div className="iconRtl">
              <ICArrowRightOutlined />
            </div>
          </SymbolInfoContent>
        </Link>
        <SymbolOtherContent>
          {isTrialFunds ? <TrialToolTips /> : <></>}
          <SideContent isLong={isLong}>{isLong ? _t('trade.long') : _t('trade.short')}</SideContent>
          <RealLeverage {...row} />
          <AdlTips delevPercentage={delevPercentage} />
        </SymbolOtherContent>
      </SymbolCellWrapper>
    </Wrapper>
  );
};

export default memo(SymbolCell);
