/**
 * Owner: roger@kupotech.com
 */
import React, { CSSProperties, useCallback, useEffect, type FC } from 'react';
import { setTradeSource } from 'packages/header/Header/tools';
import addLangToPath from 'tools/addLangToPath';
import PriceRate from '../../PriceRate';
import SymbolFlag from '../../SymbolFlag';
import PreviewTag from '../../PreviewTag';
import SymbolCodeToName from '../../SymbolCodeToName';
import FutureSymbolText from '../../FutureSymbolText';
import { MARGINTYPE_MAP, TRADETYPE_MAP } from '../config';

import { kcsensorsClick, kcsensorsManualTrack } from '../../../common/tools';
import { useTenantConfig } from '../../../tenantConfig';
import styles from './styles.module.scss';
import clsx from 'clsx';

export interface MarketRowProps {
  record: any;
  sort?: any;
  marginTab?: string;
  symbolsMap?: any;
  tradeType: string;
  style?: CSSProperties;
  clickAdditional?: Function;
  additional?: any;
  icon: string;
  lang: string;
  inDrawer?: boolean;
}

const MarketRow: FC<MarketRowProps> = props => {
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
    inDrawer
  } = props;
  const TRADE_PATH = '/trade';
  const tenantConfig = useTenantConfig();
  const KUMEX_TRADE = tenantConfig.KUMEX_TRADE;

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
  url = addLangToPath(url);
  const isPreview = symbolsMap && symbolsMap[symbolCode] && symbolsMap[symbolCode].previewEnableShow;

  const handleRowClick = useCallback(
    data => {
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
    [clickAdditional, sort, tradeType]
  );

  useEffect(() => {
    if (clickAdditional) {
      kcsensorsManualTrack([additional.pagecate, '1'], {
        ...additional,
      });
    }
  }, [additional, clickAdditional]);

  return (
    <a href={url} onClick={handleRowClick} style={style} className={clsx([styles.wrapper, inDrawer && styles.inDrawerWrapper, 'dropdown-search-item'])}>
      {tradeType === TRADETYPE_MAP.FUTURES_CURRENCY || tradeType === TRADETYPE_MAP.FUTURES_USDT ? (
        <div className={styles.contentWrapper}>
          <FutureSymbolText
            isTag
            symbol={symbol}
            contract={record}
            icon={icon}
            symbolNameClassName={styles.symbolName}
            symbolTagClassName={styles.symbolTag}
          />
        </div>
      ) : (
        <div className={styles.contentWrapper} data-inspector="inspector_header_search_trade_row">
          <SymbolCodeToName icon={icon} code={symbolCode} />
          <>
            {tenantConfig.showMarginFlag ? <SymbolFlag type={marginTab} symbol={symbolCode} /> : null}
            {isPreview ? <PreviewTag /> : null}
          </>
        </div>
      )}
      <PriceRate value={changeRate} price={lastTradedPrice} lang={lang} />
    </a>
  );
};

export default MarketRow;
