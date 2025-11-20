/**
 * Owner: jessie@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import { ICHookOutlined, ICSearchOutlined, ICTriangleBottomOutlined } from '@kux/icons';
import { Empty, Input, Pagination, Select, Tab, Tabs, useResponsive } from '@kux/mui';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import find from 'lodash/find';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import { _t } from 'tools/i18n';
import { MyOrderLink } from '../containers/components/MyOrderLink.js';
import CardItem from './CardItem/DataItem.js';
import {
  CardListWrapper,
  FilterDialog,
  PaginationWarpper,
  SelectEmptyWrapper,
  SelectInputWrapper,
  SelectListWrapper,
  SelectOptionItem,
  SelectOptionItemText,
  SelectOverlay,
  SelectWrapper,
  StyledCardList,
  StyledFilteredInSm,
  StyledTabs,
  StyledTypeTabs,
  StyleSelectItem,
} from './styledComponents';

// H5下拉筛选框
function FilteredInSm({ selectItems, symbol, handleSymbolChange }) {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const [searchStr, setSearchStr] = useState('');
  const [selectVisible, setSelectVisible] = useState(false);

  const handleSelectVisible = useCallback((visible) => {
    setSelectVisible(visible);
  }, []);

  const handleSearch = useCallback((e) => {
    setSearchStr(e?.target?.value);
  }, []);

  const valueComp = useMemo(() => {
    const valueItem = find(selectItems, { value: symbol }) || find(selectItems, { value: '' });
    return (
      <StyleSelectItem onClick={() => handleSelectVisible(true)}>
        <span>{valueItem.label}</span>
        <ICTriangleBottomOutlined />
      </StyleSelectItem>
    );
  }, [symbol, selectItems, handleSelectVisible]);

  const itemList = useMemo(() => {
    if (!searchStr) {
      return selectItems;
    }

    return filter(selectItems, (record) => {
      if (record?.value) {
        const _value = record.value.toLowerCase();
        const _search = searchStr.toLowerCase();
        return _value.indexOf(_search) > -1;
      }
      return false;
    });
  }, [searchStr, selectItems]);

  return (
    <>
      <StyledFilteredInSm>{valueComp}</StyledFilteredInSm>

      <FilterDialog
        header={null}
        back={false}
        show={selectVisible}
        className="filterDialog"
        okText={null}
        cancelText={_t('cancel')}
        onCancel={() => handleSelectVisible(false)}
        onClose={() => handleSelectVisible(false)}
        cancelButtonProps={{ variant: 'contained', type: 'default', size: 'large' }}
        centeredFooterButton
        isInApp={isInApp}
      >
        <SelectOverlay>
          <SelectInputWrapper>
            <Input addonBefore={<ICSearchOutlined />} onChange={handleSearch} />
          </SelectInputWrapper>
          <SelectListWrapper>
            {itemList?.length ? (
              map(itemList, (item) => {
                return (
                  <SelectOptionItem
                    key={`sort_${item.value}`}
                    value={item.value}
                    className={symbol === item.value ? 'active' : ''}
                    onClick={() => {
                      handleSymbolChange(item.value);
                      handleSelectVisible(false);
                      setSearchStr('');
                    }}
                  >
                    <SelectOptionItemText>{item.label}</SelectOptionItemText>
                    {symbol === item.value && <ICHookOutlined />}
                  </SelectOptionItem>
                );
              })
            ) : (
              <SelectEmptyWrapper className="padding60">
                <Empty />
              </SelectEmptyWrapper>
            )}
          </SelectListWrapper>
        </SelectOverlay>
      </FilterDialog>
    </>
  );
}

const Cards = memo(({ listName }) => {
  const dispatch = useDispatch();
  const { sm } = useResponsive();
  const listObj = useSelector((state) => state.aptp[listName], shallowEqual);
  const symbol = useSelector((state) => state.aptp.historyListSymbol);
  const deliveryCurrencyList = useSelector(
    (state) => state.aptp.deliveryCurrencyList,
    shallowEqual,
  );

  const {
    currentPage = 1,
    pageSize = 10,
    totalNum = 0,
    items = [],
  } = useMemo(() => {
    return listObj || {};
  }, [listObj]);

  const selectItems = useMemo(() => {
    const items = [
      {
        label: _t('all'),
        value: '',
        key: '',
      },
    ];
    if (deliveryCurrencyList && deliveryCurrencyList.length) {
      deliveryCurrencyList
        .filter((tab) => !tab.ongoing)
        .map((tab) => {
          items.push({
            label: tab.shortName,
            value: tab.shortName,
            key: tab.shortName,
          });
        });
    }
    return items;
  }, [deliveryCurrencyList]);

  const handlePageChange = useCallback(
    (event, currentPage) => {
      let pms;
      if (listName === 'ongoingList') {
        pms = dispatch({ type: 'aptp/pullOngoingActivities', payload: { currentPage } });
      } else {
        pms = dispatch({ type: 'aptp/pullHistoryActivities', payload: { currentPage } });
      }
      pms.then(() => {
        window.scrollTo(0, 0);
      });
    },
    [listName, dispatch],
  );

  const handleSymbolChange = useCallback(
    (value) => {
      dispatch({ type: 'aptp/pullHistoryActivities', payload: { symbol: value, currentPage: 1 } });
    },
    [dispatch],
  );

  return (
    <CardListWrapper>
      {listName !== 'ongoingList' && (
        <SelectWrapper>
          {!sm ? (
            <FilteredInSm
              selectItems={selectItems}
              symbol={symbol}
              handleSymbolChange={handleSymbolChange}
            />
          ) : (
            <Select
              value={symbol || ''}
              allowSearch={true}
              emptyContent={
                <SelectEmptyWrapper>
                  <Empty size="small" />
                </SelectEmptyWrapper>
              }
              onChange={handleSymbolChange}
              options={selectItems}
              optionFilterProp="label"
            />
          )}
        </SelectWrapper>
      )}

      {items &&
        items.map((item) => {
          return (
            <div key={item.id} className="cardItem">
              <CardItem {...item} />
            </div>
          );
        })}
      <PaginationWarpper>
        <Pagination
          total={totalNum}
          current={currentPage}
          pageSize={pageSize}
          siblingCount={1}
          boundaryCount={0}
          onChange={handlePageChange}
        />
      </PaginationWarpper>
    </CardListWrapper>
  );
});

const TABS = [
  {
    value: 'ongoing',
    label: _t('f462b314254d4000a9f3'),
  },
  {
    value: 'history',
    label: _t('5e5f4f4170b34000a60e'),
  },
];
export default function CardList() {
  const [headerHeight, setHeaderHeight] = useState(0);
  const isInApp = JsBridge.isApp();
  const { sm, lg } = useResponsive();
  const [side, setSide] = useState('ongoing');
  const user = useSelector((state) => state.user.user, shallowEqual);
  const items = useSelector((state) => state.aptp.ongoingList?.items, shallowEqual);
  const isShowRestrictNotice = useSelector((state) => state?.$header_header?.isShowRestrictNotice);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: 'aptp/pullAllCurrencies',
    });
  }, [dispatch]);

  useEffect(() => {
    if (side === 'ongoing') {
      dispatch({ type: 'aptp/pullOngoingActivities' });
    } else {
      dispatch({ type: 'aptp/pullHistoryActivities' });
    }
  }, [dispatch, side]);

  // 当前项目列表为空时，显示历史项目列表
  useEffect(() => {
    if (!isNil(items) && !items.length) {
      setSide('history');
    }
  }, [items]);

  const handleResize = useCallback(
    debounce(() => {
      const { height } = document
        .getElementsByClassName('gbiz-headeroom')?.[0]
        ?.getBoundingClientRect?.() ?? { height: 0 };
      const _height = isInApp ? 84 : height;
      setHeaderHeight(_height);
    }, 1000),
    [isInApp, dispatch],
  );

  useEffect(() => {
    handleResize();
  }, [handleResize, isShowRestrictNotice]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  return (
    <StyledCardList data-inspector="inspector_premarket_landing_list">
      <StyledTabs top={headerHeight}>
        <StyledTypeTabs>
          {items?.length ? (
            <Tabs
              size={lg ? 'xlarge' : !sm ? 'medium' : 'large'}
              value={side}
              onChange={(event, value) => {
                setSide(value);
              }}
              variant="line"
              showScrollButtons={false}
            >
              {TABS.map(({ value, label }, index) => (
                <Tab label={label} value={value} key={value} />
              ))}
            </Tabs>
          ) : (
            <Tabs
              size={lg ? 'xlarge' : !sm ? 'medium' : 'large'}
              value="history"
              variant="line"
              showScrollButtons={false}
            >
              <Tab label={_t('5e5f4f4170b34000a60e')} value="history" />
            </Tabs>
          )}
        </StyledTypeTabs>
        {sm && <MyOrderLink variant="outlined" size="small" />}
      </StyledTabs>
      <Cards listName={side === 'ongoing' ? 'ongoingList' : 'historyList'} />
    </StyledCardList>
  );
}
