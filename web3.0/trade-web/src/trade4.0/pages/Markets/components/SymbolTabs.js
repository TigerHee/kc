/**
 * Owner: borden@kupotech.com
 */
import React, {
  useCallback,
  useState,
  useMemo,
  useEffect,
  useRef,
} from 'react';
import { find } from 'lodash';
import { _t } from 'utils/lang';
import { styled, fx } from '@/style/emotion';
import Divider from '@mui/Divider';
// import { Tabs } from '@mui/Tabs';
import { Tabs } from '@kux/mui';
import { FlexColumm } from 'src/trade4.0/style/base';
import { useDispatch } from 'dva';
import { MARGIN_TABS } from '@/meta/margin';
import SvgComponent from '@/components/SvgComponent';
import NewTag from '@/components/NewTag';
import { commonSensorsFunc } from '@/meta/sensors';
import { useIsRTL } from '@/hooks/common/useLang';
import { isDisplayMargin } from '@/meta/multiTenantSetting';

const { Tab } = Tabs;

const labelMap = {
  1: (
    <SvgComponent size={16} fileName="markets" color="#F65454" type={'fire'} />
  ),
  2: <NewTag />,
};

const Mydivider = styled(Divider)`
  margin: 0;
  ${(props) => {
    if (!props.hasFilter) {
      return 'margin-bottom: 8px;';
    }
  }}
  ${(props) => fx.backgroundColor(props, 'divider4')}
`;

const TabsWrapper = styled.div`
  margin: 0px 12px;
`;

const BorderTabsWrapper = styled.div`
  height: 38px;
  margin: 0px 12px;
`;

const BorderTabs = styled(Tabs)`
  margin: 7px 0px;
`;

const SymbolTabs = ({
  areas,
  recordType,
  childAreas = {},
  area: areaFromProps,
  handleFilterMarkets,
}) => {
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState(areaFromProps);
  const [currentQuote, setCurrentQuote] = useState('ALL');
  const isRTL = useIsRTL();

  useEffect(() => {
    setCurrentTab(areaFromProps);
  }, [areaFromProps]);

  const handleFavClick = useCallback(() => {
    handleFilterMarkets({ area: 'FAV', recordType: 1 });
  }, [handleFilterMarkets]);

  const handleMarginClick = useCallback(() => {
    handleFilterMarkets({ area: 'MARGIN', recordType: 4 });
  }, [handleFilterMarkets]);

  const handleTabClick = useCallback(
    (area) => {
      const childArea = childAreas[area] || area;
      const _childAreas = { ...childAreas, [area]: childArea };
      handleFilterMarkets({ area, childAreas: _childAreas, recordType: 0 });
    },
    [childAreas, handleFilterMarkets],
  );

  const handleChangeTab = useCallback((tab) => {
    // 控制点击tab时，需要展示loading效果
    dispatch({
      type: 'tradeMarkets/update',
      payload: { fetchLoadingSwitch: true, marginTab: 'ALL' },
    });
    setCurrentTab(tab);
    setCurrentQuote('ALL');
    if (tab === 'FAV') {
      handleFavClick();
      return;
    }
    if (tab === 'MARGIN') {
      handleMarginClick();
      return;
    }
    handleTabClick(tab);
    commonSensorsFunc(['markets', 1, 'click'], tab);
  }, []);

  const changeMarginQuoteTab = useCallback(
    (nextMarginTab) => {
      dispatch({
        type: 'tradeMarkets/update',
        payload: {
          marginTab: nextMarginTab,
        },
      });
    },
    [dispatch],
  );

  const changeQuoteTab = useCallback(
    (quote) => {
      if (currentTab === 'MARGIN') {
        changeMarginQuoteTab(quote);
        setCurrentQuote(quote);
      } else {
        setCurrentQuote(quote);
        // 控制点击tab quotab时，不需要展示loading效果
        dispatch({
          type: 'tradeMarkets/update',
          payload: { fetchLoadingSwitch: false },
        });
        if (quote === 'ALL') {
          quote = '';
        }
        const _childAreas = { ...childAreas, [currentTab]: quote };
        handleFilterMarkets({
          area: currentTab,
          childAreas: _childAreas,
          recordType: 0,
        });
      }
      commonSensorsFunc(['markets', 2, 'click'], quote);
    },
    [childAreas, currentTab],
  );

  const filterTabs = useMemo(() => {
    if (currentTab === 'FAV') return;

    let tab = find(areas, (o) => o.name === currentTab);
    if (currentTab === 'MARGIN') {
      if (!tab?.quotes || !tab?.quotes?.length) {
        tab = {};
        tab.quotes = MARGIN_TABS;
      }
    } else {
      if (!tab?.quotes || !tab?.quotes?.length) return;
      if (tab.quotes[0] !== 'ALL') {
        tab.quotes.unshift('ALL');
      }
    }

    return (
      <BorderTabsWrapper>
        <BorderTabs
          size="xsmall"
          type="text"
          activeType={'primary'}
          variant="bordered"
          centeredActive
          value={currentQuote}
          onChange={(e, v) => changeQuoteTab(v)}
          direction={isRTL ? 'rtl' : 'ltr'}
        >
          {currentTab === 'MARGIN'
            ? tab?.quotes.map((quote) => {
                return (
                  <Tab
                    value={quote.value}
                    label={quote.label()}
                    key={quote.value}
                  />
                );
              })
            : tab?.quotes.map((quote) => {
                return (
                  <Tab
                    value={quote}
                    label={quote === 'ALL' ? _t('all') : quote}
                    key={quote}
                  />
                );
              })}
        </BorderTabs>
      </BorderTabsWrapper>
    );
  }, [currentTab, areas, currentQuote]);

  const finalyTabs = useMemo(() => {
    const showTabList = areas.map((item) => {
      const { name, label, displayName } = item;
      return {
        label: (
          <React.Fragment>
            <span>{displayName}</span>
            {labelMap[label]}
          </React.Fragment>
        ),
        value: name,
      };
    });
    return showTabList;
  }, [areas]);

  return (
    <FlexColumm>
      <TabsWrapper>
        <Tabs
          size="xsmall"
          indicator={false}
          centeredActive
          value={currentTab}
          onChange={(e, v) => handleChangeTab(v)}
          direction={isRTL ? 'rtl' : 'ltr'}
        >
          {<Tab label={_t('fav')} value="FAV" key="FAV" />}
          {isDisplayMargin() ? (
            <Tab label={_t('margin.trade.area')} value="MARGIN" key="MARGIN" />
          ) : null}
          {finalyTabs.map((item) => {
            return <Tab value={item.value} label={item.label} key={item.value} />;
          })}
        </Tabs>
      </TabsWrapper>
      <Mydivider hasFilter={!!filterTabs} />
      {filterTabs}
    </FlexColumm>
  );
};
export default SymbolTabs;
