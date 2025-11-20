/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-15 14:31:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-10-09 17:13:41
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/components/SymbolList.js
 * @Description:
 */
import React, { forwardRef, useCallback } from 'react';
import { useDispatch, useSelector, connect } from 'dva';
import { styled, fx } from '@/style/emotion';
import { map, indexOf, find, filter, debounce } from 'lodash';
import { _t } from 'utils/lang';
import { trackClick } from 'utils/ga';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import tradeMarketsStore from 'src/pages/Trade3.0/stores/store.tradeMarkets';
import List from './common/List';
import Header from './common/Header';
import { FlexColumm, textOveflow } from '@/style/base';
import useLocalStorageState from '@/hooks/common/useLocalStorageState';
import { commonSensorsFunc } from '@/meta/sensors';

const ListWrapper = styled(FlexColumm)`
  flex: 1;
  height: 44px;
  overflow: hidden;
  ${(props) => {
    if (!props.tabsVisible) {
      return 'margin-top: 8px;';
    }
  }}
  & .symbol-item {
    display: flex;
    flex: 1;
    align-items: center;
    ${fx.cursor()}
    height: 24px;
    line-height: 18px;
    display: flex;
    padding: 0 12px;
    padding-left: 8px;
    ${(props) => fx.color(props, 'text30')}
    & > div {
      ${textOveflow}
    }
    &:hover {
      ${(props) => fx.backgroundColor(props, 'cover4')}
    }
    &.actived {
      ${(props) => fx.backgroundColor(props, 'cover4')}
    }
    .symbol-change {
      text-align: right;
      font-size: 12px;
    }
    .symbol-lastprice {
      ${(props) => fx.color(props, 'text')}
      font-size:12px;
      text-align: right;
    }
    .symbol-pair {
      flex-wrap: wrap;
      font-weight: 500;
      font-size: 12px;
    }
    .symbolCodeToName {
      ${(props) => fx.color(props, 'text')}
    }
  }
`;

const parseSymbol = (symbol, allSymbols) => {
  return find(allSymbols, { symbolCode: symbol }) || {};
};

// st放到尾部
const stToEnd = (list) => {
  const stList = [];
  const notStList = [];
  map(list, (item) => {
    if (item) {
      if (item.mark === 1) {
        stList.push(item);
      } else {
        notStList.push(item);
      }
    }
  });
  return notStList.concat(stList);
};

const genDataSource = (props) => {
  const {
    recordType,
    favSymbols,
    allSymbols = [],
    records = [],
    marginSymbolsMap,
    marginTab,
  } = props;

  const _records = filter(records, ({ symbol, symbolCode }) => {
    if (marginTab === 'ALL') return true;
    if (marginTab === TRADE_TYPES_CONFIG.MARGIN_TRADE.key) {
      return (
        marginSymbolsMap[symbol] && marginSymbolsMap[symbol].isMarginEnabled
      );
    }
    if (marginTab === TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key) {
      return (
        marginSymbolsMap[symbol] && marginSymbolsMap[symbol].isIsolatedEnabled
      );
    }
    return true;
  });

  let list = map(_records, (item) => {
    return {
      ...item,
      pricePrecision:
        parseSymbol(item.symbolCode, allSymbols).pricePrecision || 8,
      __isFav: indexOf(favSymbols, item.symbolCode) > -1,
    };
  });
  list = stToEnd(list);

  if (recordType === 0) {
    const { area, childAreas } = props;
    if (childAreas[area] && area !== childAreas[area]) {
      // 根据子市场过滤
      list = filter(list, { quoteCurrency: childAreas[area] }) || [];
    }
  }
  const recordLength = list.length;
  return { dataSource: list, recordLength };
};

const sortFunc = {
  symbolCode: (a, b) => {
    const symbolA = a.symbolCode.toUpperCase();
    const symbolB = b.symbolCode.toUpperCase();
    if (symbolA < symbolB) {
      return -1;
    }
    if (symbolA > symbolB) {
      return 1;
    }
    return 0;
  },
  lastTradedPrice: (a, b) => a.lastTradedPrice - b.lastTradedPrice,
  changeRate: (a, b) => a.changeRate - b.changeRate,
};

