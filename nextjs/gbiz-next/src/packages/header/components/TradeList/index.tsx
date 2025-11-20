/**
 * Owner: roger@kupotech.com
 */
import React, { useEffect, useState, useCallback, useMemo, useRef, type FC } from 'react';
import { trim, debounce, forEach, map, indexOf } from 'lodash-es';
import { Input } from '@kux/design';
import { SearchIcon } from '@kux/iconpack';
import { useIsomorphicLayoutEffect } from 'hooks';
import {
  getMarketSymbolsByQuote,
  getLeverageMenuItem,
  getMenuItemSearchSpot,
  getMenuItemSearchLeverage,
  getFuturesMarketList,
} from '../../Header/service';
import List from './List';
import Tabs from './Tabs';
import BotList from './Bot';
import useLang from 'hooks/useLang';
import { useCommonService } from 'packages/header/hookTool/useCommonService';
import { TRADETYPE_MAP, MARGINTYPE_MAP, FUTURES_MAP, WITH_SEARCH_LIST, MARGIN_TABS_LABEL } from './config';
import { kcsensorsManualTrack } from '../../common/tools';
import styles from './styles.module.scss';
import { useTranslation } from 'tools/i18n';
import { useHeaderStore } from 'packages/header/Header/model';
import { bootConfig } from 'kc-next/boot';
import clsx from 'clsx';

const MinContainerHeight = 288;

interface TradeListProps {
  tradeType: string;
  lang: string;
  userInfo: any;
  parentRef: any;
  visible: boolean;
  needLoad: boolean;
  className?: string;
}

