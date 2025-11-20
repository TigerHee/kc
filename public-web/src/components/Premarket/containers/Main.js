/**
 * Owner: solar.xia@kupotech.com
 */
import JsBridge from '@knb/native-bridge';
import {
  ICFilterOutlined,
  ICHookOutlined,
  ICPlusOutlined,
  ICTriangleBottomOutlined,
} from '@kux/icons';
import {
  Button,
  ClickAwayListener,
  CssBaseline,
  Dropdown,
  InputNumber,
  Spin,
  Tab,
  Tabs,
  useResponsive,
} from '@kux/mui';
import find from 'lodash/find';
import isNil from 'lodash/isNil';
import map from 'lodash/map';
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { shallowEqual, useDispatch } from 'react-redux';
import { useSelector } from 'src/hooks/useSelector';
import useUpdateEffect from 'src/hooks/useUpdateEffect';
import { _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import { useActivityStatus, useResponsiveSize } from '../hooks';
import { skip2Login } from '../util';
import { Orders } from './components';
import PostOrder from './TradeModal/PostOrder';
import TakeOrder from './TradeModal/TakeOrder';

import { useDebounceFn } from 'ahooks';
import {
  FilterDialog,
  FilterOverlay,
  MainContainer,
  OrdersAndChartsContainer,
  SortItemText,
  SortOptionItem,
  SortOptionItemText,
  SortOverlay,
  StyledCreateOrderButton,
  StyledFilteredInSm,
  StyledFilterRange,
  StyledFilterRangeBar,
  StyledMain,
  StyledTypeTabs,
  StyleSortItem,
  TypeTabsBar,
  WrapperCharts,
  WrapperOrders,
  WrapperTypeTabs,
  WrapperTypeTabsContainer,
} from '../styledComponents';
import MarketChart from './Chart/MarketChart';
import TransactionChart from './Chart/TransactionChart';
import OrderSummaryBar from './OrderSummaryBar';
import PriceBar from './PriceBar';
import Share from './Share';

const initFixedTopInfo = {
  // 选择币种
  coinType: {
    // 位置
    index: 0,
    // 距页面顶部高度
    top: 0,
    // 高度
    height: 0,
    // 最终粘性属性fixed到的高度
    fixedTop: 0,
    // 是否fixed
    isFixed: false,
    name: 'coins',
  },
  // 选择买单或卖单
  sideType: {
    // 位置
    index: 1,
    // 距页面顶部高度
    top: 0,
    // 高度
    height: 0,
    // 最终粘性属性fixed到的高度
    fixedTop: 0,
    // 是否fixed
    isFixed: false,
    name: 'type',
  },
};

// endRef 滚动到此节点，取消吸顶功能
function useFixedTop(refs, endRef, pageRef) {
  const { sm } = useResponsive();
  const activityStatus = useActivityStatus();
  // const fixedTopInfo = useSelector(state => state.aptp.fixedTopInfo)
  const [fixedTopInfo, setFixedTopInfo] = useState(initFixedTopInfo);
  const depositBannerShow = useSelector((state) => state.app.depositBannerShow);
  // 有了这个说明数据回来了,再重新计算高度
  const id = useSelector((state) => state.aptp?.deliveryCurrencyInfo?.id);
  const fixedCount = useRef(0);
  const isShowRestrictNotice = useSelector((state) => state?.$header_header?.isShowRestrictNotice);
  const disalbe = sm || activityStatus === 3; // PC或者历史活动不吸顶
  // 监听kyc、ip等信息的顶飘变化，有变化则重新计算高度
  const handleScroll = useCallback(() => {
    if (disalbe) {
      return;
    }
    const { top: endTop = 0 } = endRef.current?.getBoundingClientRect?.() || {};
    const headerHeight = (isShowRestrictNotice ? 40 : 0) + 167;

    Object.values(fixedTopInfo)
      .sort((a, b) => a.index - b.index)
      .forEach(({ fixedTop, top, name }, index) => {
        const ref = refs?.[index]?.current;
        if (!ref) return;
        if ((window?.scrollY || 0) >= top && endTop - headerHeight >= 0) {
          if (index === fixedCount.current) {
            ref.style.width = ref.offsetWidth + 'px';
            ref.style.position = 'fixed';
            ref.style.top = `${fixedTop}px`;
            ref.style.zIndex = '99';
            ref.classList.add('fixed');
            fixedCount.current++;
          }
        } else {
          if (index === fixedCount.current - 1) {
            ref.style.width = '';
            ref.style.position = '';
            ref.style.top = '';
            ref.style.zIndex = '';
            ref.classList.remove('fixed');
            fixedCount.current--;
          }
        }
        // ref.style.visibility = 'visible';
      });
  }, [disalbe, endRef, isShowRestrictNotice, fixedTopInfo, refs]);

  const handleSetFixTopInfo = useCallback(() => {
    fixedCount.current = 0;
    // 先清理fixed样式，再计算高度
    refs.forEach((ref) => {
      if (!ref.current) {
        return;
      }
      // ref.current.style.visibility = 'hidden';
      ref.current.style.width = '';
      ref.current.style.position = '';
      ref.current.style.top = '';
      ref.current.style.zIndex = '';
    });
    // 如果是pc端则取gbizheader，如果在app内部，则是自定义的header
    let baselineTop = 0;
    const gbizHeader = document.getElementsByClassName('Header-Nav')?.[0];
    if (gbizHeader) {
      baselineTop = (gbizHeader?.offsetHeight || 0) + (isShowRestrictNotice ? 40 : 0);
    } else {
      baselineTop = document.getElementsByClassName('app-custom-header')?.[0]?.offsetHeight || 0;
    }

    // 新人專享banner
    const depositBanner = document.getElementsByClassName('deposit-banner')?.[0];
    if (depositBanner) {
      baselineTop += depositBanner.offsetHeight;
    }
    if (disalbe) {
      setFixedTopInfo(initFixedTopInfo);
      return;
    }
    const res = Object.keys(initFixedTopInfo)
      .sort((a, b) => a.index - b.index)
      .slice(0, refs.length)
      .reduce((acu, key, idx, arr) => {
        const prevValue = initFixedTopInfo[key];
        const { index } = prevValue;
        // 兜底逻辑，除非接口出错、否则永远走不到
        if (!refs[index]?.current) {
          return acu;
        }
        const { height = 0, top = 0 } = refs[index].current.getBoundingClientRect() || {};
        let fixedTop = 0;
        if (idx === 0) {
          fixedTop = baselineTop;
        } else {
          fixedTop = acu[arr[idx - 1]].height + acu[arr[idx - 1]].fixedTop;
        }

        return {
          ...acu,
          [key]: {
            ...prevValue,
            fixedTop,
            height,
            top: (window?.scrollY || 0) + top - fixedTop,
          },
        };
      }, {});
    setFixedTopInfo(res);
  }, [refs, disalbe, isShowRestrictNotice]);
  const _handleResize = useCallback(() => {
    handleSetFixTopInfo();
  }, [handleSetFixTopInfo]);

  const { run: handleResize } = useDebounceFn(_handleResize, {
    wait: 500,
  });

  useEffect(() => {
    handleResize();
  }, [id, handleResize, isShowRestrictNotice, depositBannerShow]);

  useUpdateEffect(() => {
    handleScroll();
  }, [fixedTopInfo]);

  useEffect(() => {
    const pageNode = window;
    pageNode?.addEventListener?.('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      pageNode?.removeEventListener?.('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);
}

const variant = 'line';
const TypeTabs = forwardRef(({ isActivityInProcess }, ref) => {
  // id这里是完全相反的，对于用户来说选了buy tab要查询sell挂单
  const side = useSelector((state) => state.aptp.filter.side);
  const user = useSelector((state) => state.user.user, shallowEqual);
  const { sm, lg } = useResponsive();
  const dispatch = useDispatch();
  const typeTabsRef = useRef();
  useImperativeHandle(ref, () => {
    return {
      getRef() {
        return typeTabsRef;
      },
    };
  });

  useEffect(() => {
    // pc side为图表时，切换到第一个tab
    if (lg && side === 'chart') {
      dispatch({
        type: 'aptp/updateFilterCondition',
        payload: {
          side: 'sell',
          triggerSearch: true,
          currentPage: 1,
        },
      });
    }
  }, [dispatch, lg, side]);
  const types = useMemo(() => {
    const _types = [
      {
        // 买入
        name: _t('k532MZYDNVMZ7ni8ut8Uea'),
        id: 'sell',
      },
      {
        // 卖出
        name: _t('h1L8gPcBMrFHsVSHgr8d8w'),
        id: 'buy',
      },
      {
        // 已成交订单
        name: _t('g6DcWXFht9nHy7SAnb4Fec'),
        id: 'finished',
      },
      {
        // 我的订单
        name: _t('hkh1Ezk6muufQVCTAaiiRH'),
        id: 'my',
      },
    ];

    if (!lg) {
      _types.push({
        name: _t('f08f73193da64000a3a8'),
        id: 'chart',
      });
    }

    return _types;
  }, [lg]);

  return (
    <StyledTypeTabs ref={typeTabsRef}>
      <Tabs
        size={sm ? 'large' : 'small'}
        value={side}
        onChange={(event, value) => {
          // 未登录点我的订单跳转到登录页
          if (!user && value === 'my') {
            skip2Login();
            return;
          }
          if (value === 'chart') {
            dispatch({
              type: 'aptp/updateFilterCondition',
              payload: {
                side: value,
                triggerSearch: false,
              },
            });
            return;
          }
          // 我要买入Tab
          if (value === 'sell') {
            trackClick(['PreMarketBuyTab', '1']);
            // 我要卖出Tab
          } else if (value === 'buy') {
            trackClick(['PreMarketSellTab', '1']);
          }
          dispatch({
            type: 'aptp/updateFilterCondition',
            payload: {
              currentPage: 1,
              side: value,
              triggerSearch: true,
            },
          });
        }}
        variant={variant}
        showScrollButtons={false}
      >
        {types.map(({ id, name }) => (
          <Tab label={name} value={id} key={id} />
        ))}
      </Tabs>
      <div className="mask-type-tabs" />
    </StyledTypeTabs>
  );
});

function FilterRangeOverlay() {
  const isInApp = JsBridge.isApp();
  const [minAmount, setMinAmount] = useState(undefined);
  const [maxAmount, setMaxAmount] = useState(undefined);
  const [filterVisible, setFilterVisible] = useState(false);
  const dispatch = useDispatch();
  const filterMinAmount = useSelector((state) => state.aptp?.filter?.minAmount);
  const filterMaxAmount = useSelector((state) => state.aptp?.filter?.maxAmount);
  const offerCurrency = useSelector((state) => state.aptp?.deliveryCurrencyInfo?.offerCurrency);
  const size = useResponsiveSize();

  const handleBlur = useCallback(() => {
    if (parseFloat(minAmount) > parseFloat(maxAmount)) {
      setMaxAmount(minAmount);
      setMinAmount(maxAmount);
    }
  }, [minAmount, maxAmount]);

  const handleReset = useCallback(() => {
    setMinAmount(undefined);
    setMaxAmount(undefined);
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        currentPage: 1,
        minAmount: null,
        maxAmount: null,
        triggerSearch: true,
      },
    }).then(() => {
      setFilterVisible(false);
    });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        currentPage: 1,
        minAmount,
        maxAmount,
        triggerSearch: true,
      },
    }).then(() => {
      setFilterVisible(false);
    });
  }, [dispatch, minAmount, maxAmount]);

  const isFilteredAmount = useMemo(() => {
    return !isNil(filterMinAmount) || !isNil(filterMaxAmount);
  }, [filterMinAmount, filterMaxAmount]);

  const overlay = useMemo(() => {
    return (
      <div className="overlay">
        <div className="title">{`${_t('ruSwoUhrR6vDpiM4zq5CRX')} (${offerCurrency})`}</div>
        <div className="value-range">
          <InputNumber
            className="item"
            value={minAmount}
            onChange={(val) => {
              setMinAmount(val);
            }}
            onBlur={handleBlur}
            min={0}
            step={1}
          />
          {size === 'sm' && (
            <span className="range-split">
              <div className="split-mark" />
            </span>
          )}
          <InputNumber
            className="item"
            value={maxAmount}
            onChange={(val) => {
              setMaxAmount(val);
            }}
            onBlur={handleBlur}
            min={0}
            step={1}
          />
        </div>
        {size !== 'sm' && (
          <div className="confirm-btn">
            <Button className="item" variant="outlined" onClick={handleReset}>
              {_t('7HMGnJdyEowi41uVSWDoYT')}
            </Button>
            <Button className="item" onClick={handleConfirm}>
              {_t('u9QAZW6WNmKYHB6do1KwgQ')}
            </Button>
          </div>
        )}
      </div>
    );
  }, [handleBlur, handleConfirm, handleReset, maxAmount, minAmount, offerCurrency, size]);

  useEffect(() => {
    if (filterVisible) {
      setMaxAmount(filterMaxAmount);
      setMinAmount(filterMinAmount);
    }
  }, [filterVisible, filterMinAmount, filterMaxAmount]);

  return (
    <StyledFilterRange>
      {size === 'sm' ? (
        <>
          <button
            onClick={() => {
              setFilterVisible(true);
            }}
          >
            <ICFilterOutlined
              className="filter-icon"
              size={16}
              color={isFilteredAmount ? '#01bc8d' : '#8c8c8c'}
            />
          </button>
          <FilterDialog
            title={_t('s4V2zNSxxws2vX41VrAWBC')}
            back={false}
            // maskClosable
            show={filterVisible}
            cancelText={_t('7HMGnJdyEowi41uVSWDoYT')}
            okText={_t('u9QAZW6WNmKYHB6do1KwgQ')}
            onOk={handleConfirm}
            onCancel={handleReset}
            onClose={() => setFilterVisible(false)}
            cancelButtonProps={{ variant: 'contained', type: 'default' }}
            centeredFooterButton
            isInApp={isInApp}
          >
            <FilterOverlay>
              {/* <div className="only-my-order">
                <div className="title">{_t('341fwCC8PY5xvtQZX1R5na')}</div>
                <OnlyMyOrder />
              </div>
              <Divider /> */}
              <div className="filter-range">{overlay}</div>
            </FilterOverlay>
          </FilterDialog>
        </>
      ) : (
        <Dropdown
          trigger="click"
          visible={filterVisible}
          overlay={
            <ClickAwayListener
              onClickAway={() => {
                setFilterVisible(false);
              }}
            >
              {overlay}
            </ClickAwayListener>
          }
        >
          <button
            onClick={() => {
              setFilterVisible(true);
            }}
          >
            <ICFilterOutlined
              className="filter-icon"
              size={size === 'sm' ? 16 : 24}
              color={isFilteredAmount ? '#01bc8d' : '#8c8c8c'}
            />
          </button>
        </Dropdown>
      )}
    </StyledFilterRange>
  );
}

