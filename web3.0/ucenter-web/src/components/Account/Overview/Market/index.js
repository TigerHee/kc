/**
 * Owner: willen@kupotech.com
 */
import { useLocale } from '@kucoin-base/i18n';
import { useCompliantShow } from '@kucoin-biz/compliantCenter';
import { useMultiSiteConfig } from '@kucoin-gbiz-next/hooks';
import { ICFireOutlined } from '@kux/icons';
import { styled, Table, Tabs, useResponsive } from '@kux/mui';
import HelpModal from 'components/Account/Overview/Market/HelpModal';
import SelectDropdown from 'components/Account/Overview/SelectDropdown';
import ChangeRate from 'components/common/ChangeRate';
import CoinCodeToFullName from 'components/common/CoinCodeToFullName';
import CoinCodeToName from 'components/common/CoinCodeToName';
import CoinCurrency from 'components/common/CoinCurrency';
import CoinIcon from 'components/common/CoinIcon';
import FutureSymbolText from 'components/common/FutureSymbolText';
import { tenantConfig } from 'config/tenant';
import useIpCountry from 'hooks/useIpCountry';
import { useMarketMultiSiteConfig } from 'hooks/useMarketMultiSiteConfig';
import { find, isBoolean, throttle } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ACCOUNT_MARKET_HOT_TAB_SPM } from 'src/constants';
import { addLangToPath, _t } from 'tools/i18n';
import { trackClick } from 'utils/ga';
import Card from './Card';

const { Tab } = Tabs;

const MarketWrapper = styled.div`
  margin-bottom: 32px;
  ${(props) => props.theme.breakpoints.up('sm')} {
    padding: 28px 40px 34px;
    border: 1px solid ${({ theme }) => theme.colors.cover8};
    border-radius: 20px;
  }
  ${(props) => props.theme.breakpoints.down('lg')} {
    margin-bottom: 40px;
  }
`;

const MarketHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const MarketTitle = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
  margin-bottom: 0;
`;

const MarketLinkText = styled.div`
  font-weight: 400;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text60};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const MarketLinkDivider = styled.span`
  width: 1px;
  height: 12px;
  background-color: ${({ theme }) => theme.colors.cover16};
  margin: 0 12px;
`;

const ExtendTable = styled(Table)`
  & thead tr th {
    padding: 4px 0;
    font-size: 14px;
    outline: none;
    user-select: none;
    &[aria-sort='ascending'] svg:first-of-type {
      fill: ${({ theme }) => theme.colors.text};
    }
    &[aria-sort='descending'] svg:last-of-type {
      fill: ${({ theme }) => theme.colors.text};
    }
  }
  & tbody tr td {
    padding: 12.25px 0;
    &:first-of-type:before {
      left: -16px;
      width: 16px;
    }
    &:last-of-type:after {
      right: -16px;
      width: 16px;
    }
  }
  .KuxEmpty-img {
    width: 136px;
    height: unset;
  }
`;

const CoinBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
`;

const SymbolBox = styled.div`
  display: flex;
  align-items: center;
  margin-right: 12px;
  width: ${({ isH5Future }) => (isH5Future ? '150px' : 'auto')};
`;

const FuturesIcon = styled.img`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 20px;
    height: 20px;
  }
`;

const SymbolName = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text30};
  margin-left: 4px;
  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    font-size: 16px;
    line-height: 130%;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0px;
    strong {
      font-size: 15px;
    }
  }
`;
const ExtendFutureSymbolText = styled(FutureSymbolText)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-size: 16px;
  line-height: 130%;
  margin-left: 4px;
  word-break: break-word;
  span:first-of-type {
    margin-right: 5px;
  }
  span:last-of-type {
    color: ${({ theme }) => theme.colors.text30};
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-left: 0px;
    font-size: 15px;
    span:last-of-type {
      color: ${({ theme }) => theme.colors.text30};
      font-size: 13px;
    }
  }
`;

const CoinName = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 4px;
  & > span:nth-of-type(1) {
    margin-bottom: 2px;
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
    font-size: 16px;
    line-height: 130%;
    ${({ theme }) => theme.breakpoints.down('sm')} {
      font-size: 15px;
    }
  }
  & > span:nth-of-type(2) {
    color: ${({ theme }) => theme.colors.text40};
    font-weight: 400;
    font-size: 12px;
    line-height: 130%;
  }
`;

