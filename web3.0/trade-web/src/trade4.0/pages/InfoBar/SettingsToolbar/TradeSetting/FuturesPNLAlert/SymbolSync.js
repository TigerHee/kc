/**
 * Owner: clyne@kupotech.com
 */

import { styled } from '@/style/emotion';
import React from 'react';
import useI18n from '@/hooks/futures/useI18n';
import SymbolText from '@/components/SymbolCodeToName';
// import { useSelector } from 'dva';
// import { useAsync } from './hooks/useAsync';
import { useGetCurrentSymbol } from 'src/trade4.0/hooks/common/useSymbol';

const SymbolWrapper = styled.div`
  padding: 29px 0 12px 0;
  .symbol-current {
    display: flex;
    align-items: center;
    padding-bottom: 12px;
    font-weight: 400;
    .symbol-label {
      padding-right: 8px;
      color: ${(props) => props.theme.colors.text40};
    }
    .symbol-text {
      font-weight: 500;
      .base-symbol {
        padding-right: 4px;
      }
      color: ${(props) => props.theme.colors.text};
      .currencyText {
        color: ${(props) => props.theme.colors.text};
      }
    }
  }

  .sync-all-symbol {
    width: fit-content;
    color: ${(props) => props.theme.colors.primary};
    cursor: pointer;
  }
`;

const SymbolSync = () => {
  const currentSymbol = useGetCurrentSymbol();
  // const { asyncSymbol } = useAsync();
  const { _t } = useI18n();
  return (
    <SymbolWrapper>
      <div className="symbol-current">
        <div className="symbol-label">{_t('setting.pnl.current')}</div>
        <SymbolText boxClassName="symbol-text" code={currentSymbol} tradeType="FUTURES" />
      </div>
      {/* <div className="sync-all-symbol" onClick={asyncSymbol}>
        {_t('setting.pnl.for.all')}
      </div> */}
    </SymbolWrapper>
  );
};

export default SymbolSync;