function FilterRangeBar() {
  const [minAmount, setMinAmount] = useState(undefined);
  const [maxAmount, setMaxAmount] = useState(undefined);
  const dispatch = useDispatch();
  const filterMinAmount = useSelector((state) => state.aptp?.filter?.minAmount);
  const filterMaxAmount = useSelector((state) => state.aptp?.filter?.maxAmount);
  const offerCurrency = useSelector((state) => state.aptp?.deliveryCurrencyInfo?.offerCurrency);
  const size = useResponsiveSize();

  const handleBlur = useCallback(() => {
    if (parseFloat(minAmount) > parseFloat(maxAmount)) {
      setMaxAmount(minAmount);
      setMinAmount(maxAmount);
    }
  }, [minAmount, maxAmount]);

  const handleReset = useCallback(() => {
    setMinAmount(undefined);
    setMaxAmount(undefined);
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        currentPage: 1,
        minAmount: null,
        maxAmount: null,
        triggerSearch: true,
      },
    });
  }, [dispatch]);

  const handleConfirm = useCallback(() => {
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        currentPage: 1,
        minAmount,
        maxAmount,
        triggerSearch: true,
      },
    });
  }, [dispatch, minAmount, maxAmount]);

  const isFilteredAmount = useMemo(() => {
    return !isNil(filterMinAmount) || !isNil(filterMaxAmount);
  }, [filterMinAmount, filterMaxAmount]);

  useEffect(() => {
    setMaxAmount(filterMaxAmount);
    setMinAmount(filterMinAmount);
  }, [filterMinAmount, filterMaxAmount]);

  return (
    <StyledFilterRangeBar>
      <CssBaseline />
      <div className="input-group">
        <InputNumber
          label={`${_t('ruSwoUhrR6vDpiM4zq5CRX')} (${offerCurrency || ''})`}
          labelProps={{ shrink: true }}
          placeholder="Min"
          value={minAmount}
          onChange={(val) => {
            setMinAmount(val);
          }}
          onBlur={handleBlur}
          min={0}
          step={1}
        />
        /
        <InputNumber
          label={`${_t('ruSwoUhrR6vDpiM4zq5CRX')} (${offerCurrency || ''})`}
          labelProps={{ shrink: true }}
          placeholder="Max"
          value={maxAmount}
          onChange={(val) => {
            setMaxAmount(val);
          }}
          onBlur={handleBlur}
          min={0}
          step={1}
        />
      </div>
      <div className="button-group">
        <Button type="default" onClick={handleReset}>
          {_t('7HMGnJdyEowi41uVSWDoYT')}
        </Button>
        <Button variant="outlined" onClick={handleConfirm}>
          {_t('search')}
        </Button>
      </div>
    </StyledFilterRangeBar>
  );
}

