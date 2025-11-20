/*
 * @Owner: gannicus.zhou@kupotech.com
 * @Date: 2023-05-15 14:31:29
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-11-03 12:26:37
 * @FilePath: /trade-web/src/trade4.0/pages/Markets/components/Markets.js
 * @Description:
 */

import React, { useMemo, useCallback, useEffect } from 'react';
import { styled } from '@/style/emotion';
import { FlexColumm } from '@/style/base';
import { connect } from 'dva';
import Input from '@mui/Input';
import { get, trim, debounce, filter as _filter, forEach } from 'lodash';
import { ICSearchOutlined } from '@kux/icons';
import { useTheme } from '@emotion/react';
import wsSubscribe from 'hocs/wsSubscribe';
import withLocale from 'hocs/withLocale';
import { _t, _tHTML } from 'utils/lang';
import { TRADE_TYPES_CONFIG } from '@/meta/tradeTypes';
import tradeMarketsStore from 'src/pages/Trade3.0/stores/store.tradeMarkets';
import SymbolTabs from 'src/trade4.0/pages/Markets/components/SymbolTabs';
import SymbolList from '@/pages/Markets/components/SymbolList';
import { HookContext as WebHookContext } from '@/pages/InfoBar/SymbolSwitch';
import { HookContext as H5HookContext } from '@mui/Dropdown';
import { useMarginTypeChange } from '@/pages/Markets/hooks/useMarginTypeChange';
import useIsH5 from 'src/trade4.0/hooks/useIsH5';

const MarketsWrapper = styled(FlexColumm)`
  flex: 1;

  ${(props) =>
    props.isFloat &&
    `
    .KuxTabs-scrollButton {
      background: ${props.theme.colors.layer};
    }
    ${
      props.theme.currentTheme === 'dark' &&
      `
        .KuxTabs-rightScrollButtonBg {
          background: none;
        }
        .KuxTabs-leftScrollButtonBg {
          background: none;
        }
    `
    }
    .markets {
      background-color: ${props.theme.colors.layer};
      border-radius: 4px;
      box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.1), 8px 0px 24px rgba(0, 0, 0, 0.16);
      .symbol-pair {
        font-size: 14px;
      }
    }
    .KuxSpin-container {
      &::after {
         background: ${props.theme.colors.layer};
        }
    }
  `}
`;

const SearchInput = styled.div`
  display: flex;
  position: relative;
  .KuxInput-sizeSmall {
    background: none;
  }
  .KuxInput-typeText fieldset {
    border-radius: 80px;
    background: ${(props) => props.theme.colors.cover4};
  }
`;

/**
 * @description:行情模块 包含输入框 交易对分类 列表展示
 * @param {*}
 * @param {*} area 当前选择的交易对分类
 * @param {*} searchKey 输入的值
 * @param {*}
 * @param {*}
 * @param {*} isShowCollectionTab  是否展示自选tab
 * @return {*}
 */
export const Markets = (props) => {
  const {
    dispatch,
    allSymbols,
    childAreas,
    area,
    areas,
    recordType,
    prevAreaType,
    isFloat,
    search,
  } = props;
  useMarginTypeChange();
  useEffect(() => {
    dispatch({ type: 'tradeMarkets/pullAreas' });
    dispatch({ type: 'tradeMarkets/pullUserFavSymbols' });
  }, []);

  const [tabsVisible, setTabsVisible] = React.useState(true);
  const h5Visible = React.useContext(H5HookContext);
  const webVisible = React.useContext(WebHookContext);
  const searchRef = React.useRef(null);
  const theme = useTheme();
  const marketsRef = React.useRef();
  const symbolListRef = React.useRef();
  const isH5 = useIsH5();
  const setVisible = useCallback(
    (value) => {
      if (isH5) {
        h5Visible(value);
        webVisible(value); // 移动端还要调用这个web方法是因为，select的箭头由web的visible控制
      } else {
        webVisible(value);
      }
    },
    [isH5],
  );

  const handleFilterMarkets = useCallback(
    (params) => {
      if (params.recordType < 2) {
        dispatch({
          type: 'tradeMarkets/update',
          payload: { search: '' },
        });
      }
      tradeMarketsStore.handler.update({ records: [] });
      dispatch({ type: 'tradeMarkets/filter@polling:cancel' });
      dispatch({
        type: 'tradeMarkets/filter@polling',
        payload: { ...params },
      });
      // recordType: 0, // 0--某一市场下的行情列表 ；1--收藏下的行情列表； 2--热门搜索下的行情列表 ； 3--用户搜索下的行情列表 ；4 为杠杆搜索类型
      if ((params && params.recordType === 0) || params.recordType === 4) {
        dispatch({
          type: 'tradeMarkets/update',
          payload: { prevAreaType: params },
        });
      }
    },
    [dispatch],
  );
  const debounceFilterMarkets = useMemo(() => debounce(handleFilterMarkets, 1000), [
    handleFilterMarkets,
  ]);

  const handleSearchInput = useCallback(
    (e) => {
      const searchText = trim(e.target.value).toUpperCase();

      const filter = async () => {
        dispatch({
          type: 'tradeMarkets/update',
          payload: { search: searchText },
        });
        if (searchText) {
          const searchSymbols = [];
          const hereSearchText = searchText.replace('/', '-');
          if (hereSearchText.indexOf('-') > -1) {
            // KCS/U --- > KCS-USDT, KCS-USDC...
            forEach(allSymbols, (symbol) => {
              if (symbol.symbol.toUpperCase().indexOf(hereSearchText) > -1) {
                // 根据name进行筛选
                searchSymbols.push(symbol.symbolCode);
              }
            });
          } else {
            // 模糊搜索，但只取/前的，KCS --- > KCS/USDT, KCS/USDC, KCS/BTC...
            forEach(allSymbols, (symbol) => {
              const coin = symbol.symbol.split('-')[0]; // 根据name进行筛选
              if (coin.toUpperCase().indexOf(searchText) > -1) {
                searchSymbols.push(symbol.symbolCode);
              }
            });
          }

          await dispatch({
            type: 'tradeMarkets/update',
            payload: {
              searchSymbols,
            },
          });
          // 搜索
          debounceFilterMarkets({ area: 'search', recordType: 3 });
        }
        // 暂时没有热门这个功能
        //  else {
        //   // 热门
        //   debounceFilterMarkets({ recordType: 2 });
        // }
      };
      if (searchText.length > 0) {
        setTabsVisible(false);
      } else {
        setTabsVisible(true);
        if (!searchText && area === 'search') {
          handleFilterMarkets(prevAreaType);
        }
      }
      filter();
    },
    [dispatch, allSymbols, debounceFilterMarkets, area],
  );

  const handleSearchBlur = useCallback(() => {
    if (!search && area === 'search') {
      handleFilterMarkets(prevAreaType);
    }
  }, [search, prevAreaType]);

  return (
    <MarketsWrapper ref={marketsRef} isFloat={isFloat}>
      {/* 输入搜索框 */}
      <SearchInput className="pl-12 pr-12 mt-12">
        <Input
          value={search}
          ref={searchRef}
          onChange={handleSearchInput}
          onBlur={handleSearchBlur}
          size="small"
          allowClear
          placeholder={_t('t9sd5TvoKs1RGkncbLRrti')}
          variant={'filled'}
          prefix={<ICSearchOutlined size={12} color={theme.colors.text60} />}
        />
      </SearchInput>
      {/* 市场分类tabs */}
      {tabsVisible && (
        <SymbolTabs
          area={area}
          areas={areas}
          childAreas={childAreas}
          recordType={recordType}
          handleFilterMarkets={handleFilterMarkets}
        />
      )}
      {/* 币种列表（包含列表header排序） */}
      <SymbolList ref={symbolListRef} setVisible={setVisible} tabsVisible={tabsVisible} />
    </MarketsWrapper>
  );
};