const TradeList: FC<TradeListProps> = props => {
  const { tradeType, lang, userInfo, parentRef, visible, needLoad, className } = props;
  const { t } = useTranslation('header');
  const { isRTL } = useLang();
  const { pullCurrencies, pullSymbols } = useCommonService();
  const [wrapperHeight, setWapperHeight] = useState(MinContainerHeight);
  const [list, setList] = useState<Array<{ symbol: string }>>([]); // 用于展示的列表数据
  const [marginTab, setMarginTab] = useState(MARGINTYPE_MAP.ALL);
  const [futureAllList, setFutureAllList] = useState<Array<{ symbol: string }>>([]); // 所有合约
  const [futuresCoinList, setFuturesCoinList] = useState<Array<{ symbol: string }>>([]); // 币本位合约
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const ref: React.RefObject<HTMLDivElement | null> = useRef(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const tradeListContainer: React.RefObject<HTMLDivElement | null> = useRef(null);
  const {
    symbols = [],
    marginSymbols = [],
    marginSymbolsMap = {},
    marginSymbolsOrigin = [],
    futuresArea = [],
    futuresSymbols = [],
    futuresCoinQuotes = [],
    symbolsMap = {},
    areas = [],
    areasMargin = [],
    favSymbols,
    pullMarginSymbols,
    pullAreas,
    pullConfigs,
    pullFuturesSymbols,
    pullTradeAreaList,
    getUserFavSymbols,
    pullConfigsByUser,
    pullAreasMargin,
  } = useHeaderStore(state => state) || {};

  let _area: any[] = futuresArea;
  if (tradeType === TRADETYPE_MAP.SPOT) {
    _area = [...areas];
  }
  if (tradeType === TRADETYPE_MAP.MARGIN) {
    _area = (areasMargin as any).map(item => {
      return {
        ...item,
        displayName: t(MARGIN_TABS_LABEL[item.value]),
      };
    });
  }

  // 基本币种信息
  const getBaseSymbols = useCallback(() => {
    // 币种信息，头像
    pullCurrencies();
  }, []); // 现货币种信息

  const getSpotSymbols = useCallback(() => {
    // 所有币种
    pullSymbols();
    // 杠杆交易对
    pullMarginSymbols?.();
    // 分区
    pullAreas?.();
    // 杠杆配置
    pullConfigs?.();
  }, []);

  const getMarginSymbols = useCallback(() => {
    // 分区
    pullAreasMargin?.();
    // 杠杆交易对
    pullMarginSymbols?.();
    // 杠杆配置
    pullConfigs?.();
  }, []);

  // 合约币种信息
  const getFuturesSymbols = useCallback(() => {
    // 合约币种
    pullFuturesSymbols?.();
    // 分区
    pullTradeAreaList?.();
  }, []);

  // 现货、杠杆列表
  const querySpotMarketRecord = useCallback(({ area, tradeType, cb }) => {
    setLoading(true);
    const request = tradeType === TRADETYPE_MAP.SPOT ? getMarketSymbolsByQuote : getLeverageMenuItem;
    const defaultL1Keyword = tradeType === TRADETYPE_MAP.SPOT ? 'BTC' : 'ALL';
    // getMarketSymbolsByQuote 根据 area 获取币对。默认展示所有的币对，传一个大的pagesize
    request({ l1Keyword: area || defaultL1Keyword, pageNum: 1, pageSize: 10000 })
      .then(res => {
        const { success, data = [] } = res;
        if (success) {
          const records = data?.items
            ?.map(item => ({
              ...item,
              symbolCode: item.symbol,
              changeRate: item.last24HourRate,
              lastTradedPrice: item.lastPrice,
              volValue: item.last24HourTradingVolume,
              baseCurrency: item.crypto,
            }))
            .filter(item => !!item)
            .sort((a, b) => {
              return +b.volValue - +a.volValue;
            });
          setList(records);
          if (cb) cb(records);
        }
      })
      .catch(err => {
        console.error('querySpotMarketRecord error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 现货、杠杆搜索
  const querySpotMarketSearch = useCallback(({ searchText, tradeType, cb }) => {
    setLoading(true);
    const request = tradeType === TRADETYPE_MAP.SPOT ? getMenuItemSearchSpot : getMenuItemSearchLeverage;
    request({ searchKeyword: searchText })
      .then(res => {
        const { success, items = [] } = res;
        if (success) {
          const records = items?.map(item => ({
            ...item,
            symbolCode: item.symbol,
            changeRate: item.last24HourRate,
            lastTradedPrice: item.lastPrice,
            volValue: item.last24HourTradingVolume,
            baseCurrency: item.crypto,
          }));

          setList(records);
          if (cb) cb(records);
        }
      })
      .catch(err => {
        console.error('querySpotMarketSearch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const queryMarketsRecord = useCallback(
    ({
      area,
      tradeType,
      searchText,
      cb,
    }: {
      area?: string;
      tradeType?: string;
      searchText?: string;
      cb?: (data: any) => void;
    }) => {
      // 搜索
      if (searchText) {
        querySpotMarketSearch({ searchText, tradeType, cb });
        return;
      }
      // 列表
      if (area && !searchText) {
        querySpotMarketRecord({ area, tradeType, cb });
      }
    },
    [querySpotMarketRecord, querySpotMarketSearch]
  );

  const queryFuturesMarketRecord = useCallback(() => {
    if (!bootConfig._SITE_CONFIG_.functions.futures) {
      return;
    }
    setLoading(true);
    getFuturesMarketList()
      .then(res => {
        const { data = [], success } = res;
        if (success) {
          // 合并行情详情
          const allFuturesSymbols: any[] = map(futuresSymbols, _symbol => {
            const item = data.find(i => i.symbol === _symbol.symbol) || {};
            const { lastPrice, priceChgPct } = item;
            return {
              ..._symbol,
              ...item,
              changeRate: priceChgPct,
              lastTradedPrice: lastPrice,
            };
          });
          setFutureAllList(allFuturesSymbols);
          const _futuresCoinList = allFuturesSymbols.filter(i => (futuresCoinQuotes as string[]).includes(i.symbol));
          setFuturesCoinList(_futuresCoinList);
          const _list = tradeType === TRADETYPE_MAP.FUTURES_CURRENCY ? _futuresCoinList : allFuturesSymbols;
          setList(_list);
        }
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [futuresCoinQuotes, futuresSymbols, tradeType]);

  useEffect(() => {
    const navOverlay = parentRef.current;
    if (navOverlay) {
      const height = navOverlay.offsetHeight;
      if (height > MinContainerHeight) {
        setWapperHeight(height);
      } else if (tradeListContainer?.current) {
        tradeListContainer.current.style.borderBottomLeftRadius = '16px';
      }
    }
    if (visible || needLoad) {
      getBaseSymbols();
      if (tradeType === TRADETYPE_MAP.SPOT) {
        getSpotSymbols();
      }
      if (tradeType === TRADETYPE_MAP.MARGIN) {
        getMarginSymbols();
      }
      if (tradeType === TRADETYPE_MAP.FUTURES_USDT || tradeType === TRADETYPE_MAP.FUTURES_USDT) {
        getFuturesSymbols();
      }
    }
    kcsensorsManualTrack(['navigationDropDownList', 1], {
      postTitle: tradeType,
      pagecate: 'navigationDropDownList',
    });
  }, [visible, needLoad]);

  useEffect(() => {
    if (userInfo && userInfo.uid && (visible || needLoad)) {
      if (tradeType === TRADETYPE_MAP.SPOT) {
        getUserFavSymbols?.();
      }
      if (tradeType === TRADETYPE_MAP.MARGIN) {
        pullConfigsByUser?.();
      }
    }
  }, [tradeType, userInfo, visible, needLoad]);

  useEffect(() => {
    if (!visible || !needLoad) return;
    if (tradeType === TRADETYPE_MAP.FUTURES_USDT || tradeType === TRADETYPE_MAP.FUTURES_CURRENCY) {
      if (futuresSymbols && futuresSymbols.length > 0) {
        queryFuturesMarketRecord(); // 获取合约行情
      }
    }
  }, [futuresSymbols, marginSymbols, queryFuturesMarketRecord, queryMarketsRecord, tradeType, visible, needLoad]);

  const tabChange = useCallback(
    val => {
      if (tradeType === TRADETYPE_MAP.MARGIN) {
        queryMarketsRecord({ area: val, tradeType });
        setMarginTab(val);
        return;
      }
      if (tradeType === TRADETYPE_MAP.FUTURES_USDT) {
        if (val === FUTURES_MAP.ALL) {
          // 筛除币本位的合约
          const _list = futureAllList.filter(i => !(futuresCoinQuotes as string[]).includes(i.symbol));
          setList(_list);
          return;
        }
        // 根据quotes找出合约
        const { quotes = [] } = (futuresArea as any[]).find(i => i.name === val) || {};
        const _list = futureAllList.filter(item => {
          const { symbol } = item;
          return quotes.includes(symbol);
        });
        setList(_list);
        return;
      }
      if (tradeType === TRADETYPE_MAP.SPOT) {
        queryMarketsRecord({ area: val, tradeType });
      }
    },
    [favSymbols, futureAllList, futuresArea, futuresCoinQuotes, marginSymbolsMap, queryMarketsRecord, tradeType]
  );

  const debounceFilterMarkets = useMemo(
    () =>
      debounce(({ _symbols, noSeach, searchText }) => {
        kcsensorsManualTrack(['navigationDropDownSearch', 1], {
          postTitle: tradeType,
          pagecate: 'navigationDropDownSearch',
        });
        if (noSeach) {
          setShowSearch(false);
          if (tradeType === TRADETYPE_MAP.FUTURES_CURRENCY) {
            setList(futuresCoinList);
          }
          return;
        }
        if (tradeType === TRADETYPE_MAP.FUTURES_USDT || tradeType === TRADETYPE_MAP.FUTURES_CURRENCY) {
          const _list = futureAllList.filter(i => _symbols.includes(i.symbol));
          setList(_list);
          return;
        }
        // 现货和杠杆使用接口搜索
        queryMarketsRecord({ tradeType, searchText });
      }, 1000),
    [futureAllList, futuresCoinList, queryMarketsRecord, tradeType]
  );

  const handleSearchInput = useCallback(
    e => {
      const searchText = trim(e.target.value).toUpperCase();
      const filter = async () => {
        setSearch(searchText);
        setShowSearch(true);
        // 判断搜索源
        let allSymbols: any[] = symbols;
        if (tradeType === TRADETYPE_MAP.MARGIN) {
          allSymbols = marginSymbolsOrigin;
        }
        if (tradeType === TRADETYPE_MAP.FUTURES_USDT || tradeType === TRADETYPE_MAP.FUTURES_CURRENCY) {
          allSymbols = futureAllList;
        }
        if (searchText) {
          const searchSymbols: string[] = [];
          const hereSearchText = searchText.replace('/', '-');
          if (tradeType === TRADETYPE_MAP.FUTURES_USDT || tradeType === TRADETYPE_MAP.FUTURES_CURRENCY) {
            forEach(allSymbols, symbol => {
              let { baseCurrency } = symbol;
              baseCurrency = baseCurrency === 'XBT' ? 'BTC' : baseCurrency;
              if (baseCurrency.toUpperCase().indexOf(hereSearchText) > -1) {
                searchSymbols.push(symbol.symbol);
              }
            });
          } else if (hereSearchText.indexOf('-') > -1) {
            // KCS/U --- > KCS-USDT, KCS-USDC...
            forEach(allSymbols, symbol => {
              if (symbol.symbolName && symbol.symbolName.toUpperCase().indexOf(hereSearchText) > -1) {
                // 根据name进行筛选
                searchSymbols.push(symbol.symbol);
              }
            });
          } else {
            // 模糊搜索，但只取/前的，KCS --- > KCS/USDT, KCS/USDC, KCS/BTC...
            forEach(allSymbols, symbol => {
              if (symbol?.symbolName) {
                const coin = symbol.symbolName.split('-')[0]; // 根据name进行筛选
                if (coin.toUpperCase().indexOf(searchText) > -1) {
                  searchSymbols.push(symbol.symbol);
                }
              }
            });
          }

          // 搜索
          debounceFilterMarkets({ _symbols: searchSymbols, searchText });
        } else {
          debounceFilterMarkets({ noSeach: true });
        }
      };
      filter();
    },
    [debounceFilterMarkets, futureAllList, marginSymbolsOrigin, symbols, tradeType]
  );

  useIsomorphicLayoutEffect(() => {
    if (ref && ref.current) {
      setContentWidth(ref.current.offsetWidth);
    }
  }, []);

  const handleStopPropagation = useCallback(event => {
    // 阻止事件冒泡，元素点击切换tab会冒泡到父级元素,会调用onSubMenuVisibleChange
    event.stopPropagation();
  }, []);

  // fix 自选无数据问题
  if (!needLoad || (userInfo?.uid && tradeType === TRADETYPE_MAP.SPOT && favSymbols === null)) {
    return null;
  }

  return (
    <div className={clsx([styles.wrapper, className])} onClick={handleStopPropagation}>
      <div
        className={clsx([styles.container, 'list-container'])}
        ref={tradeListContainer}
        style={{
          // height: wrapperHeight,
          // maxHeight: wrapperHeight,
          minHeight: MinContainerHeight,
          background: 'var(--kux-textEmphasis)',
        }}
      >
        {/* todo: 搜索栏要迁移位置 */}
        {indexOf(WITH_SEARCH_LIST, tradeType) > -1 ? (
          <div className={clsx([styles.searchWrapper, 'list-search-box', search ? 'has-input-value' : ''])}>
            <Input
              type="search"
              size="small"
              placeholder={t('bjdr6gK61CNwb3TMDHu4rW')}
              value={search}
              onChange={handleSearchInput}
              prefix={<SearchIcon size={16} color="var(--kux-icon40)" />}
              allowClear
            />
          </div>
        ) : null}
        <div ref={ref} className={styles.contentWrapper}>
          {!showSearch && tradeType !== TRADETYPE_MAP.FUTURES_CURRENCY && _area?.length && visible ? (
            <Tabs tradeType={tradeType} tabChange={tabChange} areas={_area} lang={lang} wrapperHeight={wrapperHeight} />
          ) : null}
          <List
            dataSource={list}
            tradeType={tradeType}
            marginTab={marginTab}
            symbolsMap={symbolsMap}
            width={contentWidth}
            loading={loading}
            lang={lang}
            visible={visible}
          />
        </div>
      </div>
      {/* wtf!!! 用于堵border-radius */}
      {/* 高度大于最小高度时，才出现底部的堵住border-radius的div */}
      {/* {wrapperHeight > MinContainerHeight ? (
        <div
          FIXME: 下拉窗临时处理
          className={clsx([styles.tradeListBlank1, 'blank1-container'])}
          style={{
            background: isRTL
              ? // @ts-ignore
                blendColors('var(--kux-textEmphasis)', fade('var(--kux-cover)', 0.02))
              : 'var(--color-layer)',
          }}
        />
      ) : null} 
      <div
        // className={styles.tradeListBlank2}
        className={clsx([styles.tradeListBlank2, 'blank2-container'])}
        style={{
          background: isRTL
            ? // @ts-ignore
              blendColors('var(--kux-textEmphasis)', fade('var(--kux-cover)', 0.02))
            : 'var(--color-layer)',
        }}
      /> */}
    </div>
  );
};

const ExtContentList = props => {
  if (props.tradeType === TRADETYPE_MAP.TRADING_BOT) {
    return <BotList {...props} />;
  }
  return <TradeList {...props} />;
};

export default ExtContentList;