function CreateOrderButton() {
  const dispatch = useDispatch();
  const { side } = useSelector((state) => state.aptp.filter, shallowEqual);
  const onClick = () => {
    dispatch({
      type: 'aptp/openPostModal',
      payload: {
        side: side === 'buy' ? 'sell' : 'buy',
      },
    });
  };
  const { sm } = useResponsive();
  return (
    <StyledCreateOrderButton
      type="primary"
      onClick={onClick}
      startIcon={sm ? null : <ICPlusOutlined size="16" />}
    >
      {_t('e1ypdPpUZx9nrAGMGKVW24')}
    </StyledCreateOrderButton>
  );
}

// H5筛选条件
function FilteredInSm() {
  const isInApp = JsBridge.isApp();
  const dispatch = useDispatch();
  const [sortKey, setSortKey] = useState('');
  const [sortVisible, setSortVisible] = useState(false);

  useEffect(() => {
    const filters = {};
    if (sortKey) {
      const [sortFields, sortValue] = sortKey.split('-');
      filters.sortFields = sortFields;
      filters.sortValue = sortValue;
    }
    dispatch({
      type: 'aptp/updateFilterCondition',
      payload: {
        ...filters,
        triggerSearch: true,
      },
    });
  }, [sortKey, dispatch]);

  const sortList = useMemo(() => {
    return [
      { value: '', label: _t('nVNgub9cSpToKbXYiTgj5c') },
      { value: 'price-ASC', label: _t('hJaUxBG95jDBFpXsBr3mkM') },
      { value: 'price-DESC', label: _t('w6gdb5aKwxTjLM4N4mJ9wf') },
      { value: 'size-ASC', label: _t('76BVms75xFJyRhQ3p3AX96') },
      { value: 'size-DESC', label: _t('3ayqGRhbXu4ZWvveRjR8Ku') },
      { value: 'funds-ASC', label: _t('qeWbTcYYtKyCQyvux9jXCP') },
      { value: 'funds-DESC', label: _t('e9LneY2dB7dhMFqNu6byXd') },
    ];
  }, []);

  const handleSortVisible = useCallback((visible) => {
    setSortVisible(visible);
  }, []);

  const sortComp = useMemo(() => {
    const sortItem = find(sortList, { value: sortKey }) || find(sortList, { value: '' });
    return (
      <StyleSortItem onClick={() => handleSortVisible(true)}>
        <SortItemText active={!!sortItem.value}>{sortItem.label}</SortItemText>
        <ICTriangleBottomOutlined />
      </StyleSortItem>
    );
  }, [sortKey, sortList, handleSortVisible]);

  return (
    <>
      <StyledFilteredInSm>
        {sortComp}
        <FilterRangeOverlay />
      </StyledFilteredInSm>

      <FilterDialog
        title={_t('kKWTnAyxVFZVpY9LjmJTxH')}
        back={false}
        // maskClosable
        show={sortVisible}
        className="filterDialog"
        okText={null}
        cancelText={_t('2tZpffHG63KjtUMj246ry5')}
        onCancel={() => handleSortVisible(false)}
        onClose={() => handleSortVisible(false)}
        cancelButtonProps={{ variant: 'contained', type: 'default', size: 'large' }}
        centeredFooterButton
        isInApp={isInApp}
      >
        <SortOverlay>
          {map(sortList, (item) => {
            return (
              <SortOptionItem
                key={`sort_${item.value}`}
                value={item.value}
                className={sortKey === item.value ? 'active' : ''}
                onClick={() => {
                  setSortKey(item.value);
                  handleSortVisible(false);
                }}
              >
                <SortOptionItemText>{item.label}</SortOptionItemText>
                {sortKey === item.value && <ICHookOutlined />}
              </SortOptionItem>
            );
          })}
        </SortOverlay>
      </FilterDialog>
    </>
  );
}