export default withLocale()(
  connect((state) => {
    const {
      filters: { area, childAreas, recordType },
      areas,
      hotSymbols,
      searchSymbols,
      search,
      favSymbols,
      marginTab,
      prevAreaType,
    } = state.tradeMarkets;

    const { marginSymbols, marginSymbolsMap } = state.symbols;
    const { symbols: allSymbols } = state.symbols;

    let currentArea = area;
    if (!currentArea) {
      currentArea = get(state.tradeMarkets, 'areas[0].name', 'BTC');
    }

    let marginSearchSymbols = [...marginSymbols];
    if (marginTab === TRADE_TYPES_CONFIG.MARGIN_TRADE.key) {
      marginSearchSymbols = _filter(
        marginSymbols,
        (item) => marginSymbolsMap[item].isMarginEnabled,
      );
    }
    if (marginTab === TRADE_TYPES_CONFIG.MARGIN_ISOLATED_TRADE.key) {
      marginSearchSymbols = _filter(
        marginSymbols,
        (item) => marginSymbolsMap[item].isIsolatedEnabled,
      );
    }
    const tabsParams = {
      area: area || currentArea,
      wsArea: area,
      areas,
      childAreas,
      recordType,
    };
    return {
      favSymbols,
      hotSymbols,
      searchSymbols,
      allSymbols,
      ...tabsParams,
      marginSearchSymbols,
      prevAreaType,
      search,
      // getDisplayName: code => displayNameMap[code],
    };
  })(
    wsSubscribe({
      getTopics: (Topic, props) => {
        const {
          wsArea,
          favSymbols,
          hotSymbols,
          searchSymbols,
          recordType,
          marginSearchSymbols,
        } = props;

        let symbols = [];
        if (recordType === 0) {
          symbols = [`${wsArea}`];
        } else if (recordType === 1) {
          symbols = favSymbols;
        } else if (recordType === 2) {
          symbols = hotSymbols;
        } else if (recordType === 3) {
          symbols = searchSymbols;
        } else if (recordType === 4) {
          symbols = marginSearchSymbols;
        }

        return [[Topic.MARKET_SNAPSHOT, { SYMBOLS: symbols }]];
      },
      didUpdate: (prevProps, currentProps) => {
        const {
          wsArea,
          favSymbols,
          hotSymbols,
          searchSymbols,
          recordType,
          marginSearchSymbols,
        } = currentProps;
        const {
          wsArea: prevArea,
          favSymbols: prevFavSymbols,
          hotSymbols: prevHotSymbols,
          searchSymbols: prevSearchSymbols,
          recordType: prevRecordType,
          marginSearchSymbols: prevMarginSearchSymbols,
        } = prevProps;
        if (
          recordType !== prevRecordType ||
          (recordType === 0 && wsArea !== prevArea) ||
          (recordType === 1 && favSymbols !== prevFavSymbols) ||
          (recordType === 2 && hotSymbols !== prevHotSymbols) ||
          (recordType === 3 && searchSymbols !== prevSearchSymbols) ||
          (recordType === 4 && marginSearchSymbols !== prevMarginSearchSymbols)
        ) {
          return true;
        }
        return false;
      },
    })(Markets),
  ),
);
