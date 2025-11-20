/**
 * Owner: judith@kupotech.com
 */

import React from 'react';
import { styled } from '@kux/mui/emotion';
import { Spin as FlexSpin } from '@kux/mui';
import CoinIcon from '../components/MuiCoinIcon';
import CoinPrecision from '../components/CoinPrecision';

const Spin = styled(FlexSpin)`
  display: block;
  width: 100%;
`;

const SymbolWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > div {
    margin-right: 12px;
    &:last-of-type {
      margin-right: 0;
    }
  }
`;

const SymbolBox = styled.div`
  cursor: pointer;
  flex: 1;
  border: 1px solid
    ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.cover12)};
  padding: 16px;
  border-radius: 8px;
  height: 75px;
  background: ${({ isActive, theme }) => (isActive ? theme.colors.cover4 : theme.colors.layer)};
  > div {
    /* display: block; */
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
    font-size: 16px;
    img {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }
  }
`;

const Balance = styled.span`
  display: inline-block;
  margin-left: 32px;
  font-size: 14px;
  position: relative;
  top: -8px;
  color: ${({ theme }) => theme.colors.text40};
`;

const SymbolSelector = React.memo((props) => {
  const { showBalance = true, onChange, currencies, value, loading } = props;

  return (
    <Spin spinning={loading}>
      <SymbolWrapper>
        {currencies.map((item) => (
          <SymbolBox
            key={item.currency}
            isActive={value === item.currency}
            onClick={() => onChange(item.currency)}
          >
            <CoinIcon showIcon currency={item.currency} />
            {showBalance && (
              <Balance>
                <CoinPrecision coin={item.currency} value={item.availableBalance || 0} fixZero />
              </Balance>
            )}
          </SymbolBox>
        ))}
      </SymbolWrapper>
    </Spin>
  );
});

export default SymbolSelector;
