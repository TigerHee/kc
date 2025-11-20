/**
 * Owner: roger@kupotech.com
 */
import React, { useCallback, useEffect } from 'react';
import { setTradeSource } from '@packages/header/src/Header/tools';
import siteConfig from '../../../Header/siteConfig';
import PriceRate from '../../PriceRate';
import SymbolFlag from '../../SymbolFlag';
import PreviewTag from '../../PreviewTag';
import SymbolCodeToName from '../../SymbolCodeToName';
import FutureSymbolText from '../../FutureSymbolText';
import { MARGINTYPE_MAP, TRADETYPE_MAP } from '../config';
import { kcsensorsClick, kcsensorsManualTrack, addLangToPath } from '../../../common/tools';
import { Wrapper, ContentWrapper } from './styled';
import { tenantConfig } from '../../../tenantConfig';

const MarketRow = (props) => {
  const {
    record,
    sort,
    record: { symbolCode, changeRate, lastTradedPrice, symbol },
    marginTab, // 杠杆类型
    symbolsMap,
    tradeType,
    style,
    clickAdditional,
    additional,
    icon,
    lang,
  } = props;
  const { KUMEX_TRADE } = siteConfig;
  const TRADE_PATH = '/trade';

  let url = `${TRADE_PATH}/${symbol || symbolCode}`;
  if (tradeType === TRADETYPE_MAP.MARGIN) {
    // 逐仓杠杆
    if (marginTab === MARGINTYPE_MAP.MARGIN_ISOLATED_TRADE) {
      url = `${TRADE_PATH}/isolated/${symbol || symbolCode}`;
    } else {
      // 全部 或 全仓杠杆
      url = `${TRADE_PATH}/margin/${symbol || symbolCode}`;
    }
  }
  if (tradeType === TRADETYPE_MAP.FUTURES_CURRENCY || tradeType === TRADETYPE_MAP.FUTURES_USDT) {
    url = `${KUMEX_TRADE}/${symbol}`;
  }
  url = addLangToPath(url, lang);
  const isPreview =
    symbolsMap && symbolsMap[symbolCode] && symbolsMap[symbolCode].previewEnableShow;

  const handleRowClick = useCallback(
    (data) => {
      setTradeSource(url); // 记录跳转来源

      if (clickAdditional) {
        clickAdditional(data);
        return;
      }
      kcsensorsClick(['navigationDropDownSymbol', '1'], {
        postTitle: tradeType,
        sortPosition: sort,
        pagecate: 'navigationDropDownSymbol',
      });
    },
    [clickAdditional, sort, tradeType],
  );

  useEffect(() => {
    if (clickAdditional) {
      kcsensorsManualTrack([additional.pagecate, '1'], {
        ...additional,
      });
    }
  }, [additional, clickAdditional]);

  return (
    <Wrapper href={url} onClick={handleRowClick} style={style}>
      {tradeType === TRADETYPE_MAP.FUTURES_CURRENCY || tradeType === TRADETYPE_MAP.FUTURES_USDT ? (
        <ContentWrapper>
          <FutureSymbolText isTag symbol={symbol} contract={record} icon={icon} />
        </ContentWrapper>
      ) : (
        <ContentWrapper data-inspector="inspector_header_search_trade_row">
          <SymbolCodeToName icon={icon} code={symbolCode} />
          <>
            {tenantConfig.showMarginFlag ? (
              <SymbolFlag type={marginTab} symbol={symbolCode} />
            ) : null}
            {isPreview ? <PreviewTag /> : null}
          </>
        </ContentWrapper>
      )}
      <PriceRate value={changeRate} price={lastTradedPrice} lang={lang} />
    </Wrapper>
  );
};

export default MarketRow;
