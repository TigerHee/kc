/**
 * Owner: harry.lai@kupotech.com
 */
import React from 'react';
import SymbolPrecision from '@/components/SymbolPrecision';
import CoinCodeToName from '@/components/CoinCodeToName';
import { CoinCodeToNameWrapper } from '../index.style';

export * from './TwapRunStatusHeader';

export const NumUnitComp = ({
  symbol,
  value,
  precisionKey,
  precisionCoin,
  coin,
  unitClassName,
}) => (
  <React.Fragment>
    <span className="mr-2">
      <SymbolPrecision
        symbol={symbol}
        value={value}
        precisionKey={precisionKey}
        coin={precisionCoin}
      />
    </span>

    <CoinCodeToNameWrapper className={unitClassName || ''}>
      <CoinCodeToName coin={coin} />
    </CoinCodeToNameWrapper>
  </React.Fragment>
);
