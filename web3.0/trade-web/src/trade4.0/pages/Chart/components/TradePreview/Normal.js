/**
 * Owner: jessie@kupotech.com
 */
import React, { useMemo } from 'react';
import { useTheme } from '@kux/mui';
import previewDark from '@/assets/chart/preview-dark.png';
import previewLight from '@/assets/chart/preview-light.png';
import SymbolCodeToName from '@/components/SymbolCodeToName';
import CountDown from './CountDown';
import { NormalWrapper, CoinSummaryWrapper, TitleWrapper, CoinWrapper, DescWrapper } from './style';

const Normal = ({ symbol, symbolInfo, coinSummary, iconUrl }) => {
  const { currentTheme } = useTheme();

  const coinSummaryComp = useMemo(() => {
    if (coinSummary?.introduce_text && coinSummary?.introduce_text !== '-') {
      return (
        <CoinSummaryWrapper>
          <TitleWrapper>
            <img width={20} height={20} src={iconUrl} />
            <CoinWrapper>
              <span className="coinSymbol">{coinSummary?.symbol}</span>
              <span className="coinName">{coinSummary?.name}</span>
            </CoinWrapper>
          </TitleWrapper>
          <DescWrapper
            dangerouslySetInnerHTML={{ __html: coinSummary?.introduce_text.replace(/↵/g, '') }}
          />
        </CoinSummaryWrapper>
      );
    }
    return null;
  }, [coinSummary]);

  return (
    <NormalWrapper>
      <div className="left">
        <div className="top">
          <div className="symbolWrapper">
            <div className="symbol">
              <SymbolCodeToName code={symbol} />
            </div>

            <CountDown symbolInfo={symbolInfo} symbol={symbol} />
          </div>

          <img className="topImg" src={currentTheme === 'dark' ? previewDark : previewLight} />
        </div>

        {coinSummaryComp}
      </div>
      <div className="right">
        <img src={currentTheme === 'dark' ? previewDark : previewLight} />
      </div>
    </NormalWrapper>
  );
};
export default Normal;