const PriceBox = styled.div`
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;

const Price = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 2px;
  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;

const SubCoinCurrency = styled(CoinCurrency)`
  font-weight: 400;
  font-size: 12px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text40};
`;

const ExtendCoinCurrency = styled(CoinCurrency)`
  font-weight: 500;
  font-size: 16px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
`;

const TradeLink = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 130%;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const FireIcon = styled(ICFireOutlined)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 24px;
`;

const ExtendTabs = styled(Tabs)`
  margin-bottom: 12px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cover4};
  ${({ theme }) => theme.breakpoints.down('sm')} {
    margin-bottom: 8px;
  }
`;

const SubTabsBox = styled.div`
  display: flex;
  margin-top: 20px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
`;

const ExtendSubTabs = styled(Tabs)`
  [dir='rtl'] & {
    .KuxTab-TabItem:nth-of-type(2) {
      margin-right: 12px /*! @noflip */;
      margin-left: unset /*! @noflip */;
    }
  }
`;

const ExtendChangeRate = styled(ChangeRate)`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  [dir='rtl'] & {
    justify-content: flex-start;
  }
  ${(props) => props.theme.breakpoints.down('sm')} {
    font-size: 15px;
  }
`;

const getCurrencyIcon = (currency) => {
  const host = 'https://assets.staticimg.com';
  return `${host}/futures/assets/${currency}.png`;
};