const SymbolBody = (props) => {
  const { area, setVisible, marginTab, tabsVisible } = props;

  const dispatch = useDispatch();

  const [sortKey, setSortKey] = useLocalStorageState('symbolTable_sortKey', {
    defaultValue: '',
  });

  const [sortDirection, setSortDirection] = useLocalStorageState(
    'symbolTable_sortDirectionKey',
    {
      defaultValue: '',
    },
  );

  const dataSource = React.useMemo(() => {
    const { dataSource: list } = genDataSource(props);
    if (list.length > 0 && sortKey && sortDirection) {
      list.sort(sortFunc[sortKey]); // 由小到大排序
      if (sortDirection === 'descend') {
        list.reverse();
      }
    }
    return list;
  }, [props, sortKey, sortDirection]);

  const handleSort = (key) => {
    if (key !== sortKey) {
      setSortDirection('ascend');
      setSortKey(key);
    } else if (sortDirection === 'ascend') {
      setSortDirection('descend');
    } else if (sortDirection === 'descend') {
      setSortDirection('');
    } else {
      setSortDirection('ascend');
    }
    if (key === 'symbolCode') {
      commonSensorsFunc(['markets', 3, 'click']);
    } else if (key === 'lastTradedPrice') {
      commonSensorsFunc(['markets', 4, 'click']);
    } else if (key === 'changeRate') {
      commonSensorsFunc(['markets', 5, 'click']);
    }
  };

  const handleFavClickCallback = useCallback((symbolCode, e) => {
    e.preventDefault();
    e.stopPropagation();
    // 控制点击收藏的按钮时，不需要展示loading效果
    dispatch({
      type: 'tradeMarkets/update',
      payload: { fetchLoadingSwitch: false },
    });
    dispatch({
      type: 'tradeMarkets/userCollectFavSymbol',
      payload: {
        symbol: symbolCode,
      },
    });
    commonSensorsFunc(['markets', 6, 'click'], symbolCode);
  }, []);

  const handleTableRowClickCallback = useCallback(
    debounce((record, e) => {
      const { symbolCode } = record;
      if (area === 'MARGIN') {
        dispatch({
          type: 'tradeMarkets/update',
          payload: {
            infoOfClickMarginRow: [marginTab, symbolCode],
          },
        });
      }

      dispatch({
        type: '$tradeKline/routeToSymbol',
        payload: {
          symbol: symbolCode,
        },
      });
      setVisible(false);
      trackClick(['tradeZone', '1'], {
        symbol: symbolCode,
      });
    }, 500),
    [area, marginTab, setVisible],
  );

  return (
    <ListWrapper tabsVisible={tabsVisible}>
      <div style={{ display: 'flex' }}>
        <Header
          handleSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </div>
      <ListWrapper>
        <List
          items={dataSource}
          isShowCollectionTab
          marginTab={marginTab}
          handleFavClick={handleFavClickCallback}
          handleTableRowClick={handleTableRowClickCallback}
        />
      </ListWrapper>
    </ListWrapper>
  );
};

const mapStateToProps = (state) => {
  const {
    filters: { recordType, area, childAreas },
    sorter,
    favSymbols,
    marginTab,
    displayByCurrency,
  } = state.tradeMarkets;

  const { tradeType } = state.trade;
  const { symbols: allSymbols, symbolsMap, marginSymbolsMap } = state.symbols;
  const { currency } = state.currency;

  return {
    tradeType,
    marginSymbolsMap,
    symbolsMap,
    allSymbols,
    area,
    childAreas,
    recordType,
    sorter,
    displayByCurrency,
    favSymbols,
    currency,
    marginTab,
  };
};

export default React.memo(
  connect(mapStateToProps)(
    tradeMarketsStore.columnStoreHoc((state) => {
      const { records } = state.tradeMarkets;
      return {
        records,
      };
    })(SymbolBody),
  ),
);