function CheckFixedElements({ refs = [], endRef, pageRef }) {
  useFixedTop(refs, endRef, pageRef);
  return null;
}

export default function Main({ coinTabsRef, pageRef, endRef }) {
  const isInApp = JsBridge.isApp();
  const id = useSelector((state) => state.aptp?.deliveryCurrencyInfo?.id);
  const { visible: ModalVisible, postOrTake } = useSelector(
    (state) => state.aptp.modalInfo,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const { sm, lg } = useResponsive();
  const activityStatus = useActivityStatus();
  const user = useSelector((state) => state.user.user, shallowEqual);
  const { side, sortValue, sortFields, currentPage, pageSize } = useSelector(
    (state) => state.aptp.filter,
    shallowEqual,
  );
  // 活动未开始或已结束，一般都有相同的判断逻辑
  const isActivityInProcess = activityStatus === 1;
  const typeTabsRef = useRef();
  // 用于吸顶需求
  const [refs, setRefs] = useState([]);

  useEffect(() => {
    setRefs([coinTabsRef, typeTabsRef]);
  }, [coinTabsRef, isActivityInProcess]);

  useEffect(() => {
    if (isActivityInProcess && user) {
      // 活动进行中再拉取拆单信息
      dispatch({ type: 'aptp/pullSplitInfo' });
    }
  }, [isActivityInProcess, user, dispatch]);

  useEffect(() => {
    if (isActivityInProcess) {
      dispatch({ type: 'aptp/pullSupportBreakContractTime' });
    }
  }, [isActivityInProcess, dispatch]);

  // const PostOrder = lazy(() =>
  //   import(/* webpackChunkName: 'aptp-postOrder' */ './TradeModal/PostOrder.js'),
  // );
  // const TakeOrder = lazy(() =>
  //   import(/* webpackChunkName: 'aptp-takeOrder' */ './TradeModal/TakeOrder.js'),
  // );

  return (
    <StyledMain data-inspector="inspector_premarket_main">
      {id ? (
        <MainContainer>
          <CheckFixedElements refs={refs} pageRef={pageRef} endRef={endRef} />
          <PriceBar />
          <OrdersAndChartsContainer>
            <WrapperOrders as="section" activityStatus={activityStatus}>
              <WrapperTypeTabsContainer>
                <WrapperTypeTabs ref={typeTabsRef}>
                  <TypeTabsBar>
                    <TypeTabs isActivityInProcess={isActivityInProcess} />
                    {isActivityInProcess && <CreateOrderButton />}
                  </TypeTabsBar>
                  {sm && (side === 'buy' || side === 'sell') && isActivityInProcess && (
                    <FilterRangeBar />
                  )}
                </WrapperTypeTabs>
              </WrapperTypeTabsContainer>
              {side === 'my' && <OrderSummaryBar />}
              {!sm && isActivityInProcess && side !== 'chart' && <FilteredInSm />}
              {side !== 'chart' ? (
                <Orders />
              ) : (
                <WrapperCharts as="section">
                  <figure>
                    <TransactionChart />
                  </figure>
                  <figure>
                    <MarketChart />
                  </figure>
                </WrapperCharts>
              )}
            </WrapperOrders>
            {lg && activityStatus > 0 && (
              <WrapperCharts as="section">
                <figure>
                  <TransactionChart />
                </figure>
                <figure>
                  <MarketChart />
                </figure>
              </WrapperCharts>
            )}
          </OrdersAndChartsContainer>
          {/* <InviteBar /> */}
          {isInApp && <div style={{ height: '64px' }} />}
        </MainContainer>
      ) : (
        <Spin className="main-spin" spinning />
      )}

      {postOrTake === 1 && (
        // <Suspense fallback={<div />}>
        <TakeOrder
          open={ModalVisible}
          onClose={() => {
            dispatch({
              type: 'aptp/closeTakeModal',
            });
          }}
        />
        // </Suspense>
      )}
      {postOrTake === 0 && (
        // <Suspense fallback={<div />}>
        <PostOrder
          open={ModalVisible}
          onClose={() => {
            dispatch({
              type: 'aptp/closePostModal',
            });
            dispatch({
              type: 'aptp/createOrderParams',
              payload: {
                price: null,
                size: null,
              },
            });
          }}
        />
        // </Suspense>
      )}
      <Share />
    </StyledMain>
  );
}