const OverviewMarket = () => {
  // uc 多站点配置 控制概览是否展示行情模块
  const { multiSiteConfig } = useMultiSiteConfig();
  // 行情多站点配置 控制行情模块内部功能
  const { marketMultiSiteConfig } = useMarketMultiSiteConfig();
  const marketMultiSiteConfigRef = useRef(marketMultiSiteConfig);
  marketMultiSiteConfigRef.current = marketMultiSiteConfig;

  const [activeTab, setActiveTab] = useState(tenantConfig.account.marketActiveTab);
  const [activeSubTab, setActiveSubTab] = useState('SPOT');
  const [isAutoChangeTab, setAutoChangeTab] = useState(true);
  const [helpModalShow, setHelpModalShow] = useState(false);

  const rawHotMarketList = useSelector((s) => s.accountOverview.hotMarketList); // 热门行情币种列表
  const favoriteMarketList = useSelector((s) => s.accountOverview.favoriteMarketList); // 自选交易对列表
  const { isSub = false } = useSelector((state) => state.user.user) || {};
  const trendMap = useSelector((s) => s.accountOverview.trendMap) || {};
  const kumexTrendMap = useSelector((s) => s.accountOverview.kumexTrendMap) || {};
  const loading = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const dispatchRef = useRef(dispatch);
  dispatchRef.current = dispatch;
  const hideBalanceAmount = useSelector((s) => s.accountOverview.hideBalanceAmount);
  const tableLoading =
    loading.effects['accountOverview/getHotMarket'] ||
    loading.effects['accountOverview/getFvoriteMarket'];
  const { isRTL } = useLocale();
  const rv = useResponsive();
  const downLarge = !rv?.lg;
  const downSmall = !rv?.sm;

  // 行情模块展业规则 ip 是英国命中合规，不应该展示行情模块
  // const showMarketCompliant = useCompliantShow(ACCOUNT_MARKET_SPM);
  // 热门 tab 展业规则 ip 是英国命中合规，不应该展示热门
  const showHotTabCompliant = useCompliantShow(ACCOUNT_MARKET_HOT_TAB_SPM);

  const userIpCountry = useIpCountry();

  // 是否展示自选
  const showFavorites = marketMultiSiteConfig?.favorites?.open;
  // 是否展示热门 只有能查到 IP 国家并且不是英国，同时多站点开启热门才展示热门
  const showHot = showHotTabCompliant && marketMultiSiteConfig?.hot?.open;
  const showHotRef = useRef(showHot);
  showHotRef.current = showHot;

  // 行情模块只受行情配置接口控制，uc 多租户配置不再控制
  const showMarket = showFavorites || showHot;

  // 是否展示二级 Tab，只有一级 Tab 是自选，并且多站点开启了自选
  const showSubTab =
    activeTab === 'favorites' && marketMultiSiteConfig?.favorites?.subModules?.length;

  // 自选是否展示现货交易二级 Tab
  const showSubTabSpot = find(
    marketMultiSiteConfig?.favorites?.subModules,
    (subTab) => subTab?.name === 'SPOT',
  )?.open;

  // 自选是否展示合约交易二级 Tab
  const showSubTabFuture = find(
    marketMultiSiteConfig?.favorites?.subModules,
    (subTab) => subTab?.name === 'FUTURE',
  )?.open;
  const showSubTabFutureRef = useRef(showSubTabFuture);
  showSubTabFutureRef.current = showSubTabFuture;

  // 新旧接口字段不一致，做key的映射
  const hotMarketList = useMemo(() => {
    return rawHotMarketList?.map((item) => {
      return {
        ...item,
        currency: item?.currencyName,
        symbol: item?.symbolCode,
        priceChange: item?.changeRate24h,
        price: item?.lastUSDPrice,
      };
    });
  }, [rawHotMarketList]);

  useEffect(() => {
    let timer = window.setTimeout(() => {
      if (
        isBoolean(tableLoading) &&
        !tableLoading &&
        isAutoChangeTab &&
        favoriteMarketList?.length === 0
      ) {
        if (activeSubTab !== 'FUTURE' && showSubTabFutureRef.current) {
          setActiveSubTab('FUTURE');
        } else if (showHotRef.current) {
          // 开启热门多站点配置，才能切换到热门
          setActiveTab('hot');
        }
      }
    }, 500);

    return () => {
      window.clearTimeout(timer);
    };
  }, [favoriteMarketList, isAutoChangeTab, tableLoading, activeSubTab]);

  useEffect(() => {
    // 默认就要展示热榜内容，但是如果获取不到 IP，则不展示 Tab 热榜
    if (activeTab === 'hot') {
      dispatchRef.current({ type: 'accountOverview/getHotMarket' });
    } else if (showFavorites) {
      // 行情多站点中配置了自选
      dispatchRef.current({
        type: 'accountOverview/getFvoriteMarket',
        payload: { type: activeSubTab },
      });
    }
  }, [activeTab, activeSubTab, showFavorites]);

  const fetchKLineData = useCallback(
    (symbol) => {
      if (!symbol) return;
      // 查询时间段
      const timeEnd = Math.floor(Date.now() / 1000); // 单位：秒
      const timeBegin = timeEnd - 4 * 3600;
      const isFuture = activeTab === 'favorites' && activeSubTab === 'FUTURE';
      if (isFuture) {
        dispatch({
          type: 'accountOverview/getKumexCandles',
          payload: { symbol, begin: timeBegin, end: timeEnd },
        });
      } else {
        // 其他情况为现货交易对列表
        dispatch({
          type: 'accountOverview/getKLineData',
          payload: { symbol, begin: timeBegin, end: timeEnd },
        });
      }
    },
    [activeSubTab, activeTab],
  );

  // 0.5秒节流
  const handleChangeActiveTab = useCallback(
    throttle(
      (e, val) => {
        setActiveTab(val);
        setAutoChangeTab(false);
      },
      500,
      { trailing: false },
    ),
    [],
  );

  // 0.5秒节流
  const handleChangeActiveSubTab = useCallback(
    throttle((e, val) => setActiveSubTab(val), 500, { trailing: false }),
    [],
  );

  const observer = useMemo(() => {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0) {
            // 触发后取消监听
            observer.unobserve(entry.target);
            // row可见请求24h趋势图
            fetchKLineData(entry.target.getAttribute('data-symbol'));
          }
        });
      },
      { threshold: [0.1] },
    );
  }, [fetchKLineData]);

  // 根据tab类型不同，过滤需要的table行
  const columns = useMemo(() => {
    let fullColumns = [
      {
        title: _t('6MC1q8Lv492spcf71mMJvK'),
        dataIndex: 'currency',
        key: 'currency',
        sorter: (a, b) => a?.currency?.localeCompare(b?.currency) || false,
        render: (text, record) => {
          text = text || record?.symbol?.split('-')?.[0];
          return (
            <CoinBox>
              <CoinIcon maskConfig={{ size: 24 }} coin={text} persist />
              <CoinName>
                <span>
                  <CoinCodeToName coin={text} />
                </span>
                <span>
                  <CoinCodeToFullName coin={text} />
                </span>
              </CoinName>
            </CoinBox>
          );
        },
      },
      {
        title:
          activeTab === 'favorites' && activeSubTab === 'FUTURE'
            ? _t('rA1tMb3oz3qXXn3N258bzW')
            : _t('mkTzC82devTbRDQkHg8eXS'),
        dataIndex: 'symbol',
        key: 'symbol',
        sorter: (a, b) => {
          if (activeTab === 'favorites' && activeSubTab === 'FUTURE') {
            return a?.contract?.baseCurrency?.localeCompare(b?.contract?.baseCurrency) || false;
          } else {
            const aBase = a?.symbol?.split('-')?.[0];
            const bBase = b?.symbol?.split('-')?.[0];
            return aBase?.localeCompare(bBase) || false;
          }
        },
        render: (symbol, record) => {
          const base = symbol?.split('-')?.[0];
          const quote = symbol?.split('-')?.[1];
          return activeTab === 'favorites' && activeSubTab === 'FUTURE' ? (
            <SymbolBox isH5Future={downSmall}>
              <FuturesIcon
                src={record?.contract?.imgUrl || getCurrencyIcon(record?.contract?.baseCurrency)}
              />
              <SymbolName>
                <ExtendFutureSymbolText contract={record?.contract} isHTML />
              </SymbolName>
            </SymbolBox>
          ) : (
            <SymbolBox>
              <CoinIcon maskConfig={{ size: downSmall ? 20 : 24 }} coin={base} persist />
              <SymbolName>
                <strong>
                  <CoinCodeToName coin={base} />
                </strong>
                /<CoinCodeToName coin={quote} />
              </SymbolName>
            </SymbolBox>
          );
        },
      },
      {
        title: _t('qN61LLGpxv8GMe2HcBQg1j'),
        dataIndex: 'holdAmount',
        key: 'holdAmount',
        render: (text, record) => {
          return hideBalanceAmount ? (
            <PriceBox>**</PriceBox>
          ) : (
            <PriceBox>
              <Price>{text}</Price>
              <SubCoinCurrency
                hideLegalCurrency
                useLegalChars
                needShowEquelFlag={false}
                coin={record?.symbol?.split('-')?.[1]}
                value={text}
              />
            </PriceBox>
          );
        },
      },
      {
        title: _t('uVpe55QPWCqq96bxr2LCLM'),
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => {
          return (
            <ExtendCoinCurrency
              hideLegalCurrency
              useLegalChars
              needShowEquelFlag={false}
              coin={
                activeTab === 'favorites' && activeSubTab === 'FUTURE'
                  ? record?.contract?.quoteCurrency
                  : record?.symbol?.split('-')?.[1]
              }
              value={text}
            />
          );
        },
      },
      {
        title: _t('fULSrfNgFM3iBEwChXLpQB'),
        dataIndex: 'priceChange',
        key: 'priceChange',
        width: downLarge ? 200 : '20%',
        ...(isRTL ? {} : { align: 'right' }),
        sorter: (a, b) => a.priceChange - b.priceChange,
        render: (text) => (text === null ? '--' : <ExtendChangeRate value={text} />),
      },
      {
        title: _t('pjWUJ87re1A5FXU7tKAZUT'),
        dataIndex: 'charts',
        key: 'charts',
        width: downLarge ? 180 : '20%',
        ...(isRTL ? {} : { align: 'right' }),
        render: (val, row) => {
          const { symbol, contract } = row || {};
          const _symbol =
            activeTab === 'favorites' && activeSubTab === 'FUTURE' ? contract?.symbol : symbol;
          if (!_symbol) return null;
          const domId = `${activeTab}_${activeSubTab}_${_symbol}`;
          setTimeout(() => {
            if (document.getElementById(domId)) observer.observe(document.getElementById(domId));
          }, 200);
          return (
            <Card
              key={domId}
              id={domId}
              symbol={_symbol}
              changeRate={row.priceChange}
              trend={
                activeTab === 'favorites' && activeSubTab === 'FUTURE'
                  ? kumexTrendMap[contract?.symbol] || []
                  : trendMap[symbol] || []
              }
            />
          );
        },
      },
      {
        title: _t('geQ4RRGZaoBbHtPxPWcnbU'),
        dataIndex: 'operation',
        key: 'operation',
        width: downLarge ? 120 : '',
        align: 'right',
        render: (val, row) => {
          const options = [];

          // 行情多站点配置是否支持机器人交易
          // 找到当前的二级 Tab 的配置
          const currentSubModule = find(
            marketMultiSiteConfigRef.current?.[activeTab]?.subModules,
            (subTab) => subTab?.name === activeSubTab,
          );
          // 如果没有二级 Tab 的配置，则使用一级 Tab 的配置
          const supportRobotTrading =
            currentSubModule?.operateConfig?.robotTrading ??
            marketMultiSiteConfigRef.current?.[activeTab]?.operateConfig?.robotTrading;

          if (activeSubTab === 'FUTURE' && activeTab === 'favorites') {
            // 支持合约交易
            if (row.isContractEnable) {
              options.push({ value: 'futures', label: _t('ud41yoFd27vKYce3CN8Wgh') });
            }
            // 支持合约机器人
            if (
              !isSub &&
              row.isRobotEnable &&
              // 是否支持机器人交易按钮
              supportRobotTrading &&
              row.robotTypes?.some((i) => i?.code === 'FUTURES_GRID')
            ) {
              options.push({ value: 'futures_bot', label: _t('mZF9rvhqnBCojeig3paRRk') });
            }
          } else {
            // 支持现货交易
            if (row.isFiatTradeEnabled) {
              options.push({ value: 'spot', label: _t('4G4zKKRTZCy7gQx5iFkoCP') });
            }
            // 支持现货机器人
            if (
              !isSub &&
              supportRobotTrading &&
              // 是否支持机器人交易按钮
              row.isRobotEnable &&
              row.robotTypes?.some((i) => i?.code === 'GRID')
            ) {
              options.push({ value: 'bot', label: _t('mZF9rvhqnBCojeig3paRRk') });
            }
          }
          if (!options.length) return null;
          return (
            <TradeLink>
              <SelectDropdown
                options={options}
                onChange={(type) => {
                  if (type === 'spot') {
                    if (activeTab === 'hot') {
                      trackClick(['Hot', 'Spot'], { currency: row.currency });
                    } else {
                      if (activeSubTab === 'HOLDING') {
                        trackClick(['Holding', 'Spot'], { currency: row.currency });
                      }
                      if (activeSubTab === 'SPOT') {
                        trackClick(['FavoriteSymbol', 'Spot'], { symbol: row.symbol });
                      }
                    }
                    window.open(`/trade/${row.symbol}`);
                  }
                  if (type === 'bot') {
                    if (activeTab === 'hot') {
                      trackClick(['Hot', 'Bot'], { currency: row.currency });
                    } else {
                      if (activeSubTab === 'HOLDING') {
                        trackClick(['Holding', 'Bot'], { currency: row.currency });
                      }
                      if (activeSubTab === 'SPOT') {
                        trackClick(['FavoriteSymbol', 'Bot'], { symbol: row.symbol });
                      }
                    }
                    window.open(`/trade/strategy/${row.symbol}`);
                  }
                  if (type === 'futures') {
                    trackClick(['FavoriteFutures', 'Futures'], {
                      futures: row?.contract?.symbol,
                    });
                    window.open(`${tenantConfig.account.featureTradeUrl}/${row?.contract?.symbol}`);
                  }
                  if (type === 'futures_bot') {
                    trackClick(['FavoriteFutures', 'Bot'], { futures: row?.contract?.symbol });
                    window.open(`/trade/strategy/${row?.contract?.symbol}`);
                  }
                }}
              >
                <span>{_t('7ZtRRTRUL3QuFKapBKD5cA')}</span>
              </SelectDropdown>
            </TradeLink>
          );
        },
      },
    ];
    let _columns = [];
    // 小屏不显示24趋势图
    if (downSmall) {
      fullColumns = fullColumns.filter((k) => k.key !== 'charts' && k.key !== 'operation');
    }
    // 热门行情不展示持有数量与交易对列
    if (activeTab === 'hot') {
      _columns = fullColumns.filter((k) => k.key !== 'holdAmount' && k.key !== 'symbol');
    }
    // 自选-现货不展示持有数量与币种列
    if (activeTab === 'favorites' && activeSubTab === 'SPOT') {
      _columns = fullColumns.filter((k) => k.key !== 'holdAmount' && k.key !== 'currency');
    }
    // 自选-合约不展示持有数量与币种列
    if (activeTab === 'favorites' && activeSubTab === 'FUTURE') {
      _columns = fullColumns.filter((k) => k.key !== 'holdAmount' && k.key !== 'currency');
    }
    // 自选-持仓不展示24H趋势图与交易对列
    if (activeTab === 'favorites' && activeSubTab === 'HOLDING') {
      _columns = fullColumns.filter((k) => k.key !== 'charts' && k.key !== 'symbol');
    }
    return _columns;
  }, [downSmall, activeTab, activeSubTab, hideBalanceAmount, kumexTrendMap, trendMap, isSub]);

  if (!multiSiteConfig || !marketMultiSiteConfig) {
    return null;
  }

  if (
    !showMarket ||
    // 英国不展示行情模块
    (userIpCountry.isGBOrNoCountry && tenantConfig.account.supportHideMarketByCompliant)
  ) {
    return null;
  }

  return (
    <MarketWrapper data-inspector="account_overview_market">
      <MarketHeader>
        <MarketTitle>{_t('9gszw7uxRnGAM5fLT1KwMC')}</MarketTitle>
        <a
          href={addLangToPath('/markets')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackClick(['Market', '1'])}
        >
          <MarketLinkText>{_t('4Q2i99Wc1z2xWe1NJ6tvF4')}</MarketLinkText>
        </a>
        <MarketLinkDivider />
        <MarketLinkText
          onClick={() => {
            trackClick(['Help', '1']);
            setHelpModalShow(true);
          }}
        >
          {_t('4rAsd5Bj3UNBJiJvRan35X')}
        </MarketLinkText>
      </MarketHeader>
      <ExtendTabs
        value={activeTab}
        onChange={handleChangeActiveTab}
        size="medium"
        bordered
        direction={isRTL ? 'rtl' : 'ltr'}
      >
        {showFavorites && (
          <Tab
            data-inspector="account_overview_market_favorites"
            value="favorites"
            label={_t('uVGBLkPF8ouHxuLmQPLt51')}
          />
        )}

        {showHot && (
          <Tab
            data-inspector="account_overview_market_hot"
            value="hot"
            label={
              <>
                <FireIcon />
                {_t('26F8ma6qgohReUfwBsykae')}
              </>
            }
          />
        )}
      </ExtendTabs>
      {showSubTab ? (
        <SubTabsBox data-inspector="account_overview_market_favorites_sub">
          <ExtendSubTabs
            activeType="primary"
            variant="bordered"
            value={activeSubTab}
            onChange={handleChangeActiveSubTab}
          >
            {showSubTabSpot && (
              <Tab
                data-inspector="account_overview_market_favorites_spot"
                value="SPOT"
                label={_t('rkK63tLpjLSA1n3rSqBwJU')}
              />
            )}
            {showSubTabFuture && (
              <Tab
                data-inspector="account_overview_market_favorites_future"
                value="FUTURE"
                label={_t('kQ8P5e8djN1ZfoRXZ9FmUX')}
              />
            )}
          </ExtendSubTabs>
        </SubTabsBox>
      ) : null}
      <ExtendTable
        loading={tableLoading}
        dataSource={(activeTab === 'hot' ? hotMarketList : favoriteMarketList) || []}
        columns={columns}
        rowKey={(record) => `${record?.contract?.symbol}_${record.symbol}`}
        size="small"
        locale={{
          emptyText: _t('hoqk98pcivrSHjEds7SCJP'),
        }}
      />
      <HelpModal show={helpModalShow} onCancel={() => setHelpModalShow(false)} />
    </MarketWrapper>
  );
};

export default OverviewMarket;
