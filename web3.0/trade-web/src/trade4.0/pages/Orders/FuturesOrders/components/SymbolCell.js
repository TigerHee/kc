/**
 * Owner: charles.yang@kupotech.com
 */
import React, { memo } from 'react';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import { ICArrowRightOutlined } from '@kux/icons';
import { useSymbolCellNeedInfo } from '@/hooks/futures/useGetSymbolText';
import { Link } from 'components/Router';
import { useLink } from '../hooks/common/useLink';
import TrialToolTips from './TrialToolTips';
import LeverageCell from './LeverageCell';

const SymbolCellWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-right: 4px;
  flex-direction: row;
  > a {
    display: flex;
    flex-wrap: wrap;
  }

  .extend {
    display: flex;
    align-items: center;
    .trial-fund {
      margin: 0 4px 0 0;
    }
  }
`;
const SymbolInfoContent = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  ${(props) => fx.color(props, 'text60')}
`;

const SymbolName = styled.div`
  white-space: nowrap;
  ${(props) => fx.color(props, 'text')}
  ${fx.marginRight('4')}
  [dir='rtl'] & {
    margin-right: unset;
    ${fx.marginLeft('4')}
  }
`;
const SymbolType = styled.div`
  white-space: nowrap;
  ${(props) => fx.color(props, 'text60')}
`;
const SymbolWrapper = styled.div`
  ${fx.display('flex')}
  ${fx.alignItems('center')}
  flex-flow: wrap;
  flex-shrink: 1;
`;

const SymbolCell = ({ screen, symbol, isTrialFunds = false, leverage }) => {
  const { symbolTextInfo } = useSymbolCellNeedInfo(symbol);
  const { name, type } = symbolTextInfo;
  const { onClick } = useLink({ symbol });
  return (
    <SymbolCellWrapper className="common-symbol" screen={screen}>
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
      <div className="extend">
        {isTrialFunds ? <TrialToolTips /> : null}
        {leverage ? <LeverageCell realLeverage={leverage} /> : null}
      </div>
    </SymbolCellWrapper>
  );
};

export default memo(SymbolCell);
